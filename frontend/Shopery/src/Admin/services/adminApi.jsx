// Admin API - API calls cho Admin
import axiosInstance from '../../common/services/axiosInstance'

export const adminApi = {
  // Dashboard
  getDashboardStats: async () => {
    return await axiosInstance.get('/admin/dashboard/stats')
  },

  // Users Management
  getAllUsers: async (params = {}) => {
    return await axiosInstance.get('/admin/users', { params })
  },

  getUserDetail: async (userId) => {
    return await axiosInstance.get(`/admin/users/${userId}`)
  },

  updateUserStatus: async (userId, status) => {
    return await axiosInstance.put(`/admin/users/${userId}/status`, { status })
  },

  deleteUser: async (userId) => {
    return await axiosInstance.delete(`/admin/users/${userId}`)
  },

  // Products Management
  getAllProducts: async (params = {}) => {
    return await axiosInstance.get('/admin/products', { params })
  },

  createProduct: async (productData) => {
    return await axiosInstance.post('/admin/products', productData)
  },

  updateProduct: async (productId, productData) => {
    return await axiosInstance.put(`/admin/products/${productId}`, productData)
  },

  deleteProduct: async (productId) => {
    return await axiosInstance.delete(`/admin/products/${productId}`)
  },

  // Categories Management
  getAllCategories: async () => {
    return await axiosInstance.get('/admin/categories')
  },

  createCategory: async (categoryData) => {
    return await axiosInstance.post('/admin/categories', categoryData)
  },

  updateCategory: async (categoryId, categoryData) => {
    return await axiosInstance.put(`/admin/categories/${categoryId}`, categoryData)
  },

  deleteCategory: async (categoryId) => {
    return await axiosInstance.delete(`/admin/categories/${categoryId}`)
  },

  // Orders Management
  getAllOrders: async (params = {}) => {
    return await axiosInstance.get('/admin/orders', { params })
  },

  getOrderDetail: async (orderId) => {
    return await axiosInstance.get(`/admin/orders/${orderId}`)
  },

  updateOrderStatus: async (orderId, status) => {
    return await axiosInstance.put(`/admin/orders/${orderId}/status`, { status })
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    return await axiosInstance.get('/admin/analytics', { params })
  },

  getSalesReport: async (params = {}) => {
    return await axiosInstance.get('/admin/analytics/sales', { params })
  },

  getUsersReport: async (params = {}) => {
    return await axiosInstance.get('/admin/analytics/users', { params })
  },

  // Settings
  getSystemSettings: async () => {
    return await axiosInstance.get('/admin/settings')
  },

  updateSystemSettings: async (settings) => {
    return await axiosInstance.put('/admin/settings', settings)
  },
}
