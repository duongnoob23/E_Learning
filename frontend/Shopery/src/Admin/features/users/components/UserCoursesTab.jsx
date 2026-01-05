import { HiCheckCircle, HiClock } from "react-icons/hi2";
import { useUserCourseProgress } from "../hooks/useUsersAdminQueries";

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
  const { data, isLoading, error } = useUserCourseProgress(userId, { page: 1, limit: 50 });

  // Helper function để convert sang number an toàn
  const toNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Format số với 1 chữ số thập phân
  const formatPercent = (value) => {
    const num = toNumber(value, 0);
    return num.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="user-detail__loading">Loading course progress...</div>
    );
  }

  if (error) {
    return (
      <div className="user-detail__error">
        <p>Error loading course progress: {error.message}</p>
      </div>
    );
  }

  // Lấy dữ liệu từ admin API
  const responseData = data?.DT || {};
  const enrollments = Array.isArray(responseData.enrollments) ? responseData.enrollments : [];
  
  // Debug log để kiểm tra dữ liệu
  if (process.env.NODE_ENV === 'development') {
    console.log("UserCoursesTab - data:", data);
    console.log("UserCoursesTab - responseData:", responseData);
    console.log("UserCoursesTab - enrollments:", enrollments);
  }

  return (
    <div className="user-detail__courses">
      <div className="user-detail__table-wrapper">
        <h3 className="user-detail__section-title">Tiến độ học khóa học</h3>
        {enrollments.length === 0 ? (
          <p className="user-detail__empty">
            Người dùng chưa đăng ký khóa học nào
          </p>
        ) : (
          <>
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.enrollment_id}
                className="user-detail__course-card"
              >
                <div className="user-detail__course-header">
                  {enrollment.course_image && (
                    <img
                      src={enrollment.course_image}
                      alt=""
                      className="user-detail__course-img"
                    />
                  )}
                  <div className="user-detail__course-info">
                    <h4>{enrollment.course_name}</h4>
                    <div className="user-detail__course-meta">
                      <span>
                        {enrollment.completed_lessons} /{" "}
                        {enrollment.total_lessons} bài học
                      </span>
                      <span
                        className={`user-detail__badge user-detail__badge--${enrollment.status}`}
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
                  </div>
                </div>
                <div className="user-detail__progress">
                  <div
                    className="user-detail__progress-bar"
                    style={{ width: `${toNumber(enrollment.progress_percent, 0)}%` }}
                  />
                  <span>{formatPercent(enrollment.progress_percent)}%</span>
                </div>
                {enrollment.lesson_progress &&
                  enrollment.lesson_progress.length > 0 && (
                    <details className="user-detail__lesson-details">
                      <summary>
                        Chi tiết bài học ({enrollment.lesson_progress.length})
                      </summary>
                      <div className="user-detail__lessons-list">
                        {enrollment.lesson_progress.map((lesson) => (
                          <div
                            key={lesson.lesson_id}
                            className="user-detail__lesson-item"
                          >
                            <span>{lesson.lesson_name}</span>
                            <span
                              className={`user-detail__badge user-detail__badge--${lesson.status}`}
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
            ))}

          </>
        )}
      </div>
    </div>
  );
}
