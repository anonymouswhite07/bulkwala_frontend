import { axiosInstance } from "@/lib/axios";

export const getAllBannersService = async () => {
  const res = await axiosInstance.get("/api/banners");
  return res.data.data;
};

export const getActiveBannersService = async () => {
  const res = await axiosInstance.get("/api/banners/active");
  return res.data.data;
};

export const uploadBannerService = async (formData) => {
  const res = await axiosInstance.post("/api/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const toggleBannerService = async (id) => {
  const res = await axiosInstance.put(`/api/banners/${id}`);
  return res.data.data;
};

export const deleteBannerService = async (id) => {
  const res = await axiosInstance.delete(`/api/banners/${id}`);
  return res.data.data;
};
