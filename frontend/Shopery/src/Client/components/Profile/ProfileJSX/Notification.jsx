// Client/components/Profile/ProfileJSX/Notification.jsx
import React from "react";
import "../ProfileCSS/Notification.css";

const mockNotifications = [
  {
    id: 1,
    author: "Joseph W. Trent",
    action: "published a new course",
    course: "Ultimate Photoshop Training: From Beginner",
    time: "2 hours ago",
    images: [
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=140&h=90&fit=crop",
    ],
    icon: "🔔",
  },
  {
    id: 2,
    author: "Joseph W. Trent",
    action: "published a new course",
    course: "WordPress Master Class for Beginners",
    time: "3 days ago",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=140&h=90&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=140&h=90&fit=crop",
    ],
    icon: "🔔",
  },
  {
    id: 3,
    author: "System",
    action: "You just added a course to your Wishlist.",
    description: "We'll email you when new start dates become available.",
    time: "3 days ago",
    isSystem: true,
    link: "View Wishlist",
    icon: "❤️",
  },
  {
    id: 4,
    author: "Joseph W. Trent",
    action: "published a new course",
    course: "User Experience Design Essentials",
    time: "29 Dec",
    images: [
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=140&h=90&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=140&h=90&fit=crop",
    ],
    icon: "🔔",
  },
  {
    id: 5,
    author: "System",
    action:
      "Review your Profile to see what you are sharing with other people on CourceWhiz, and to change any privacy settings",
    time: "27 Dec",
    isSystem: true,
    link: "View Profile",
    icon: "👤",
  },
  {
    id: 6,
    author: "Joseph W. Trent",
    action: "published a new course",
    course: "Ultimate Photoshop Training: From Beginner",
    time: "23 Dec",
    images: [
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=140&h=90&fit=crop",
    ],
    icon: "🔔",
  },
  {
    id: 7,
    author: "Joseph W. Trent",
    action: "published a new course",
    course: "WordPress Master Class for Beginners",
    time: "15 Dec",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=140&h=90&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=140&h=90&fit=crop",
    ],
    icon: "🔔",
  },
  {
    id: 8,
    author: "Joseph W. Trent",
    action: "published a new course",
    course: "User Experience Design Essentials",
    time: "05 Nov",
    images: [
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=140&h=90&fit=crop",
    ],
    icon: "🔔",
  },
];

const Notification = () => {
  return (
    <div className="notification">
      <div className="notification__list">
        {mockNotifications.map((item) => (
          <div key={item.id} className="notification__item">
            <div className="notification__icon">{item.icon}</div>
            <div className="notification__content">
              <p className="notification__text">
                {!item.isSystem ? (
                  <>
                    <span className="notification__author">{item.author}</span>{" "}
                    {item.action}:{" "}
                    <span className="notification__course">{item.course}</span>
                  </>
                ) : (
                  <>
                    {item.action}
                    {item.description && (
                      <>
                        {" "}
                        <span className="notification__description">
                          {item.description}
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
              {item.link && (
                <a href="#" className="notification__link">
                  {item.link}
                </a>
              )}
              <p className="notification__time">{item.time}</p>
            </div>
            {item.images && item.images.length > 0 && (
              <div className="notification__images">
                {item.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Course thumbnail"
                    className="notification__image"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
