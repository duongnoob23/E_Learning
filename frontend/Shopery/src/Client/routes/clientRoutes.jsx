// Client/routes/clientRoutes.jsx (cập nhật)
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../routes/PrivateRoute";
import PublicRoute from "../../routes/PublicRoute";

// Layout
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

// Pages
import Home from "../pages/Home/Home";
import Flashcard from "../pages/Flashcard/Flashcard";
import Blog from "../pages/Blog/Blog";

// Auth Pages
import Login from "../../Client/pages/Auth/Login/Login";
import Register from "../../Client/pages/Auth/Register/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";

const ClientLayout = ({ children }) => (
  <div className="client-layout">
    //
    <Header />
    <main className="client-main">{children}</main>
    <Footer />
  </div>
);

const ClientRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES - Không cần đăng nhập */}

      {/* Home Route - Luôn có thể truy cập */}
      <Route
        path="/"
        element={
          <ClientLayout>
            <Home />
          </ClientLayout>
        }
      />

      {/* Auth Routes - Login & Register với Header/Footer */}
      <Route
        path="/login"
        element={
          <PublicRoute restricted={true}>
            <ClientLayout>
              <Login />
            </ClientLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute restricted={true}>
            <ClientLayout>
              <Register />
            </ClientLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute restricted={true}>
            <ClientLayout>
              <ForgotPassword />
            </ClientLayout>
          </PublicRoute>
        }
      />

      {/* PRIVATE ROUTES - Cần đăng nhập client */}

      {/* Flashcard Routes */}
      <Route
        path="/flashcard"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <Flashcard />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/flashcard/topic/:topicId"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <Flashcard />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      {/* Blog Route */}
      <Route
        path="/blog"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <Blog />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      {/* Catch all - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ClientRoutes;
