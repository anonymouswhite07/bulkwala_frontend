// Safari-Compatible Authentication Service
// Works reliably on iOS Safari, Chrome, Firefox, and all other browsers

import axios from 'axios';

// Create axios instances with proper Safari cookie handling
const authApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true, // ✅ Critical for Safari cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true, // ✅ Critical for Safari cookie handling
});

// Login function - works on iOS Safari
export const login = async (credentials) => {
  try {
    const response = await authApi.post('/api/users/login', credentials, {
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
    const response = await authApi.post('/api/users/send-otp', { phone });
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
    const response = await authApi.post('/api/users/verify-otp', data, {
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

// Refresh token function - works on iOS Safari
export const refreshToken = async () => {
  try {
    // Use separate instance to avoid interceptor loops
    const response = await refreshApi.post('/api/users/refresh-token', {}, {
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

// Logout function - works on iOS Safari
export const logout = async () => {
  try {
    await authApi.post('/api/users/logout', {}, {
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

// Check auth status function - works on iOS Safari
export const checkAuthStatus = async () => {
  try {
    const response = await authApi.get('/api/users/profile', {
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
// Handles Safari's strict cookie policies
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (401 or 419)
    if ((error.response?.status === 401 || error.response?.status === 419) 
        && !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token using separate instance
        await refreshToken();
        
        // Retry original request
        return authApi(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
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