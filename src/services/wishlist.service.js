import { axiosInstance } from "@/lib/axios";

export const getWishlistService = async () => {
  const res = await axiosInstance.get("/api/wishlist");
  return res.data.data;
};

export const addToWishlistService = async (productId) => {
  const res = await axiosInstance.post("/api/wishlist", { productId });
  return res.data.data;
};

export const removeFromWishlistService = async (productId) => {
  const res = await axiosInstance.delete(`/api/wishlist/${productId}`);
  return res.data.data;
};

export const clearWishlistService = async () => {
  const res = await axiosInstance.delete("/api/wishlist/clear");
  return res.data.data;
};
