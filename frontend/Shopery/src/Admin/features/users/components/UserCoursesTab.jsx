import React from "react";
import { HiCheckCircle, HiClock } from "react-icons/hi2";
import { useUserEnrollments } from "../hooks/useUsersAdminQueries";
import "./UserCoursesTab.scss";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UserCoursesTab({ userId }) {
  const { data, isLoading, error } = useUserEnrollments(userId, {
    page: 1,
    limit: 50,
  });

  // Helper function để convert sang number an toàn
  const toNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    const num = typeof value === "string" ? parseFloat(value) : Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Format số với 1 chữ số thập phân
  const formatPercent = (value) => {
    const num = toNumber(value, 0);
    return num.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="user-courses-tab__loading">
        Đang tải danh sách khóa học...
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-courses-tab__error">
        <p>Lỗi khi tải danh sách khóa học: {error.message}</p>
      </div>
    );
  }

  // Lấy dữ liệu từ admin API - có thể là array hoặc object với enrollments
  const responseData = data?.DT || {};
  let enrollments = [];
  
  if (Array.isArray(responseData)) {
    enrollments = responseData;
  } else if (Array.isArray(responseData.enrollments)) {
    enrollments = responseData.enrollments;
  } else if (Array.isArray(responseData.data)) {
    enrollments = responseData.data;
  }

  // Map dữ liệu từ course_enrollment format
  const mappedEnrollments = enrollments.map((enrollment) => {
    // Nếu có Course object (từ join)
    const course = enrollment.Course || enrollment.course || {};
    
    return {
      enrollment_id: enrollment.enrollment_id || enrollment.id,
      course_id: enrollment.course_id || course.course_id || course.id,
      course_name: course.title || course.course_name || enrollment.course_name || "Unknown Course",
      course_image: course.image || course.course_image || enrollment.course_image,
      status: enrollment.status || "active",
      progress_percent: enrollment.progress_percent || 0,
      enrolled_at: enrollment.enrolled_at || enrollment.created_at,
      // Thông tin từ course
      total_lessons: course.total_lessons || enrollment.total_lessons || 0,
      completed_lessons: enrollment.completed_lessons || 0,
      lesson_progress: enrollment.lesson_progress || [],
    };
  });

  return (
    <div className="user-courses-tab">
      {/* Danh sách khóa học - Card style */}
      <div className="user-courses-tab__section">
        <h3 className="user-courses-tab__section-title">
          Danh sách khóa học đã đăng ký
        </h3>
        {mappedEnrollments.length === 0 ? (
          <div className="user-courses-tab__empty">
            Người dùng chưa đăng ký khóa học nào
          </div>
        ) : (
          <div className="user-courses-tab__list">
            {mappedEnrollments.map((enrollment) => (
              <div
                key={enrollment.enrollment_id}
                className="user-courses-tab__card"
              >
                {enrollment.course_image && (
                  <img
                    src={enrollment.course_image}
                    alt={enrollment.course_name}
                    className="user-courses-tab__thumb"
                  />
                )}
                <div className="user-courses-tab__info">
                  <h4 className="user-courses-tab__course-title">
                    {enrollment.course_name}
                  </h4>
                  <div className="user-courses-tab__meta">
                    <span className="user-courses-tab__lessons">
                      {enrollment.completed_lessons} / {enrollment.total_lessons}{" "}
                      bài học
                    </span>
                    <span
                      className={`user-courses-tab__badge user-courses-tab__badge--${enrollment.status}`}
                    >
                      {enrollment.status === "completed" ? (
                        <>
                          <HiCheckCircle /> Hoàn thành
                        </>
                      ) : (
                        <>
                          <HiClock /> Đang học
                        </>
                      )}
                    </span>
                  </div>
                  <div className="user-courses-tab__progress">
                    <div className="user-courses-tab__progress-bar-wrapper">
                      <div
                        className="user-courses-tab__progress-bar"
                        style={{
                          width: `${toNumber(enrollment.progress_percent, 0)}%`,
                        }}
                      />
                    </div>
                    <span className="user-courses-tab__progress-text">
                      {formatPercent(enrollment.progress_percent)}%
                    </span>
                  </div>
                  {enrollment.lesson_progress &&
                    enrollment.lesson_progress.length > 0 && (
                      <details className="user-courses-tab__lesson-details">
                        <summary>
                          Chi tiết bài học ({enrollment.lesson_progress.length})
                        </summary>
                        <div className="user-courses-tab__lessons-list">
                          {enrollment.lesson_progress.map((lesson) => (
                            <div
                              key={lesson.lesson_id}
                              className="user-courses-tab__lesson-item"
                            >
                              <span>{lesson.lesson_name}</span>
                              <span
                                className={`user-courses-tab__badge user-courses-tab__badge--${lesson.status}`}
                              >
                                {lesson.status === "completed" ? (
                                  <>
                                    <HiCheckCircle /> Hoàn thành
                                  </>
                                ) : (
                                  <>
                                    <HiClock />{" "}
                                    {formatPercent(lesson.completion_percent)}%
                                  </>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
