import React from "react";
import "../Dashboard.scss";
const ChartSection = () => {
  const courses = ["React", "UI/UX", "Python", "Fullstack", "Figma"];
  const current = [250, 200, 280, 210, 180];
  const last = [180, 150, 230, 160, 140];

  return (
    <div className="chart-section card">
      <div className="chart-section__header">
        <h3>Top 5 Courses by Student Enrollment</h3>
        <div className="chart-section__legend">
          <span className="dot dot--blue"></span> This period
          <span className="dot dot--yellow"></span> Last period
        </div>
      </div>
      <div className="chart-section__body">
        <div className="chart-bars">
          {courses.map((c, i) => (
            <div className="chart-bar" key={i}>
              <div className="chart-bar__bars">
                <div
                  className="chart-bar__current"
                  style={{ height: `${current[i] / 4}px` }}
                ></div>
                <div
                  className="chart-bar__last"
                  style={{ height: `${last[i] / 4}px` }}
                ></div>
              </div>
              <p className="chart-bar__label">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
