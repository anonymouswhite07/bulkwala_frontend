import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // IMPORTANT: allows sending cookies
});

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
        // Call refresh endpoint — COOKIE will be used automatically
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
