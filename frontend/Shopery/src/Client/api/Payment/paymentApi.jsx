// frontend/Shopery/src/Client/api/Payment/paymentApi.jsx
import axiosInstance from "../../../lib/axiosInstance";

export const paymentApi = {
  // Tạo đơn hàng và lấy payment URL
  createOrder: async (courses, couponCode = null) => {
    const response = await axiosInstance.post("/payment/order", {
      courses: courses.map((c) => ({ course_id: c.course_id })),
      coupon_code: couponCode,
    });
    return response.data;
  },

  // Lấy lịch sử đơn hàng
  getMyOrders: async () => {
    const response = await axiosInstance.get("/payment/orders");
    return response.data;
  },

  // Lấy thông tin đơn hàng theo order number
  getOrderByNumber: async (orderNumber) => {
    const response = await axiosInstance.get(`/payment/order/${orderNumber}`);
    return response.data;
  },
};
