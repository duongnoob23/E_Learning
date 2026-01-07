import adminAxiosInstance from "../../../api/adminAuthApi";

export const transactionsAdminApi = {
  getTransactions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);
    if (params.payment_status) queryParams.append("payment_status", params.payment_status);
    if (params.order_status) queryParams.append("order_status", params.order_status);
    if (params.payment_method) queryParams.append("payment_method", params.payment_method);
    if (params.from_date) queryParams.append("from_date", params.from_date);
    if (params.to_date) queryParams.append("to_date", params.to_date);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `/admin/transactions${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  getTransactionDetail: async (orderId) =>
    (await adminAxiosInstance.get(`/admin/transactions/${orderId}`)).data,

  getTransactionStats: async () =>
    (await adminAxiosInstance.get("/admin/transactions/stats")).data,

  getRevenueByPeriod: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.append("period", params.period);
    if (params.year) queryParams.append("year", params.year);

    const queryString = queryParams.toString();
    const url = `/admin/transactions/revenue${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  exportTransactions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.from_date) queryParams.append("from_date", params.from_date);
    if (params.to_date) queryParams.append("to_date", params.to_date);
    if (params.payment_status) queryParams.append("payment_status", params.payment_status);
    if (params.format) queryParams.append("format", params.format);

    const queryString = queryParams.toString();
    const url = `/admin/transactions/export${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },
};

