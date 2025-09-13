import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clientApi } from '../../services/clientApi';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form data
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    avatar_url: '',
    email: '',
    username: ''
  });

  // Stats data
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    wishlistItems: 0,
    totalWords: 0,
    studyStreak: 0
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        avatar_url: user.avatar_url || '',
        email: user.email || '',
        username: user.username || ''
      });
      // Load user stats
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const response = await clientApi.getUserStats();
      if (response.EC === '0') {
        setStats(response.DT);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Fallback to default stats if API fails
      setStats({
        enrolledCourses: 0,
        completedCourses: 0,
        wishlistItems: 0,
        totalWords: 0,
        studyStreak: 0
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await clientApi.updateUserProfile(formData);
      if (response.EC === '0') {
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        setIsEditing(false);
        // Update user in Redux store
        dispatch({ type: 'auth/updateUser', payload: response.DT });
      } else {
        setMessage({ type: 'error', text: response.EM });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật thông tin' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name || '',
      phone_number: user.phone_number || '',
      avatar_url: user.avatar_url || '',
      email: user.email || '',
      username: user.username || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { text: 'Hoạt động', class: 'status-active' },
      'unverified': { text: 'Chưa xác thực', class: 'status-unverified' },
      'suspended': { text: 'Tạm khóa', class: 'status-suspended' }
    };
    const statusInfo = statusMap[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {user?.full_name || user?.username || 'Chưa có tên'}
              </h1>
              <p className="profile-username">@{user?.username}</p>
              {getStatusBadge(user?.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.enrolledCourses}</h3>
                <p>Khóa học đã đăng ký</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.completedCourses}</h3>
                <p>Khóa học hoàn thành</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-info">
                <h3>{stats.wishlistItems}</h3>
                <p>Khóa học yêu thích</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>{stats.totalWords}</h3>
                <p>Từ vựng đã học</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <h3>{stats.studyStreak}</h3>
                <p>Ngày học liên tiếp</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <div className="section-header">
              <h2>Thông tin cá nhân</h2>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="full_name">Họ và tên</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone_number">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_url">URL ảnh đại diện</label>
                  <input
                    type="url"
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    placeholder="Nhập URL ảnh đại diện"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="disabled-input"
                  />
                  <small>Email không thể thay đổi</small>
                </div>

                <div className="form-group">
                  <label>Tên đăng nhập</label>
                  <input
                    type="text"
                    value={formData.username}
                    disabled
                    className="disabled-input"
                  />
                  <small>Tên đăng nhập không thể thay đổi</small>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info-display">
                <div className="info-item">
                  <label>Họ và tên:</label>
                  <span>{user?.full_name || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                  <span className={`verification-badge ${user?.email_verified ? 'verified' : 'unverified'}`}>
                    {user?.email_verified ? '✓ Đã xác thực' : '⚠ Chưa xác thực'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Số điện thoại:</label>
                  <span>{user?.phone_number || 'Chưa cập nhật'}</span>
                  {user?.phone_number && (
                    <span className={`verification-badge ${user?.phone_verified ? 'verified' : 'unverified'}`}>
                      {user?.phone_verified ? '✓ Đã xác thực' : '⚠ Chưa xác thực'}
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <label>Ngày tham gia:</label>
                  <span>{formatDate(user?.created_at)}</span>
                </div>
                <div className="info-item">
                  <label>Lần đăng nhập cuối:</label>
                  <span>{formatDate(user?.last_login)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>Hoạt động gần đây</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">📚</div>
                <div className="activity-content">
                  <p>Đã hoàn thành khóa học "JavaScript Cơ bản"</p>
                  <span className="activity-time">2 ngày trước</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p>Đã học 15 từ vựng mới</p>
                  <span className="activity-time">1 tuần trước</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">❤️</div>
                <div className="activity-content">
                  <p>Đã thêm "React Advanced" vào danh sách yêu thích</p>
                  <span className="activity-time">2 tuần trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
