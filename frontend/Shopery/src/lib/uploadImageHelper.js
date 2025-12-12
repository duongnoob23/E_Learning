// Helper function để upload ảnh lên server
import axiosInstance from "./axiosInstance";

const API_BASE_URL = "http://localhost:5000";

/**
 * Upload ảnh lên server và trả về URL
 * @param {File} file - File ảnh cần upload
 * @returns {Promise<string>} - URL của ảnh sau khi upload
 */
export const uploadImage = async (file) => {
  try {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("File phải là ảnh");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.post(
      `${API_BASE_URL}/instructor/lessons/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.EC === "0" && response.data.DT?.image_url) {
      // Trả về full URL
      return `${API_BASE_URL}${response.data.DT.image_url}`;
    } else {
      throw new Error(response.data.EM || "Upload ảnh thất bại");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Convert blob URL thành File object
 * @param {string} blobUrl - Blob URL
 * @returns {Promise<File>} - File object
 */
export const blobUrlToFile = async (blobUrl) => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const filename = `image-${Date.now()}.${blob.type.split("/")[1]}`;
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error converting blob URL to file:", error);
    throw error;
  }
};

/**
 * Convert blob URL thành server URL bằng cách upload
 * @param {string} blobUrl - Blob URL cần convert
 * @returns {Promise<string>} - Server URL
 */
export const convertBlobUrlToServerUrl = async (blobUrl) => {
  try {
    // Nếu đã là server URL thì trả về luôn
    if (blobUrl.startsWith("http://") || blobUrl.startsWith("https://")) {
      // Kiểm tra xem có phải blob URL không
      if (!blobUrl.startsWith("blob:")) {
        return blobUrl; // Đã là server URL
      }
    }

    // Convert blob URL thành File
    const file = await blobUrlToFile(blobUrl);
    
    // Upload lên server
    const serverUrl = await uploadImage(file);
    
    // Revoke blob URL để giải phóng memory
    URL.revokeObjectURL(blobUrl);
    
    return serverUrl;
  } catch (error) {
    console.error("Error converting blob URL to server URL:", error);
    throw error;
  }
};

