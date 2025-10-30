import React from "react";
import "../Dashboard.scss";
const StatsSection = () => {
  const stats = [
    { title: "Total Courses", value: 12, icon: "📘" },
    { title: "Total Students", value: "1,240", icon: "👩‍🎓" },
    { title: "Avg. Course Rating", value: "4.7/5", icon: "⭐" },
    { title: "Total Earnings", value: "$14,500.00", icon: "💰" },
  ];

  return (
    <div className="dashboard__stats">
      {stats.map((s, i) => (
        <div className="card stat-card" key={i}>
          <div className="stat-card__icon">{s.icon}</div>
          <div>
            <h4 className="stat-card__value">{s.value}</h4>
            <p className="stat-card__title">{s.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
