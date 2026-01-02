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
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { statisticsApi } from "../../../api/statisticsApi";
import "./StatisticsPage.scss";

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

export default function StatisticsPage() {
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
      <div className="statistics-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchAllStats}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      {/* Header */}
      <div className="stats-header">
        <div className="breadcrumb">
          Home / <b>Thống kê</b>
        </div>
        <h1 className="page-title">Thống kê tổng quan</h1>
        <div className="year-selector">
          <label>Năm:</label>
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

      {/* Overview Cards */}
      {overview && (
        <div className="overview-cards">
          <OverviewCard
            title="Tổng người dùng"
            value={formatNumber(overview.users?.total)}
            subValue={`+${overview.users?.newThisMonth || 0} tháng này`}
            icon="👥"
            color="#3B82F6"
          />
          <OverviewCard
            title="Khóa học"
            value={formatNumber(overview.courses?.total)}
            subValue={`${overview.courses?.published || 0} đã xuất bản`}
            icon="📚"
            color="#10B981"
          />
          <OverviewCard
            title="Lượt đăng ký"
            value={formatNumber(overview.courses?.totalEnrollments)}
            subValue={`+${overview.courses?.newEnrollmentsThisMonth || 0} tháng này`}
            icon="📝"
            color="#F59E0B"
          />
          <OverviewCard
            title="Doanh thu"
            value={formatCurrency(overview.revenue?.total)}
            subValue={`${overview.revenue?.growth > 0 ? "+" : ""}${overview.revenue?.growth}% so với tháng trước`}
            icon="💰"
            color="#8B5CF6"
          />
          <OverviewCard
            title="Bài thi"
            value={formatNumber(overview.exams?.total)}
            subValue={`${formatNumber(overview.exams?.totalSessions)} lượt làm bài`}
            icon="📋"
            color="#EC4899"
          />
          <OverviewCard
            title="Từ vựng"
            value={formatNumber(overview.vocabulary?.totalWords)}
            subValue={`${overview.vocabulary?.totalTopics || 0} chủ đề`}
            icon="📖"
            color="#06B6D4"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-section">
        {/* User Stats Chart */}
        {userStats?.byPeriod && (
          <div className="chart-card">
            <h3>Người dùng mới theo tháng</h3>
            <div className="chart-container">
              <Line
                data={{
                  labels: userStats.byPeriod.map((item) => item.period),
                  datasets: [
                    {
                      label: "Người dùng mới",
                      data: userStats.byPeriod.map((item) => item.count),
                      borderColor: "#3B82F6",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
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

        {/* User Status Distribution */}
        {userStats?.byStatus && (
          <div className="chart-card small">
            <h3>Phân bố trạng thái người dùng</h3>
            <div className="chart-container">
              <Doughnut
                data={{
                  labels: userStats.byStatus.map((item) => item.status),
                  datasets: [
                    {
                      data: userStats.byStatus.map((item) => item.count),
                      backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#6B7280"],
                    },
                  ],
                }}
                options={doughnutOptions}
              />
            </div>
          </div>
        )}

        {/* Revenue Chart */}
        {revenueStats?.byMonth && (
          <div className="chart-card">
            <h3>Doanh thu theo tháng ({selectedYear})</h3>
            <div className="chart-container">
              <Bar
                data={{
                  labels: revenueStats.byMonth.map((item) => item.month),
                  datasets: [
                    {
                      label: "Doanh thu",
                      data: revenueStats.byMonth.map((item) => parseFloat(item.revenue) || 0),
                      backgroundColor: "#8B5CF6",
                      borderRadius: 6,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        )}

        {/* Course Enrollment Chart */}
        {courseStats?.enrollmentsByMonth && (
          <div className="chart-card">
            <h3>Lượt đăng ký khóa học theo tháng</h3>
            <div className="chart-container">
              <Line
                data={{
                  labels: courseStats.enrollmentsByMonth.map((item) => item.month),
                  datasets: [
                    {
                      label: "Lượt đăng ký",
                      data: courseStats.enrollmentsByMonth.map((item) => item.count),
                      borderColor: "#10B981",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
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

        {/* Exam Sessions Chart */}
        {examStats?.sessionsByMonth && (
          <div className="chart-card">
            <h3>Lượt làm bài thi theo tháng</h3>
            <div className="chart-container">
              <Bar
                data={{
                  labels: examStats.sessionsByMonth.map((item) => item.month),
                  datasets: [
                    {
                      label: "Lượt làm bài",
                      data: examStats.sessionsByMonth.map((item) => item.count),
                      backgroundColor: "#EC4899",
                      borderRadius: 6,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        )}

        {/* Exam Stats Summary */}
        {examStats && (
          <div className="chart-card small">
            <h3>Thống kê bài thi</h3>
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-label">Điểm trung bình</span>
                <span className="stat-value">{examStats.avgScore || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tỷ lệ hoàn thành</span>
                <span className="stat-value">{examStats.completionRate || 0}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tables Section */}
      <div className="tables-section">
        {/* Top Courses */}
        {courseStats?.topByEnrollment && courseStats.topByEnrollment.length > 0 && (
          <div className="table-card">
            <h3>Top khóa học được đăng ký nhiều nhất</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên khóa học</th>
                  <th>Số lượt đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.topByEnrollment.slice(0, 5).map((course, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{course.Course?.title || "N/A"}</td>
                    <td>{course.enrollmentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Exams */}
        {examStats?.topExams && examStats.topExams.length > 0 && (
          <div className="table-card">
            <h3>Top bài thi được làm nhiều nhất</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên bài thi</th>
                  <th>Lượt làm</th>
                  <th>Điểm TB</th>
                </tr>
              </thead>
              <tbody>
                {examStats.topExams.slice(0, 5).map((exam, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{exam.test?.title || "N/A"}</td>
                    <td>{exam.attempts}</td>
                    <td>{parseFloat(exam.avgScore || 0).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent Transactions */}
        {revenueStats?.recentTransactions && revenueStats.recentTransactions.length > 0 && (
          <div className="table-card full-width">
            <h3>Giao dịch gần đây</h3>
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
                {revenueStats.recentTransactions.slice(0, 5).map((trans, idx) => (
                  <tr key={idx}>
                    <td>{trans.user?.full_name || trans.user?.username || "N/A"}</td>
                    <td>{trans.user?.email || "N/A"}</td>
                    <td>{formatCurrency(trans.amount)}</td>
                    <td>{trans.payment_method || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Chart Options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: "#E5E7EB" } },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: "#E5E7EB" } },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
  },
};

// Overview Card Component
function OverviewCard({ title, value, subValue, icon, color }) {
  return (
    <div className="overview-card" style={{ borderTopColor: color }}>
      <div className="card-icon" style={{ backgroundColor: `${color}20` }}>
        <span>{icon}</span>
      </div>
      <div className="card-content">
        <h3 className="card-value">{value}</h3>
        <p className="card-title">{title}</p>
        <span className="card-sub">{subValue}</span>
      </div>
    </div>
  );
}

