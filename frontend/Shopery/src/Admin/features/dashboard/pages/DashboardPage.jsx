import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import "./Dashboard.scss";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const stats = [
  {
    title: "Total Courses",
    value: "12",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#00AFC8" />
        <rect
          x="2"
          y="8"
          width="20"
          height="7"
          fill="#fff"
          fillOpacity="0.25"
        />
      </svg>
    ),
  },
  {
    title: "Total Students",
    value: "1,240",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" fill="#1D9BF0" />
        <rect
          x="4"
          y="16"
          width="16"
          height="6"
          rx="3"
          fill="#1D9BF0"
          fillOpacity="0.3"
        />
      </svg>
    ),
  },
  {
    title: "Avg. Course Rating",
    value: "4.7/5",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <polygon
          points="12,2 15,9 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,9"
          fill="#FBBF24"
        />
      </svg>
    ),
  },
  {
    title: "Total Earnings",
    value: "$14,500.00",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#0EA5E9" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="#fff"
          fontSize="14"
          fontFamily="Inter"
        >
          $
        </text>
      </svg>
    ),
  },
];

const chartLabels = [
  "React for Begin...",
  "Mastering UI/U...",
  "Python Bootca...",
  "Fullstack Web...",
  "Figma Pro Tips",
];
const chartData = {
  labels: chartLabels,
  datasets: [
    {
      label: "This period",
      data: [320, 270, 240, 200, 165],
      backgroundColor: "#9AB8FF",
      borderRadius: 8,
      barThickness: 36,
      categoryPercentage: 0.7,
    },
    {
      label: "Last period",
      data: [230, 215, 200, 190, 150],
      backgroundColor: "#FDE68A",
      borderRadius: 8,
      barThickness: 36,
      categoryPercentage: 0.7,
    },
  ],
};
const avg = 220;

const chartOptions = {
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        font: { size: 12, family: "Inter" },
        color: "#6B7280",
        boxWidth: 16,
        usePointStyle: true,
      },
    },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12, family: "Inter" }, color: "#6B7280" },
    },
    y: {
      grid: { color: "#E5E7EB", borderWidth: 1 },
      ticks: {
        color: "#9CA3AF",
        font: { size: 11, family: "Inter" },
        stepSize: 50,
      },
      beginAtZero: true,
      min: 0,
      max: 400,
    },
  },
  animation: false,
  maintainAspectRatio: false,
  responsive: true,
  indexAxis: "x",
  pluginsLineAtIndex: {
    value: avg,
    color: "#D1D5DB",
  },
};
function renderAvgLine(chart) {
  if (!chart) return;
  const chartArea = chart.chartArea;
  if (!chartArea) return;
  const y = chart.scales.y.getPixelForValue(avg);
  const ctx = chart.ctx;
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([6, 6]);
  ctx.moveTo(chartArea.left, y);
  ctx.lineTo(chartArea.right, y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#D1D5DB";
  ctx.stroke();
  ctx.font = "12px Inter";
  ctx.fillStyle = "#6B7280";
  ctx.fillText("Avg", chartArea.left - 28, y + 4);
  ctx.restore();
}

const calendarEvents = [
  {
    color: "#2563EB",
    type: "Live Session",
    title: "Live Q&A Session – UI/UX Design (Zoom link)",
    date: "May 18, 2025",
  },
  {
    color: "#EF4444",
    type: "Deadline",
    title: "Upload Final Lesson – React",
    date: "May 20, 2025",
  },
  {
    color: "#FACC15",
    type: "Meeting",
    title: "1-on-1 Mentoring Call with John Doe (Student)",
    date: "May 21, 2025",
  },
  {
    color: "#2563EB",
    type: "Deadline",
    title: "Quiz Submission – UI/UX Module 3",
    date: "May 22, 2025",
  },
  {
    color: "#2563EB",
    type: "Live Session",
    title: "Feedback Session – Python Bootcamp (Live)",
    date: "May 23, 2025",
  },
];

const activity = [
  {
    time: "10.40 AM",
    type: "New Enrollment",
    msg: 'Emma Watson enrolled in "UI/UX Design"',
    primary: true,
  },
  {
    time: "10.40 AM",
    type: "Message Received",
    msg: "New message from Sarah (Course: Web Dev Basics)",
    primary: false,
  },
  {
    time: "10.40 AM",
    type: "Lesson Completion",
    msg: "Lesson 5 completed by 20 students today",
    primary: false,
  },
];

export default function DashboardPage() {
  // custom plugin for Chart.js to render the avg line
  const chartRef = React.useRef(null);
  React.useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.options.plugins.pluginsLineAtIndex = {
        value: avg,
        color: "#D1D5DB",
      };
      chart.render();
    }
  }, []);

  return (
    <div className="dashboard-page-root">
      <div className="dashboard-center">
        {/* Breadcrumb */}
        <div className="breadcrumb-row">
          <span className="breadcrumb">
            Home / <b>Dashboard</b>
          </span>
        </div>

        {/* Title */}
        <div className="dashboard-title">Dashboard</div>

        {/* Stat Cards */}
        <div className="dashboard-stats-row">
          {stats.map((st, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-card-icon">{st.icon}</div>
              <div className="stat-card-data">
                <div className="stat-card-value">{st.value}</div>
                <div className="stat-card-title">{st.title}</div>
                <div className="stat-card-link">
                  View details{" "}
                  <span className="stat-card-link-icon">{">"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="dashboard-chart-card">
          <div className="chart-title">Top 5 Courses by Student Enrollment</div>
          <div className="chart-wrapper">
            <Bar
              data={chartData}
              options={chartOptions}
              height={300}
              ref={chartRef}
              plugins={[
                {
                  id: "lineAtAverage",
                  afterDraw: (chart) => renderAvgLine(chart),
                },
              ]}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-activity-card">
          <div className="activity-header">
            <div className="activity-title">Recent Activity</div>
            <a className="activity-seeall" href="#">
              See All
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th className="time">Time</th>
                <th className="type">Activity Type</th>
                <th className="msg">Message</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((act, idx) => (
                <tr key={idx}>
                  <td className="time">{act.time}</td>
                  <td className={`type${act.primary ? " primary" : ""}`}>
                    {act.type}
                  </td>
                  <td className="msg">{act.msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Right Sidebar */}
      <div className="dashboard-right">
        <div className="calendar-card">
          <div className="calendar-header">
            <div className="calendar-title">Deadline &amp; Calendar</div>
            <a className="calendar-seeall" href="#">
              See All
            </a>
          </div>
          {/* Lịch */}
          <div className="calendar-days-row">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, idx) => (
                <div
                  className={`calendar-day${day === "Thu" ? " active" : ""}`}
                  key={idx}
                >
                  <span className="day-label">{day}</span>
                  <span className="day-num">{15 + idx}</span>
                </div>
              )
            )}
          </div>
          {/* Sự kiện */}
          <div className="calendar-events-list">
            {calendarEvents.map((event, idx) => (
              <div className="event-item" key={idx}>
                <span
                  className="event-dot"
                  style={{ background: event.color }}
                ></span>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-type-date">
                    <span className="event-type" style={{ color: event.color }}>
                      {event.type}
                    </span>
                    <span className="event-date"> • {event.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
