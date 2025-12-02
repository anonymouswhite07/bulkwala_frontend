import { axiosInstance } from "@/lib/axios";

export const createReferralService = async (data) => {
  const res = await axiosInstance.post("/api/referrals", data);
  return res.data.data;
};

export const fetchReferralsService = async () => {
  const res = await axiosInstance.get("/api/referrals");
  return res.data.data;
};

export const validateReferralService = async (data) => {
  const res = await axiosInstance.post("/api/referrals/validate", data);
  return res.data.data;
};

export const deleteReferralService = async (referralId) => {
  const res = await axiosInstance.delete(`/api/referrals/${referralId}`);
  return res.data.data;
};
