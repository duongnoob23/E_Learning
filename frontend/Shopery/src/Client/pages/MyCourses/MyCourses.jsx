import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseApi } from "../../api/Course/courseApi";
import "./MyCourses.css";

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem("user"))?.id || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await courseApi.getUserCourses(userId);
        if (res.EC === "0") setCourses(res.DT);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khóa học:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <div className="loading">Đang tải khóa học...</div>;

  return (
    <div className="mycourses">
      <h2 className="mycourses__title">Khóa học của tôi</h2>

      {courses.length === 0 ? (
        <div className="mycourses__empty">Bạn chưa đăng ký khóa học nào.</div>
      ) : (
        <div className="mycourses__list">
          {courses.map((enroll) => {
            const course = enroll.Course;
            return (
              <div className="mycourses__card" key={course.id}>
                <img
                  src={course.thumb}
                  alt={course.title}
                  className="mycourses__thumb"
                />
                <div className="mycourses__info">
                  <h3>{course.title}</h3>
                  <p>{course.shortDesc}</p>
                  <div className="mycourses__meta">
                    <span>
                      ⭐ {course.rating} ({course.ratingCount})
                    </span>
                    <span>
                      {enroll.payment_status === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </div>

                  <div className="mycourses__actions">
                    {enroll.payment_status === "pending" ? (
                      <button
                        className="btn btn-outline"
                        onClick={() => navigate(`/course/${course.course_id}`)}
                      >
                        Thanh toán ngay
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/lesson/${course.course_id}`)}
                      >
                        Tiếp tục học
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
