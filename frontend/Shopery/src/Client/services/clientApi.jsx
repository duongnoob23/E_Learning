// Client API - API calls cho Client
import axiosInstance from '../../common/services/axiosInstance'

export const clientApi = {
  // Products
  getFeaturedProducts: async () => {
    return await axiosInstance.get('/client/products/featured')
  },

  getProducts: async (params = {}) => {
    return await axiosInstance.get('/client/products', { params })
  },

  getProductDetail: async (productId) => {
    return await axiosInstance.get(`/client/products/${productId}`)
  },

  searchProducts: async (query, params = {}) => {
    return await axiosInstance.get('/client/products/search', { 
      params: { q: query, ...params } 
    })
  },

  // Categories
  getCategories: async () => {
    return await axiosInstance.get('/client/categories')
  },

  getCategoryProducts: async (categoryId, params = {}) => {
    return await axiosInstance.get(`/client/categories/${categoryId}/products`, { params })
  },

  // Cart
  getCart: async () => {
    return await axiosInstance.get('/client/cart')
  },

  addToCart: async (productId, quantity = 1) => {
    return await axiosInstance.post('/client/cart/add', { productId, quantity })
  },

  updateCartItem: async (itemId, quantity) => {
    return await axiosInstance.put(`/client/cart/items/${itemId}`, { quantity })
  },

  removeFromCart: async (itemId) => {
    return await axiosInstance.delete(`/client/cart/items/${itemId}`)
  },

  clearCart: async () => {
    return await axiosInstance.delete('/client/cart')
  },

  // Wishlist
  getWishlist: async () => {
    return await axiosInstance.get('/client/wishlist')
  },

  addToWishlist: async (productId) => {
    return await axiosInstance.post('/client/wishlist/add', { productId })
  },

  removeFromWishlist: async (productId) => {
    return await axiosInstance.delete(`/client/wishlist/${productId}`)
  },

  // Orders
  getOrders: async (params = {}) => {
    return await axiosInstance.get('/client/orders', { params })
  },

  getOrderDetail: async (orderId) => {
    return await axiosInstance.get(`/client/orders/${orderId}`)
  },

  createOrder: async (orderData) => {
    return await axiosInstance.post('/client/orders', orderData)
  },

  cancelOrder: async (orderId) => {
    return await axiosInstance.put(`/client/orders/${orderId}/cancel`)
  },

  // Reviews
  getProductReviews: async (productId, params = {}) => {
    return await axiosInstance.get(`/client/products/${productId}/reviews`, { params })
  },

  createReview: async (productId, reviewData) => {
    return await axiosInstance.post(`/client/products/${productId}/reviews`, reviewData)
  },

  updateReview: async (reviewId, reviewData) => {
    return await axiosInstance.put(`/client/reviews/${reviewId}`, reviewData)
  },

  deleteReview: async (reviewId) => {
    return await axiosInstance.delete(`/client/reviews/${reviewId}`)
  },

  // Address
  getAddresses: async () => {
    return await axiosInstance.get('/client/addresses')
  },

  createAddress: async (addressData) => {
    return await axiosInstance.post('/client/addresses', addressData)
  },

  updateAddress: async (addressId, addressData) => {
    return await axiosInstance.put(`/client/addresses/${addressId}`, addressData)
  },

  deleteAddress: async (addressId) => {
    return await axiosInstance.delete(`/client/addresses/${addressId}`)
  },

  setDefaultAddress: async (addressId) => {
    return await axiosInstance.put(`/client/addresses/${addressId}/default`)
  },
}
