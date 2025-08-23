// helpers/responseHandler.js
export const normalizeAuthResponse = (response) => {
  if (!response?.data || typeof response.data !== "object") {
    return { EM: "Response từ server không hợp lệ", EC: "-1", DT: null };
  }

  const { EM, EC, DT } = response.data;
  return {
    EM: EM || "Không rõ thông báo",
    EC: EC || "-1",
    DT: DT || null,
  };
};

export const normalizeError = (error) => {
  if (error.response?.data) {
    return {
      EM: error.response.data.EM || "Đăng nhập thất bại",
      EC: error.response.data.EC || "-3",
      DT: error.response.data.DT || null,
    };
  }
  return { EM: "Không thể kết nối đến server", EC: "-4", DT: null };
};
