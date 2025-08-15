// Admin Slice - Chỉ dành cho Admin
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { adminApi } from '../../Admin/services/adminApi'

// Async thunks cho Admin
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getDashboardStats()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải thống kê')
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAllUsers(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách người dùng')
    }
  }
)

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateUserStatus(userId, status)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái người dùng')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminApi.deleteUser(userId)
      return userId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa người dùng')
    }
  }
)

const initialState = {
  // Dashboard
  stats: {
    totalUsers: 0,
    totalProducts: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
  },
  
  // Users Management
  users: [],
  totalUsers: 0,
  currentPage: 1,
  
  // Products Management
  products: [],
  totalProducts: 0,
  
  // Orders Management
  orders: [],
  totalOrders: 0,
  
  // Loading states
  isLoading: false,
  isUsersLoading: false,
  isProductsLoading: false,
  isOrdersLoading: false,
  
  // Error states
  error: null,
  usersError: null,
  productsError: null,
  ordersError: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.usersError = null
      state.productsError = null
      state.ordersError = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    clearUsers: (state) => {
      state.users = []
      state.totalUsers = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
        state.error = null
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isUsersLoading = true
        state.usersError = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false
        state.users = action.payload.users
        state.totalUsers = action.payload.total
        state.usersError = null
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isUsersLoading = false
        state.usersError = action.payload
      })
      
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload
        const index = state.users.findIndex(user => user.id === updatedUser.id)
        if (index !== -1) {
          state.users[index] = updatedUser
        }
      })
      
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload
        state.users = state.users.filter(user => user.id !== userId)
        state.totalUsers -= 1
      })
  },
})

export const { clearError, setCurrentPage, clearUsers } = adminSlice.actions
export default adminSlice.reducer
