import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // IMPORTANT: allows sending cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Detect Safari browser
const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// No request interceptor needed (cookies auto included)

// Response interceptor — auto refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // For Safari, we need to use a different approach
        if (isSafari()) {
          // First, try the standard cookie-based refresh
          try {
            const refreshResponse = await axiosInstance.post("/api/users/refresh-token", {}, {
              withCredentials: true
            });
            
            // If successful, check if we got a new recovery token
            if (refreshResponse.data?.data?.recoveryToken) {
              localStorage.setItem('recoveryToken', refreshResponse.data.data.recoveryToken);
            }
          } catch (refreshError) {
            // If cookie-based refresh fails, try recovery token approach
            console.log("Safari cookie refresh failed, trying recovery token...");
            
            // Get recovery token from localStorage
            const recoveryToken = localStorage.getItem('recoveryToken');
            if (recoveryToken) {
              const recoveryResponse = await axiosInstance.post("/api/users/refresh-token", { 
                recoveryToken 
              }, {
                withCredentials: true
              });
              
              // Clear used recovery token
              localStorage.removeItem('recoveryToken');
              
              // Store new recovery token if provided
              if (recoveryResponse.data?.data?.recoveryToken) {
                localStorage.setItem('recoveryToken', recoveryResponse.data.data.recoveryToken);
              }
            } else {
              throw new Error('No recovery token available');
            }
          }
        } else {
          // For non-Safari browsers, use standard cookie-based refresh
          await axiosInstance.post("/api/users/refresh-token", {}, {
            withCredentials: true
          });
        }

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        // Clear auth state on refresh failure
        const { logout } = useAuthStore.getState();
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
