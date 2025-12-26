import React, { useMemo, useState } from "react";
import {
  HiUsers,
  HiUserPlus,
  HiMagnifyingGlass,
  HiFunnel,
  HiChevronUpDown,
  HiEllipsisVertical,
  HiCheckCircle,
  HiXCircle,
  HiNoSymbol,
  HiShieldCheck,
} from "react-icons/hi2";
import { useAdminUsers, useAdminUsersStats } from "../hooks/useUsersAdminQueries";
import {
  useDeleteUser,
  useBanUser,
  useUnbanUser,
  useVerifyEmail,
} from "../hooks/useUsersAdminMutations";
import CreateUserModal from "../components/CreateUserModal";
import EditUserModal from "../components/EditUserModal";
import UserDetailModal from "../components/UserDetailModal";
import "./UsersPage.scss";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatStatus(status) {
  const statusMap = {
    active: "Active",
    banned: "Banned",
    inactive: "Inactive",
    pending_verification: "Pending",
  };
  return statusMap[status] || status;
}

export default function UsersPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [detailUserId, setDetailUserId] = useState(null);

  const rowsPerPage = 10;
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useAdminUsers({
    page: currentPage,
    limit: rowsPerPage,
    sort: sortOrder,
    order: sortBy,
  });

  const { data: statsData } = useAdminUsersStats();

  const deleteUserMutation = useDeleteUser();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const verifyEmailMutation = useVerifyEmail();

  // Xử lý dữ liệu từ API
  const users = useMemo(() => {
    return usersData?.DT?.users || usersData?.DT || [];
  }, [usersData]);

  const pagination = useMemo(() => {
    return usersData?.DT?.pagination || {
      current_page: currentPage,
      total_pages: 1,
      total_items: users.length,
      items_per_page: rowsPerPage,
    };
  }, [usersData, currentPage, users.length, rowsPerPage]);

  // Stats
  const stats = statsData?.DT || {
    total_users: 0,
    active: 0,
    banned: 0,
    inactive: 0,
    pending_verification: 0,
    today_new_users: 0,
  };

  // Filter và sort users (client-side)
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.full_name?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered;
  }, [users, search, statusFilter]);

  const totalPages = pagination.total_pages || 1;
  const paginatedUsers = filteredAndSortedUsers;

  // Select handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedUsers.map((u) => u.user_id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (userId) => {
    setSelectedRows((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Action handlers
  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUserMutation.mutate(userId);
    }
    setShowActionMenu(null);
  };

  const handleBan = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn chặn người dùng này?")) {
      banUserMutation.mutate(userId);
    }
    setShowActionMenu(null);
  };

  const handleUnban = (userId) => {
    unbanUserMutation.mutate(userId);
    setShowActionMenu(null);
  };

  const handleVerifyEmail = (userId) => {
    verifyEmailMutation.mutate(userId);
    setShowActionMenu(null);
  };

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };

  return (
    <div className="users-page-root">
      {/* Breadcrumb */}
      <div className="users-page__breadcrumb">
        <span>Home / <b>Users</b></span>
      </div>

      {/* Header */}
      <div className="users-page__header-row">
        <h1 className="users-page__title">Users Management</h1>
        <button
          className="users-page__btn users-page__btn--primary"
          onClick={() => setOpenCreateModal(true)}
        >
          <HiUserPlus /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="users-page__stats-row">
        <div className="users-page__stat-card">
          <div className="users-page__stat-icon" style={{ background: "#e0f2fe" }}>
            <HiUsers style={{ color: "#0ea5e9" }} />
          </div>
          <div className="users-page__stat-data">
            <div className="users-page__stat-title">Total Users</div>
            <div className="users-page__stat-value">{stats.total_users}</div>
          </div>
        </div>
        <div className="users-page__stat-card">
          <div className="users-page__stat-icon" style={{ background: "#d1fae5" }}>
            <HiCheckCircle style={{ color: "#10b981" }} />
          </div>
          <div className="users-page__stat-data">
            <div className="users-page__stat-title">Active Users</div>
            <div className="users-page__stat-value">{stats.active}</div>
          </div>
        </div>
        <div className="users-page__stat-card">
          <div className="users-page__stat-icon" style={{ background: "#fee2e2" }}>
            <HiNoSymbol style={{ color: "#ef4444" }} />
          </div>
          <div className="users-page__stat-data">
            <div className="users-page__stat-title">Banned Users</div>
            <div className="users-page__stat-value">{stats.banned}</div>
          </div>
        </div>
        <div className="users-page__stat-card">
          <div className="users-page__stat-icon" style={{ background: "#fef3c7" }}>
            <HiShieldCheck style={{ color: "#f59e0b" }} />
          </div>
          <div className="users-page__stat-data">
            <div className="users-page__stat-title">New Today</div>
            <div className="users-page__stat-value">{stats.today_new_users}</div>
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="users-page__table-wrapper">
        <div className="users-page__table-header-row">
          <h2 className="users-page__table-title">Users List</h2>
          <div className="users-page__table-tools">
            {/* Search */}
            <div className="users-page__table-search">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="users-page__search-icon"><HiMagnifyingGlass /></span>
            </div>

            {/* Filter */}
            <div className="users-page__table-filter-wrapper">
              <button
                className="users-page__table-tool-btn"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <HiFunnel /> Filter
              </button>
              {showFilterMenu && (
                <div className="users-page__filter-dropdown">
                  {["all", "active", "banned", "inactive", "pending_verification"].map((status) => (
                    <label key={status} className="users-page__filter-option">
                      <input
                        type="radio"
                        name="statusFilter"
                        checked={statusFilter === status}
                        onChange={() => { setStatusFilter(status); setShowFilterMenu(false); }}
                      />
                      {status === "all" ? "All Status" : formatStatus(status)}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="users-page__table-sort-wrapper">
              <button
                className="users-page__table-tool-btn"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <HiChevronUpDown /> Sort
              </button>
              {showSortMenu && (
                <div className="users-page__sort-dropdown">
                  {[
                    { key: "created_at", label: "Created Date" },
                    { key: "username", label: "Username" },
                    { key: "email", label: "Email" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className="users-page__sort-option"
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
          </div>
        </div>

        {/* Bulk actions */}
        {selectedRows.length > 0 && (
          <div className="users-page__bulk-actions-bar">
            <span>{selectedRows.length} user(s) selected</span>
            <div>
              <button className="users-page__btn users-page__btn--danger" onClick={() => {
                if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedRows.length} người dùng?`)) {
                  selectedRows.forEach(id => deleteUserMutation.mutate(id));
                  setSelectedRows([]);
                }
              }}>Delete Selected</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="users-page__table-scroll">
          <table className="users-page__table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0} /></th>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                {/* <th>Email Verified</th> */}
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>Error loading users</td></tr>
              ) : paginatedUsers.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>No users found</td></tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td><input type="checkbox" checked={selectedRows.includes(user.user_id)} onChange={() => handleRowSelect(user.user_id)} /></td>
                    <td>
                      <div className="users-page__user-cell">
                        <div className="users-page__user-avatar">
                          {user.avatar_url ? <img src={user.avatar_url} alt="" /> : <span>{(user.username || user.full_name || "U")[0].toUpperCase()}</span>}
                        </div>
                        <div className="users-page__user-info">
                          <div className="users-page__user-name">{user.full_name || user.username}</div>
                          <div className="users-page__user-username">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`users-page__status-badge users-page__status-badge--${user.status}`}>
                        {formatStatus(user.status)}
                      </span>
                    </td>
                    {/* <td>
                      {user.email_verified ? (
                        <HiCheckCircle style={{ color: "#10b981", fontSize: "20px" }} />
                      ) : (
                        <HiXCircle style={{ color: "#9ca3af", fontSize: "20px" }} />
                      )}
                    </td> */}
                    <td className="users-page__created-date">{formatDate(user.created_at)}</td>
                    <td>
                      <div className="users-page__action-menu-wrapper">
                        <button className="users-page__action-menu-btn" onClick={() => setShowActionMenu(showActionMenu === user.user_id ? null : user.user_id)}>
                          <HiEllipsisVertical />
                        </button>
                        {showActionMenu === user.user_id && (
                          <div className="users-page__action-menu-dropdown">
                            <button className="users-page__action-menu-item" onClick={() => { setDetailUserId(user.user_id); setShowActionMenu(null); }}>View Details</button>
                            <button className="users-page__action-menu-item" onClick={() => { setEditUserId(user.user_id); setShowActionMenu(null); }}>Edit</button>
                            {!user.email_verified && (
                              <button className="users-page__action-menu-item" onClick={() => handleVerifyEmail(user.user_id)}>Verify Email</button>
                            )}
                            {user.status === "banned" ? (
                              <button className="users-page__action-menu-item" onClick={() => handleUnban(user.user_id)}>Unban</button>
                            ) : (
                              <button className="users-page__action-menu-item users-page__action-menu-item--warning" onClick={() => handleBan(user.user_id)}>Ban</button>
                            )}
                            <button className="users-page__action-menu-item users-page__action-menu-item--danger" onClick={() => handleDelete(user.user_id)}>Delete</button>
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
        <div className="users-page__table-pagination">
          <button className="users-page__pagination-btn" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Previous</button>
          <div className="users-page__pagination-numbers">
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
                  className={`users-page__pagination-number ${currentPage === pageNum ? "users-page__pagination-number--active" : ""}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button className="users-page__pagination-btn" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
        </div>
      </div>

      {/* Modals */}
      {openCreateModal && (
        <CreateUserModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => { setOpenCreateModal(false); refetch(); }}
        />
      )}
      {editUserId && (
        <EditUserModal
          userId={editUserId}
          onClose={() => setEditUserId(null)}
          onSuccess={() => { setEditUserId(null); refetch(); }}
        />
      )}
      {detailUserId && (
        <UserDetailModal
          userId={detailUserId}
          onClose={() => setDetailUserId(null)}
        />
      )}
    </div>
  );
}

