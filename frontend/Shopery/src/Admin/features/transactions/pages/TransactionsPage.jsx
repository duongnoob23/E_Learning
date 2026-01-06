import React, { useMemo, useState } from "react";
import {
  HiCurrencyDollar,
  HiMagnifyingGlass,
  HiFunnel,
  HiChevronUpDown,
  HiEllipsisVertical,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiArrowPath,
  HiArrowDownTray,
  HiCalendarDays,
  HiBanknotes,
} from "react-icons/hi2";
import { useAdminTransactions, useAdminTransactionStats } from "../hooks/useTransactionsAdminQueries";
import { useExportTransactions } from "../hooks/useTransactionsAdminMutations";
import TransactionDetailModal from "../components/TransactionDetailModal";
import "./TransactionsPage.scss";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatPaymentStatus(status) {
  const statusMap = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    failed: "Thất bại",
    refunded: "Đã hoàn tiền",
  };
  return statusMap[status] || status;
}

function formatOrderStatus(status) {
  const statusMap = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
  };
  return statusMap[status] || status;
}

function formatPaymentMethod(method) {
  const methodMap = {
    vnpay: "VNPay",
    momo: "MoMo",
    zalopay: "ZaloPay",
    bank_transfer: "Chuyển khoản",
    cod: "COD",
    free: "Miễn phí",
  };
  return methodMap[method] || method;
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const rowsPerPage = 10;
  
  const filters = {
    page: currentPage,
    limit: rowsPerPage,
    sort: sortOrder,
    order: sortBy,
    ...(paymentStatusFilter !== "all" && { payment_status: paymentStatusFilter }),
    ...(paymentMethodFilter !== "all" && { payment_method: paymentMethodFilter }),
    ...(search && { search }),
    ...(fromDate && { from_date: fromDate }),
    ...(toDate && { to_date: toDate }),
  };

  const { data: transactionsData, isLoading, error, refetch } = useAdminTransactions(filters);
  const { data: statsData } = useAdminTransactionStats();
  const exportMutation = useExportTransactions();

  const orders = useMemo(() => {
    return transactionsData?.DT?.orders || [];
  }, [transactionsData]);

  const pagination = useMemo(() => {
    return transactionsData?.DT?.pagination || {
      current_page: currentPage,
      total_pages: 1,
      total_items: orders.length,
      items_per_page: rowsPerPage,
    };
  }, [transactionsData, currentPage, orders.length, rowsPerPage]);

  const stats = statsData?.DT || {
    total_orders: 0,
    pending_payments: 0,
    paid_payments: 0,
    failed_payments: 0,
    total_revenue: 0,
    today_revenue: 0,
    today_orders: 0,
  };

  const totalPages = pagination.total_pages || 1;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = () => {
    exportMutation.mutate({
      from_date: fromDate,
      to_date: toDate,
      payment_status: paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setPaymentStatusFilter("all");
    setPaymentMethodFilter("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <div className="transactions-page-root">
      {/* Breadcrumb */}
      <div className="transactions-page__breadcrumb">
        <span>Home / <b>Transactions</b></span>
      </div>

      {/* Header */}
      <div className="transactions-page__header-row">
        <h1 className="transactions-page__title">Quản lý Giao dịch</h1>
        <button
          className="transactions-page__btn transactions-page__btn--primary"
          onClick={handleExport}
          disabled={exportMutation.isPending}
        >
          <HiArrowDownTray /> {exportMutation.isPending ? "Đang xuất..." : "Xuất báo cáo"}
        </button>
      </div>

      {/* Stats */}
      <div className="transactions-page__stats-row">
        <div className="transactions-page__stat-card">
          <div className="transactions-page__stat-icon" style={{ background: "#e0f2fe" }}>
            <HiBanknotes style={{ color: "#0ea5e9" }} />
          </div>
          <div className="transactions-page__stat-data">
            <div className="transactions-page__stat-title">Tổng đơn hàng</div>
            <div className="transactions-page__stat-value">{stats.total_orders}</div>
          </div>
        </div>
        <div className="transactions-page__stat-card">
          <div className="transactions-page__stat-icon" style={{ background: "#d1fae5" }}>
            <HiCheckCircle style={{ color: "#10b981" }} />
          </div>
          <div className="transactions-page__stat-data">
            <div className="transactions-page__stat-title">Đã thanh toán</div>
            <div className="transactions-page__stat-value">{stats.paid_payments}</div>
          </div>
        </div>
        <div className="transactions-page__stat-card">
          <div className="transactions-page__stat-icon" style={{ background: "#fef3c7" }}>
            <HiClock style={{ color: "#f59e0b" }} />
          </div>
          <div className="transactions-page__stat-data">
            <div className="transactions-page__stat-title">Chờ thanh toán</div>
            <div className="transactions-page__stat-value">{stats.pending_payments}</div>
          </div>
        </div>
        <div className="transactions-page__stat-card">
          <div className="transactions-page__stat-icon" style={{ background: "#dcfce7" }}>
            <HiCurrencyDollar style={{ color: "#22c55e" }} />
          </div>
          <div className="transactions-page__stat-data">
            <div className="transactions-page__stat-title">Tổng doanh thu</div>
            <div className="transactions-page__stat-value">{formatCurrency(stats.total_revenue)}</div>
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="transactions-page__table-wrapper">
        <div className="transactions-page__table-header-row">
          <h2 className="transactions-page__table-title">Danh sách giao dịch</h2>
          <div className="transactions-page__table-tools">
            {/* Search */}
            <div className="transactions-page__table-search">
              <input
                type="text"
                placeholder="Tìm mã đơn hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="transactions-page__search-icon"><HiMagnifyingGlass /></span>
            </div>

            {/* Date Filter */}
            <div className="transactions-page__date-filter">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="Từ ngày"
              />
              <span>-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="Đến ngày"
              />
            </div>

            {/* Filter */}
            <div className="transactions-page__table-filter-wrapper">
              <button
                className="transactions-page__table-tool-btn"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <HiFunnel /> Lọc
              </button>
              {showFilterMenu && (
                <div className="transactions-page__filter-dropdown">
                  <div className="transactions-page__filter-group">
                    <label>Trạng thái thanh toán</label>
                    {["all", "pending", "paid", "failed", "refunded"].map((status) => (
                      <label key={status} className="transactions-page__filter-option">
                        <input
                          type="radio"
                          name="paymentStatusFilter"
                          checked={paymentStatusFilter === status}
                          onChange={() => setPaymentStatusFilter(status)}
                        />
                        {status === "all" ? "Tất cả" : formatPaymentStatus(status)}
                      </label>
                    ))}
                  </div>
                  <div className="transactions-page__filter-group">
                    <label>Phương thức thanh toán</label>
                    {["all", "vnpay", "momo", "zalopay", "bank_transfer", "free"].map((method) => (
                      <label key={method} className="transactions-page__filter-option">
                        <input
                          type="radio"
                          name="paymentMethodFilter"
                          checked={paymentMethodFilter === method}
                          onChange={() => setPaymentMethodFilter(method)}
                        />
                        {method === "all" ? "Tất cả" : formatPaymentMethod(method)}
                      </label>
                    ))}
                  </div>
                  <button className="transactions-page__filter-apply" onClick={() => setShowFilterMenu(false)}>
                    Áp dụng
                  </button>
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="transactions-page__table-sort-wrapper">
              <button
                className="transactions-page__table-tool-btn"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <HiChevronUpDown /> Sắp xếp
              </button>
              {showSortMenu && (
                <div className="transactions-page__sort-dropdown">
                  {[
                    { key: "created_at", label: "Ngày tạo" },
                    { key: "total_amount", label: "Số tiền" },
                    { key: "order_number", label: "Mã đơn hàng" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className="transactions-page__sort-option"
                      onClick={() => {
                        if (sortBy === opt.key) {
                          setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                        } else {
                          setSortBy(opt.key);
                          setSortOrder("DESC");
                        }
                        setShowSortMenu(false);
                      }}
                    >
                      {opt.label}
                      {sortBy === opt.key && <span>{sortOrder === "ASC" ? "↑" : "↓"}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <button className="transactions-page__table-tool-btn" onClick={handleResetFilters}>
              <HiArrowPath /> Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="transactions-page__table-scroll">
          <table className="transactions-page__table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Khóa học</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>Đang tải...</td></tr>
              ) : error ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>Lỗi khi tải dữ liệu</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>Không có giao dịch nào</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="transactions-page__order-number">{order.order_number}</td>
                    <td>
                      <div className="transactions-page__user-cell">
                        <div className="transactions-page__user-avatar">
                          {order.user?.avatar_url ? (
                            <img src={order.user.avatar_url} alt="" />
                          ) : (
                            <span>{(order.user?.username || order.user?.full_name || "U")[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div className="transactions-page__user-info">
                          <div className="transactions-page__user-name">{order.user?.full_name || order.user?.username}</div>
                          <div className="transactions-page__user-email">{order.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="transactions-page__courses">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="transactions-page__course-tag">
                            {item.course?.title || item.course_title}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="transactions-page__course-more">+{order.items.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="transactions-page__amount">{formatCurrency(order.total_amount)}</td>
                    <td>
                      <span className="transactions-page__method-badge">
                        {formatPaymentMethod(order.payment_method)}
                      </span>
                    </td>
                    <td>
                      <span className={`transactions-page__status-badge transactions-page__status-badge--${order.payment_status}`}>
                        {formatPaymentStatus(order.payment_status)}
                      </span>
                    </td>
                    <td className="transactions-page__date">{formatDate(order.created_at)}</td>
                    <td>
                      <div className="transactions-page__action-menu-wrapper">
                        <button
                          className="transactions-page__action-menu-btn"
                          onClick={() => setShowActionMenu(showActionMenu === order.order_id ? null : order.order_id)}
                        >
                          <HiEllipsisVertical />
                        </button>
                        {showActionMenu === order.order_id && (
                          <div className="transactions-page__action-menu-dropdown">
                            <button
                              className="transactions-page__action-menu-item"
                              onClick={() => { setDetailOrderId(order.order_id); setShowActionMenu(null); }}
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="transactions-page__table-pagination">
          <button className="transactions-page__pagination-btn" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Trước</button>
          <div className="transactions-page__pagination-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`transactions-page__pagination-number ${currentPage === pageNum ? "transactions-page__pagination-number--active" : ""}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button className="transactions-page__pagination-btn" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Sau</button>
        </div>
      </div>

      {/* Modal chi tiết */}
      {detailOrderId && (
        <TransactionDetailModal
          orderId={detailOrderId}
          onClose={() => setDetailOrderId(null)}
        />
      )}
    </div>
  );
}

