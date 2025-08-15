// Admin Dashboard Page
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardStats } from "../../../redux/slices/adminSlice";
import Button from "../../../common/components/Button/Button";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Tổng quan hệ thống E-commerce</p>
      </div>

      <div className="dashboard-stats">
        <div className="stats-card blue">
          <div className="stats-icon">👥</div>
          <div className="stats-content">
            <h3>Tổng người dùng</h3>
            <div className="stats-number">{stats?.totalUsers || 0}</div>
            <div className="stats-trend positive">+12%</div>
          </div>
        </div>

        <div className="stats-card green">
          <div className="stats-icon">📦</div>
          <div className="stats-content">
            <h3>Tổng sản phẩm</h3>
            <div className="stats-number">{stats?.totalProducts || 0}</div>
            <div className="stats-trend positive">+8%</div>
          </div>
        </div>

        <div className="stats-card orange">
          <div className="stats-icon">🛒</div>
          <div className="stats-content">
            <h3>Đơn hàng hôm nay</h3>
            <div className="stats-number">{stats?.todayOrders || 0}</div>
            <div className="stats-trend positive">+15%</div>
          </div>
        </div>

        <div className="stats-card purple">
          <div className="stats-icon">💰</div>
          <div className="stats-content">
            <h3>Doanh thu tháng</h3>
            <div className="stats-number">
              {(stats?.monthlyRevenue || 0).toLocaleString("vi-VN")}đ
            </div>
            <div className="stats-trend positive">+25%</div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Button variant="primary">Thêm sản phẩm mới</Button>
        <Button variant="secondary">Xem báo cáo</Button>
        <Button variant="outline">Quản lý đơn hàng</Button>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Biểu đồ doanh thu</h3>
          <div className="chart-placeholder">
            <p>Biểu đồ sẽ được hiển thị ở đây</p>
          </div>
        </div>

        <div className="chart-container">
          <h3>Đơn hàng gần đây</h3>
          <div className="recent-orders">
            <div className="order-item">
              <span className="order-id">#12345</span>
              <span className="order-customer">Nguyễn Văn A</span>
              <span className="order-amount">500,000đ</span>
              <span className="order-status pending">Chờ xử lý</span>
            </div>
            <div className="order-item">
              <span className="order-id">#12346</span>
              <span className="order-customer">Trần Thị B</span>
              <span className="order-amount">750,000đ</span>
              <span className="order-status completed">Hoàn thành</span>
            </div>
            <div className="order-item">
              <span className="order-id">#12347</span>
              <span className="order-customer">Lê Văn C</span>
              <span className="order-amount">300,000đ</span>
              <span className="order-status processing">Đang xử lý</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
