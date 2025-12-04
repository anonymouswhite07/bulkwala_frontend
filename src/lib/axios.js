import axios from "axios";
import useAuthStore from "@/store/auth.store";

// Main axios instance with cross-browser cookie handling
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // ✅ Critical for cross-browser cookie handling
  headers: { 
    "Content-Type": "application/json",
  },
});

// Secondary raw instance (no interceptors) with credentials for refresh
// This prevents infinite loops in token refresh
export const axiosRefresh = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // ✅ Critical for cross-browser cookie handling
});

// Enhanced interceptor with better error handling for cross-browser compatibility
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle both 401 and 419 status codes (some backends use 419 for token expiration)
    if ((error.response?.status === 401 || error.response?.status === 419) 
        && !originalRequest._retry) {

      originalRequest._retry = true;

      try {
        // Use separate axios instance for refresh to avoid infinite loop
        await axiosRefresh.post("/api/users/refresh-token");

        // Retry original request
        return axiosInstance(originalRequest);

      } catch (err) {
        console.log("Token refresh failed:", err);

        // Logout user on refresh failure
        try {
          const { logout } = useAuthStore.getState();
          logout();
        } catch (logoutError) {
          console.log("Error during logout:", logoutError);
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);