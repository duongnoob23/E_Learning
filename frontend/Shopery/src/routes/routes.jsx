// Main Routes Configuration - Kết hợp Admin và Client routes
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import ClientRoutes from "./ClientRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Client Routes - Catch all other routes */}
      <Route path="/*" element={<ClientRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
