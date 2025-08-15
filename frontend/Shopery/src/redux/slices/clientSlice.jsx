// Client Slice - Chỉ dành cho Client
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { clientApi } from '../../Client/services/clientApi'

// Async thunks cho Client
export const fetchFeaturedProducts = createAsyncThunk(
  'client/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientApi.getFeaturedProducts()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải sản phẩm nổi bật')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'client/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientApi.getCategories()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh mục')
    }
  }
)

export const fetchProducts = createAsyncThunk(
  'client/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await clientApi.getProducts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải sản phẩm')
    }
  }
)

export const addToCart = createAsyncThunk(
  'client/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await clientApi.addToCart(productId, quantity)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng')
    }
  }
)

export const fetchCart = createAsyncThunk(
  'client/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientApi.getCart()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải giỏ hàng')
    }
  }
)

const initialState = {
  // Products
  featuredProducts: [],
  products: [],
  productDetail: null,
  totalProducts: 0,
  currentPage: 1,
  
  // Categories
  categories: [],
  
  // Cart
  cart: {
    items: [],
    total: 0,
    itemCount: 0,
  },
  
  // Wishlist
  wishlist: [],
  
  // Search
  searchResults: [],
  searchQuery: '',
  
  // Filters
  filters: {
    category: '',
    priceRange: [0, 1000000],
    sortBy: 'newest',
  },
  
  // Loading states
  isLoading: false,
  isProductsLoading: false,
  isCartLoading: false,
  
  // Error states
  error: null,
  productsError: null,
  cartError: null,
}

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.productsError = null
      state.cartError = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    clearProductDetail: (state) => {
      state.productDetail = null
    },
    updateCartItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload
      const item = state.cart.items.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
        // Recalculate total
        state.cart.total = state.cart.items.reduce((total, item) => 
          total + (item.price * item.quantity), 0
        )
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload
      state.cart.items = state.cart.items.filter(item => item.id !== itemId)
      state.cart.itemCount = state.cart.items.length
      state.cart.total = state.cart.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      )
    },
  },
  extraReducers: (builder) => {
    builder
      // Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.featuredProducts = action.payload
        state.error = null
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      
      // Products
      .addCase(fetchProducts.pending, (state) => {
        state.isProductsLoading = true
        state.productsError = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isProductsLoading = false
        state.products = action.payload.products
        state.totalProducts = action.payload.total
        state.productsError = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isProductsLoading = false
        state.productsError = action.payload
      })
      
      // Cart
      .addCase(fetchCart.pending, (state) => {
        state.isCartLoading = true
        state.cartError = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isCartLoading = false
        state.cart = action.payload
        state.cartError = null
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isCartLoading = false
        state.cartError = action.payload
      })
      
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload
      })
  },
})

export const { 
  clearError, 
  setCurrentPage, 
  setFilters, 
  setSearchQuery,
  clearProductDetail,
  updateCartItemQuantity,
  removeFromCart
} = clientSlice.actions

export default clientSlice.reducer
