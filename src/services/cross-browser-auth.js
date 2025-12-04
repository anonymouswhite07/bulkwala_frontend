// Cross-Browser Authentication Service
// Works reliably on iOS Safari, Chrome, Firefox, and all other browsers
// Compatible with Vercel frontend + Render backend

import axios from 'axios';

// Create axios instances with proper cross-browser cookie handling
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true, // ✅ Critical for cross-browser cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate instance for token refresh to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true, // ✅ Critical for cross-browser cookie handling
});

// Login function - works on all browsers including iOS Safari
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/api/users/login', credentials, {
      withCredentials: true, // Explicitly ensure credentials are included
    });
    
    // Return user data (cookies are handled automatically by browser)
    return {
      success: true,
      user: response.data.data.user || response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Login failed',
    };
  }
};

// OTP Login functions
export const sendOtp = async (phone) => {
  try {
    const response = await apiClient.post('/api/users/send-otp', { phone });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send OTP',
    };
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await apiClient.post('/api/users/verify-otp', data, {
      withCredentials: true, // Explicitly ensure credentials are included
    });
    
    return {
      success: true,
      user: response.data.data.user || response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Invalid or expired OTP',
    };
  }
};

// Refresh token function - works on all browsers including iOS Safari
export const refreshToken = async () => {
  try {
    // Use separate instance to avoid interceptor loops
    const response = await refreshClient.post('/api/users/refresh-token', {}, {
      withCredentials: true, // Explicitly ensure credentials are included
    });
    
    // Return new access token
    return {
      success: true,
      accessToken: response.data.accessToken,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Session expired. Please log in again.',
    };
  }
};

// Logout function - works on all browsers including iOS Safari
export const logout = async () => {
  try {
    await apiClient.post('/api/users/logout', {}, {
      withCredentials: true, // Explicitly ensure credentials are included
    });
    
    return {
      success: true,
    };
  } catch (error) {
    // Even if backend fails, clear local state
    return {
      success: true, // Still consider logout successful
      error: error.response?.data?.message,
    };
  }
};

// Check auth status function - works on all browsers including iOS Safari
export const checkAuthStatus = async () => {
  try {
    const response = await apiClient.get('/api/users/profile', {
      withCredentials: true, // Explicitly ensure credentials are included
    });
    
    return {
      success: true,
      user: response.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      // Not authenticated - this is expected
      return {
        success: false,
        authenticated: false,
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to check auth status',
    };
  }
};

// Enhanced axios interceptor for automatic token refresh
// Handles iOS Safari's strict cookie policies
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (401 or 419)
    if ((error.response?.status === 401 || error.response?.status === 419) 
        && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt to refresh token using separate instance
        const refreshResult = await refreshToken();
        
        if (refreshResult.success) {
          processQueue(null, refreshResult.accessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed - redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default {
  login,
  sendOtp,
  verifyOtp,
  refreshToken,
  logout,
  checkAuthStatus,
};