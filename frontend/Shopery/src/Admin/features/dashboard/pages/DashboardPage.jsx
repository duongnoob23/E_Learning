import React, { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { statisticsApi } from "../../../api/statisticsApi";
import {
  HiUsers,
  HiBookOpen,
  HiClipboardDocumentList,
  HiCurrencyDollar,
  HiAcademicCap,
  HiDocumentText,
  HiArrowTrendingUp,
  HiArrowTrendingDown,
} from "react-icons/hi2";
import "./Dashboard.scss";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// Format number with commas
const formatNumber = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Color palette
const COLORS = {
  primary: "#6366F1",
  secondary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
  pink: "#EC4899",
  indigo: "#4F46E5",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [examStats, setExamStats] = useState(null);
  const [vocabStats, setVocabStats] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAllStats();
  }, [selectedYear]);

  const fetchAllStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, userRes, courseRes, revenueRes, examRes, vocabRes] =
        await Promise.all([
          statisticsApi.getOverview(),
          statisticsApi.getUserStats("month", selectedYear),
          statisticsApi.getCourseStats(),
          statisticsApi.getRevenueStats(selectedYear),
          statisticsApi.getExamStats(),
          statisticsApi.getVocabularyStats(),
        ]);

      if (overviewRes.EC === "0") setOverview(overviewRes.DT);
      if (userRes.EC === "0") setUserStats(userRes.DT);
      if (courseRes.EC === "0") setCourseStats(courseRes.DT);
      if (revenueRes.EC === "0") setRevenueStats(revenueRes.DT);
      if (examRes.EC === "0") setExamStats(examRes.DT);
      if (vocabRes.EC === "0") setVocabStats(vocabRes.DT);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchAllStats} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="breadcrumb">
            Home / <b>Dashboard</b>
          </div>
          <h1 className="page-title">Dashboard - Thống kê tổng quan</h1>
        </div>
        <div className="header-right">
          <div className="year-selector">
            <label>Năm thống kê:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="overview-cards">
          <StatCard
            title="Tổng người dùng"
            value={formatNumber(overview.users?.total)}
            subValue={`+${overview.users?.newThisMonth || 0} tháng này`}
            icon={<HiUsers />}
            color={COLORS.primary}
            trend={overview.users?.newThisMonth > 0 ? "up" : "neutral"}
          />
          <StatCard
            title="Khóa học"
            value={formatNumber(overview.courses?.total)}
            subValue={`${overview.courses?.published || 0} đã xuất bản`}
            icon={<HiBookOpen />}
            color={COLORS.success}
          />
          <StatCard
            title="Lượt đăng ký"
            value={formatNumber(overview.courses?.totalEnrollments)}
            subValue={`+${overview.courses?.newEnrollmentsThisMonth || 0} tháng này`}
            icon={<HiClipboardDocumentList />}
            color={COLORS.warning}
            trend={overview.courses?.newEnrollmentsThisMonth > 0 ? "up" : "neutral"}
          />
          <StatCard
            title="Doanh thu"
            value={formatCurrency(overview.revenue?.total)}
            subValue={`${overview.revenue?.growth > 0 ? "+" : ""}${overview.revenue?.growth || 0}% so với tháng trước`}
            icon={<HiCurrencyDollar />}
            color={COLORS.secondary}
            trend={overview.revenue?.growth > 0 ? "up" : overview.revenue?.growth < 0 ? "down" : "neutral"}
          />
          <StatCard
            title="Bài thi"
            value={formatNumber(overview.exams?.total)}
            subValue={`${formatNumber(overview.exams?.totalSessions)} lượt làm bài`}
            icon={<HiAcademicCap />}
            color={COLORS.pink}
          />
          <StatCard
            title="Từ vựng"
            value={formatNumber(overview.vocabulary?.totalWords)}
            subValue={`${overview.vocabulary?.totalTopics || 0} chủ đề`}
            icon={<HiDocumentText />}
            color={COLORS.info}
          />
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="charts-grid">
        {/* User Stats Chart - Line */}
        {userStats?.byPeriod && (
          <div className="chart-card wide">
            <div className="chart-header">
              <h3>📈 Người dùng mới theo tháng ({selectedYear})</h3>
            </div>
            <div className="chart-container">
              <Line
                data={{
                  labels: userStats.byPeriod.map((item) => formatMonth(item.period)),
                  datasets: [
                    {
                      label: "Người dùng mới",
                      data: userStats.byPeriod.map((item) => item.count),
                      borderColor: COLORS.primary,
                      backgroundColor: `${COLORS.primary}20`,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={lineChartOptions}
              />
            </div>
          </div>
        )}

        {/* User Status Distribution - Pie */}
        {userStats?.byStatus && (
          <div className="chart-card">
            <div className="chart-header">
              <h3>👥 Trạng thái người dùng</h3>
            </div>
            <div className="chart-container pie">
              <Pie
                data={{
                  labels: userStats.byStatus.map((item) => translateStatus(item.status)),
                  datasets: [
                    {
                      data: userStats.byStatus.map((item) => item.count),
                      backgroundColor: [COLORS.success, COLORS.warning, COLORS.danger, "#9CA3AF"],
                      borderWidth: 2,
                      borderColor: "#fff",
                    },
                  ],
                }}
                options={pieOptions}
              />
            </div>
          </div>
        )}

        {/* Revenue Chart - Bar */}
        {revenueStats?.byMonth && revenueStats.byMonth.length > 0 && (
          <div className="chart-card wide">
            <div className="chart-header">
              <h3>💰 Doanh thu theo tháng ({selectedYear})</h3>
            </div>
            <div className="chart-container">
              <Bar
                data={{
                  labels: revenueStats.byMonth.map((item) => formatMonth(item.month)),
                  datasets: [
                    {
                      label: "Doanh thu (VNĐ)",
                      data: revenueStats.byMonth.map((item) => parseFloat(item.revenue) || 0),
                      backgroundColor: `${COLORS.secondary}CC`,
                      borderRadius: 8,
                      barThickness: 40,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        )}

        {/* Exam Sessions Chart */}
        {examStats?.sessionsByMonth && examStats.sessionsByMonth.length > 0 && (
          <div className="chart-card">
            <div className="chart-header">
              <h3>📝 Lượt làm bài thi theo tháng</h3>
            </div>
            <div className="chart-container">
              <Bar
                data={{
                  labels: examStats.sessionsByMonth.map((item) => formatMonth(item.month)),
                  datasets: [
                    {
                      label: "Lượt làm bài",
                      data: examStats.sessionsByMonth.map((item) => item.count),
                      backgroundColor: `${COLORS.pink}CC`,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  ...barChartOptions,
                  plugins: { ...barChartOptions.plugins },
                }}
              />
            </div>
          </div>
        )}

        {/* Course Enrollment Chart */}
        {courseStats?.enrollmentsByMonth && courseStats.enrollmentsByMonth.length > 0 && (
          <div className="chart-card">
            <div className="chart-header">
              <h3>Đăng ký khóa học theo tháng</h3>
            </div>
            <div className="chart-container">
              <Line
                data={{
                  labels: courseStats.enrollmentsByMonth.map((item) => formatMonth(item.month)),
                  datasets: [
                    {
                      label: "Lượt đăng ký",
                      data: courseStats.enrollmentsByMonth.map((item) => item.count),
                      borderColor: COLORS.success,
                      backgroundColor: `${COLORS.success}20`,
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={lineChartOptions}
              />
            </div>
          </div>
        )}

        {/* Exam Stats Summary */}
        {examStats && (
          <div className="chart-card stats-summary-card">
            <div className="chart-header">
              <h3>📊 Tổng quan bài thi</h3>
            </div>
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-icon" style={{ backgroundColor: `${COLORS.primary}20` }}>
                  <HiAcademicCap style={{ color: COLORS.primary }} />
                </div>
                <div className="summary-info">
                  <span className="summary-value">{examStats.avgScore || 0}</span>
                  <span className="summary-label">Điểm trung bình</span>
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-icon" style={{ backgroundColor: `${COLORS.success}20` }}>
                  <HiClipboardDocumentList style={{ color: COLORS.success }} />
                </div>
                <div className="summary-info">
                  <span className="summary-value">{examStats.completionRate || 0}%</span>
                  <span className="summary-label">Tỷ lệ hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tables Section */}
      <div className="tables-section">
        {/* Top Exams by Attempts */}
        {examStats?.topExams && examStats.topExams.length > 0 && (
          <div className="table-card">
            <div className="table-header">
              <h3>🏆 Top 10 bài thi được làm nhiều nhất</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên bài thi</th>
                    <th>Loại</th>
                    <th>Lượt làm</th>
                    <th>Điểm TB</th>
                  </tr>
                </thead>
                <tbody>
                  {examStats.topExams.map((exam, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className={`rank rank-${idx + 1}`}>{idx + 1}</span>
                      </td>
                      <td className="exam-title">{exam.test?.title || "N/A"}</td>
                      <td>
                        <span className="exam-type">{exam.test?.exam_type || "N/A"}</span>
                      </td>
                      <td className="attempts">{formatNumber(exam.attempts)}</td>
                      <td className="avg-score">{parseFloat(exam.avgScore || 0).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Courses by Enrollment */}
        {courseStats?.topByEnrollment && courseStats.topByEnrollment.length > 0 && (
          <div className="table-card">
            <div className="table-header">
              <h3>Top 10 khóa học được đăng ký nhiều nhất</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên khóa học</th>
                    <th>Số lượt đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {courseStats.topByEnrollment.map((course, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className={`rank rank-${idx + 1}`}>{idx + 1}</span>
                      </td>
                      <td className="course-title">{course.Course?.title || "N/A"}</td>
                      <td className="enrollment-count">{formatNumber(course.enrollmentCount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {revenueStats?.recentTransactions && revenueStats.recentTransactions.length > 0 && (
          <div className="table-card full-width">
            <div className="table-header">
              <h3>💳 Giao dịch gần đây</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>Số tiền</th>
                    <th>Phương thức</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueStats.recentTransactions.map((trans, idx) => (
                    <tr key={idx}>
                      <td className="user-name">
                        {trans.user?.full_name || trans.user?.username || "N/A"}
                      </td>
                      <td className="user-email">{trans.user?.email || "N/A"}</td>
                      <td className="amount">{formatCurrency(trans.amount)}</td>
                      <td>
                        <span className="payment-method">{trans.payment_method || "N/A"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format month
function formatMonth(monthStr) {
  if (!monthStr) return "";
  const parts = monthStr.split("-");
  if (parts.length === 2) {
    return `T${parseInt(parts[1])}`;
  }
  return monthStr;
}

// Helper function to translate status
function translateStatus(status) {
  const statusMap = {
    active: "Hoạt động",
    inactive: "Không hoạt động",
    banned: "Đã khóa",
    pending: "Chờ xác nhận",
  };
  return statusMap[status] || status;
}

// Chart Options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1F2937",
      titleColor: "#F9FAFB",
      bodyColor: "#F9FAFB",
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6B7280", font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#E5E7EB" },
      ticks: { color: "#6B7280", font: { size: 11 } },
    },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1F2937",
      titleColor: "#F9FAFB",
      bodyColor: "#F9FAFB",
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6B7280", font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#E5E7EB" },
      ticks: { color: "#6B7280", font: { size: 11 } },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: "#1F2937",
      titleColor: "#F9FAFB",
      bodyColor: "#F9FAFB",
      padding: 12,
      cornerRadius: 8,
    },
  },
};

// Stat Card Component
function StatCard({ title, value, subValue, icon, color, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ backgroundColor: `${color}15` }}>
        <span style={{ color: color }}>{icon}</span>
      </div>
      <div className="stat-card-info">
        <h3 className="stat-card-value">{value}</h3>
        <p className="stat-card-title">{title}</p>
        <div className="stat-card-sub">
          {trend === "up" && <HiArrowTrendingUp className="trend-up" />}
          {trend === "down" && <HiArrowTrendingDown className="trend-down" />}
          <span>{subValue}</span>
        </div>
      </div>
    </div>
  );
}
