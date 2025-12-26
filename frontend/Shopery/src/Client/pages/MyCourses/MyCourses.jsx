import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseApi } from "../../api/Course/courseApi";
import "./MyCourses.css";

const MyCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem("user"))?.id || 1;

  useEffect(() => {
    // Kiểm tra nếu có query param payment=success → hiển thị thông báo
    const paymentSuccess = searchParams.get("payment");
    const orderNumber = searchParams.get("orderNumber");

    if (paymentSuccess === "success" && orderNumber) {
      toast.success(`Thanh toán thành công! Đơn hàng: ${orderNumber}`);
      // Xóa query params để không hiển thị lại khi refresh
      navigate("/mycourses", { replace: true });
    }
  }, [searchParams, navigate]);

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
                  src={course.image}
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
