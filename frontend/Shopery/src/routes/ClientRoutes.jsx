// Client Routes Configuration
import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Auth Pages
import Login from "../common/pages/Auth/Login/Login";

// Client Layout
import Header from "../Client/components/layout/Header/Header";
import Footer from "../Client/components/layout/Footer/Footer";

// Client Pages
import Home from "../Client/pages/Home/Home";
// import ProductsList from '../Client/pages/Products/ProductsList'
// import Cart from '../Client/pages/Cart/Cart'

// Client Layout Component
const ClientLayout = ({ children }) => (
  <div className="client-layout">
    <Header />
    <main className="client-main">{children}</main>
    <Footer />
  </div>
);

const ClientRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - No Layout */}
      <Route
        path="/login"
        element={
          <PublicRoute restricted={true} redirectPath="/">
            <Login isAdmin={false} />
          </PublicRoute>
        }
      />

      {/* <Route path="/register" element={
        <PublicRoute restricted={true} redirectPath="/">
          <Register />
        </PublicRoute>
      } /> */}

      {/* Public Routes - Home có thể truy cập mà không cần đăng nhập */}
      <Route
        path="/"
        element={
          <ClientLayout>
            <Home />
          </ClientLayout>
        }
      />

      {/* Protected Routes - Cần đăng nhập */}
      {/* <Route path="/courses" element={
        <PrivateRoute requiredRole="client" fallbackPath="/login">
          <ClientLayout>
            <Courses />
          </ClientLayout>
        </PrivateRoute>
      } /> */}

      {/* <Route path="/cart" element={
        <PrivateRoute requiredRole="client" fallbackPath="/login">
          <ClientLayout>
            <Cart />
          </ClientLayout>
        </PrivateRoute>
      } /> */}
    </Routes>
  );
};

export default ClientRoutes;
