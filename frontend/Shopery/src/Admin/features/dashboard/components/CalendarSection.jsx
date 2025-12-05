import React from "react";
import "../Dashboard.scss";
const CalendarSection = () => {
  const events = [
    {
      title: "Live Q&A Session – UI/UX Design",
      date: "May 18, 2025",
      type: "Live Session",
    },
    {
      title: "Upload Final Lesson – React",
      date: "May 20, 2025",
      type: "Deadline",
    },
    {
      title: "1-on-1 Mentoring Call with John Doe",
      date: "May 21, 2025",
      type: "Meeting",
    },
    {
      title: "Quiz Submission – UI/UX Module 3",
      date: "May 22, 2025",
      type: "Deadline",
    },
    {
      title: "Feedback Session – Python Bootcamp",
      date: "May 23, 2025",
      type: "Live",
    },
  ];

  return (
    <div className="calendar card">
      <div className="calendar__header">
        <h3>Deadline & Calendar</h3>
        <button className="btn btn--link">See All</button>
      </div>
      <ul className="calendar__list">
        {events.map((e, i) => (
          <li key={i} className="calendar__item">
            <div className="calendar__info">
              <p className="calendar__title">{e.title}</p>
              <p className="calendar__meta">
                <span>{e.type}</span> · <span>{e.date}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarSection;
