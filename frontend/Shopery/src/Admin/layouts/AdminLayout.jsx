import React from "react";
import Sidebar from "../shared/components/Sidebar";
import "./AdminLayout.scss";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-layout__main">
        {/* <header className="admin-layout__header">
          <h1 className="admin-layout__title">Dashboard</h1>
          <div className="admin-layout__user">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="admin-layout__avatar"
            />
            <span className="admin-layout__username">Admin</span>
          </div>
        </header> */}

        <div className="admin-layout__content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
