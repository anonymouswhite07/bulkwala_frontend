import { axiosInstance } from "@/lib/axios";

export const startOfferService = async (data) => {
  const res = await axiosInstance.post("/api/offers", data);
  return res.data.data;
};

export const fetchActiveOfferService = async () => {
  const res = await axiosInstance.get("/api/offers/active");
  return res.data.data;
};

export const deleteOfferService = async () => {
  const res = await axiosInstance.delete("/api/offers");
  return res.data.data;
};
