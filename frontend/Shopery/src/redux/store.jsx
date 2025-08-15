// Redux Store - Dùng chung cho Admin và Client
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import adminSlice from './slices/adminSlice'
import clientSlice from './slices/clientSlice'

export const store = configureStore({
  reducer: {
    // Shared slices
    auth: authSlice,
    
    // Admin-specific slices
    admin: adminSlice,
    
    // Client-specific slices
    client: clientSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
