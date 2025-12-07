import axiosInstance from "../axiosInstance";

/**
 * Dictionary API Service
 * Tích hợp với backend dictionary endpoint
 */
export const dictionaryApi = {
  /**
   * Tra từ điển (search-as-you-type - trả về list)
   * @param {string} word - Từ cần tra
   * @param {string} type - Loại tra: "en-vi" | "vi-en"
   * @returns {Promise} Response từ backend
   */
  search: async (word, type = "en-vi") => {
    const response = await axiosInstance.get("/dictionary/search", {
      params: { word, type, exact: false },
    });
    
    // Backend trả về format: { EM, EC, DT }
    // Trả về DT (data) hoặc throw error nếu EC !== "0"
    if (response.data.EC === "0") {
      return response.data.DT;
    } else {
      throw new Error(response.data.EM || "Có lỗi xảy ra khi tra từ");
    }
  },

  /**
   * Lấy chi tiết 1 từ (khi click vào từ trong list)
   * @param {string} word - Từ cần lấy chi tiết
   * @param {string} type - Loại tra: "en-vi" | "vi-en"
   * @returns {Promise} Response từ backend
   */
  getDetail: async (word, type = "en-vi") => {
    const response = await axiosInstance.get("/dictionary/search", {
      params: { word, type, exact: true },
    });
    
    if (response.data.EC === "0") {
      return response.data.DT;
    } else {
      throw new Error(response.data.EM || "Có lỗi xảy ra khi tra từ");
    }
  },
};

// Export default để tương thích với code cũ
export const searchDictionary = ({ word, type = "en-vi" }) => {
  return dictionaryApi.search(word, type);
};

