// Client Routes Configuration
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../../routes/PrivateRoute'

// Layout
import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer/Footer'

// Pages
import Home from '../pages/Home/Home'
// import ProductsList from '../pages/Products/ProductsList'
// import ProductDetail from '../pages/Products/ProductDetail'
// import Cart from '../pages/Cart/Cart'
// import Checkout from '../pages/Checkout/Checkout'
// import Profile from '../pages/Profile/Profile'
// import Orders from '../pages/Orders/Orders'
// import Wishlist from '../pages/Wishlist/Wishlist'

const ClientLayout = ({ children }) => (
  <div className="client-layout">
    <Header />
    <main className="client-main">
      {children}
    </main>
    <Footer />
  </div>
)

const ClientRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <ClientLayout>
          <Home />
        </ClientLayout>
      } />
      
      {/* <Route path="/products" element={
        <ClientLayout>
          <ProductsList />
        </ClientLayout>
      } />
      
      <Route path="/products/:id" element={
        <ClientLayout>
          <ProductDetail />
        </ClientLayout>
      } /> */}
      
      {/* Protected Routes */}
      {/* <Route path="/cart" element={
        <ProtectedRoute requiredRole="client">
          <ClientLayout>
            <Cart />
          </ClientLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/checkout" element={
        <ProtectedRoute requiredRole="client">
          <ClientLayout>
            <Checkout />
          </ClientLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute requiredRole="client">
          <ClientLayout>
            <Profile />
          </ClientLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute requiredRole="client">
          <ClientLayout>
            <Orders />
          </ClientLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/wishlist" element={
        <ProtectedRoute requiredRole="client">
          <ClientLayout>
            <Wishlist />
          </ClientLayout>
        </ProtectedRoute>
      } /> */}
    </Routes>
  )
}

export default ClientRoutes
