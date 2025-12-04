import { axiosInstance } from "@/lib/axios";

export const createOrderService = async (payload) => {
  const res = await axiosInstance.post(`/api/order/`, payload, {
    withCredentials: true,
  });

  return res.data.data;
};

export const verifyOrderService = async (payload) => {
  const res = await axiosInstance.post(`/api/order/verify-payment`, payload, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getSingleOrderService = async (orderId) => {
  const res = await axiosInstance.get(`/api/order/${orderId}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getMyOrdersService = async () => {
  const res = await axiosInstance.get("/api/order/my-orders", {
    withCredentials: true,
  });
  return res.data.data;
};

export const cancelOrderService = async (orderId) => {
  const res = await axiosInstance.post(
    `/api/order/${orderId}/cancel`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};

// 🔹 Track Order (Delhivery Tracking)
export const trackOrderService = async (orderId) => {
  const res = await axiosInstance.get(`/api/order/track/${orderId}`, {
    withCredentials: true,
  });
  return res.data.data;
};
