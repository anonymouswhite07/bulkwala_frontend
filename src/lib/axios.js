import axios from "axios";
import useAuthStore from "@/store/auth.store";

// Main instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Secondary raw instance (no interceptors)
const axiosRefresh = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

// Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 419)
        && !originalRequest._retry) {

      originalRequest._retry = true;

      try {
        // refresh without interceptor
        await axiosRefresh.post("/api/users/refresh-token");

        // retry request
        return axiosInstance(originalRequest);

      } catch (err) {
        console.log("Token refresh failed:", err);

        // logout
        const { logout } = useAuthStore.getState();
        logout();

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);