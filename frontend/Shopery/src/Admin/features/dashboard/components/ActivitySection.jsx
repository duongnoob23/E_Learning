import React from "react";
import "../Dashboard.scss";
const ActivitySection = () => {
  const activities = [
    {
      time: "10.40 AM",
      type: "New Enrollment",
      message: "Emma Watson enrolled in 'UI/UX Design'",
    },
    {
      time: "10.40 AM",
      type: "Message Received",
      message: "New message from Sarah (Web Dev Basics)",
    },
    {
      time: "10.40 AM",
      type: "Lesson Completion",
      message: "Lesson 5 completed by 20 students today",
    },
  ];

  return (
    <div className="activity card">
      <div className="activity__header">
        <h3>Recent Activity</h3>
        <button className="btn btn--link">See All</button>
      </div>
      <table className="activity__table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Activity Type</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a, i) => (
            <tr key={i}>
              <td>{a.time}</td>
              <td>{a.type}</td>
              <td>{a.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivitySection;
