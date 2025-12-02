import { axiosInstance } from "@/lib/axios";

export const createCouponService = async (data) => {
  const res = await axiosInstance.post("/api/coupons", data);
  return res.data.data;
};

export const fetchCouponsService = async () => {
  const res = await axiosInstance.get("/api/coupons");
  return res.data.data;
};

export const deleteCouponService = async (couponId) => {
  const res = await axiosInstance.delete(`/api/coupons/${couponId}`);
  return res.data.data;
};
