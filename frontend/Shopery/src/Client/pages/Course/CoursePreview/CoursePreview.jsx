import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useCourseDetail } from "../../../../Client/services/Course/courseQueries";
import { courseApi } from "../../../api/Course/courseApi";

import PaymentModal from "../../../components/Course/Payment/PaymentModal";
import "./CoursePreview.css";

const CoursePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user"))?.id || 1;

  const [activeTab, setActiveTab] = useState("about");
  const [openModuleIdx, setOpenModuleIdx] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const { data, isLoading, error } = useCourseDetail(id);
  const course = data?.DT?.course;

  if (isLoading) return <div className="loading">Đang tải khóa học…</div>;
  if (error || !course)
    return <div className="error">Không thể tải dữ liệu khóa học</div>;

  const handleToggleModule = (idx) => {
    setOpenModuleIdx(openModuleIdx === idx ? null : idx);
  };

  const handleEnrollCourse = async () => {
    try {
      // Nếu khóa học miễn phí → đăng ký trực tiếp
      if (course.is_free) {
        const res = await courseApi.enrollCourse(userId, course.course_id);

        if (res.EC === "0") {
          toast.success("Bạn đã đăng ký khóa học miễn phí!");
          // Redirect đến My Course
          navigate("/mycourses");
        } else {
          toast.error(res.EM);
        }
      } else {
        // Khóa học mất phí → hiện modal để nhập thông tin
        setPaymentOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi đăng ký khóa học");
    }
  };

  const handlePaymentSuccess = () => {
    // Không cần xử lý ở đây vì sẽ redirect từ VNPay
    setPaymentOpen(false);
  };
  const convertYoutubeUrlToEmbed = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId = "";
      let listId = urlObj.searchParams.get("list");

      // 1. Dạng chuẩn watch?v=
      if (urlObj.searchParams.get("v")) {
        videoId = urlObj.searchParams.get("v");
      }

      // 2. Dạng youtu.be/VIDEO_ID
      else if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.replace("/", "");
      }

      // 3. Dạng embed/VIDEO_ID
      else if (urlObj.pathname.startsWith("/embed/")) {
        videoId = urlObj.pathname.split("/embed/")[1];
      }

      // 4. Dạng shorts/VIDEO_ID
      else if (urlObj.pathname.startsWith("/shorts/")) {
        videoId = urlObj.pathname.split("/shorts/")[1];
      }

      // 5. Live stream
      else if (urlObj.pathname.startsWith("/live/")) {
        videoId = urlObj.pathname.split("/live/")[1];
      }

      // Nếu không tìm được ID
      if (!videoId) return null;

      // Build embed URL
      let embedUrl = `https://www.youtube.com/embed/${videoId}`;

      if (listId) {
        embedUrl += `?list=${listId}`;
      }

      return embedUrl;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="course-preview">
      {/* ==================== HEADER ==================== */}
      <section className="course-preview__header">
        <div className="course-preview__header-left">
          <span className="course-preview__badge">{course.category?.name}</span>

          <h1 className="course-preview__title">{course.title}</h1>

          <p className="course-preview__desc">{course.short_description}</p>

          <div className="course-preview__rating-row">
            ⭐ {course.rating}
            <span className="course-preview__rating-count">
              ({course.rating_count} đánh giá)
            </span>
          </div>

          <div className="course-preview__meta">
            <span>📚 {course.total_lessons} bài học</span>
            <span>⏱ {course.total_duration}</span>
          </div>

          <div className="course-preview__instructor">
            <img
              src={course.instructor?.avatar}
              alt={course.instructor?.name}
              className="course-preview__instructor-avatar"
            />
            <span className="course-preview__instructor-name">
              {course.instructor?.name}
            </span>
          </div>
        </div>

        <div className="course-preview__header-right">
          <div className="course-preview__video">
            {course.video_preview ? (
              <iframe
                width="100%"
                height="100%"
                src={convertYoutubeUrlToEmbed(course.video_preview)}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Course Preview Video"
              ></iframe>
            ) : (
              <img className="course-preview__video-thumb" src={course.image} />
            )}
            <div className="course-preview__video-duration">
              {course.video_duration}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TABS ==================== */}
      <div className="course-preview__tabs">
        <div
          className={`course-preview__tab ${
            activeTab === "about" ? "course-preview__tab--active" : ""
          }`}
          onClick={() => setActiveTab("about")}
        >
          Giới thiệu
        </div>
        <div
          className={`course-preview__tab ${
            activeTab === "curriculum" ? "course-preview__tab--active" : ""
          }`}
          onClick={() => setActiveTab("curriculum")}
        >
          Nội dung
        </div>
        <div
          className={`course-preview__tab ${
            activeTab === "reviews" ? "course-preview__tab--active" : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Đánh giá
        </div>
      </div>

      <div className="course-preview__main-row">
        {/* ==================== LEFT CONTENT ==================== */}
        <div className="course-preview__main-col course-preview__main-col--left">
          {activeTab === "about" && (
            <>
              <h2 className="course-preview__about-title">
                Giới thiệu khóa học
              </h2>
              <p className="course-preview__about-desc">
                {course.details?.about}
              </p>

              {/* Learning Outcomes */}
              <div className="course-preview__about-learn">
                <h3>Bạn sẽ học được gì</h3>
                <ul>
                  {course.details?.learning_outcomes?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Skills & Requirements */}
              <div className="course-preview__skills-req">
                <div className="course-preview__skills">
                  <h2>Kỹ năng đạt được</h2>
                  <div className="course-preview__skills-list">
                    {course.details?.skills?.map((s, i) => (
                      <span key={i} className="course-preview__skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="course-preview__requirements">
                  <h2>Yêu cầu</h2>
                  <ul>
                    {course.details?.requirements?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* ==================== CURRICULUM ==================== */}
          {activeTab === "curriculum" && (
            <div className="course-preview__curriculum">
              <h2 className="course-preview__curriculum-title">
                Nội dung khóa học
              </h2>

              <div className="curriculum-accordion">
                {course.modules?.map((module, idx) => (
                  <div
                    key={module.module_id}
                    className={`curriculum-accordion__item ${
                      openModuleIdx === idx
                        ? "curriculum-accordion__item--open"
                        : ""
                    }`}
                  >
                    <div
                      className="curriculum-accordion__title"
                      onClick={() => handleToggleModule(idx)}
                    >
                      {module.title}
                      <span className="curriculum-accordion__meta">
                        {module.lectures} bài • {module.total_duration}
                      </span>
                      <span className="curriculum-accordion__arrow">
                        {openModuleIdx === idx ? "▲" : "▼"}
                      </span>
                    </div>

                    {openModuleIdx === idx && (
                      <div className="curriculum-accordion__content">
                        {module.lessons?.map((lesson) => (
                          <div
                            key={lesson.lesson_id}
                            className="curriculum-accordion__lesson"
                          >
                            <i className="fa fa-play-circle"></i>
                            {lesson.title}
                            <span className="curriculum-accordion__lesson-time">
                              {lesson.duration || "..."}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ==================== REVIEWS TAB ==================== */}
          {activeTab === "reviews" && (
            <div className="course-preview__reviews">
              <h2 className="course-preview__reviews-title">
                Đánh giá từ học viên
              </h2>

              {course.reviews && course.reviews.length > 0 ? (
                course.reviews.map((rv) => (
                  <div key={rv.id} className="course-preview__review-item">
                    <img
                      src={rv.avatar}
                      alt={rv.user}
                      className="course-preview__review-avatar"
                    />

                    <div className="course-preview__review-content">
                      <div className="course-preview__review-header">
                        {rv.user}
                      </div>

                      <div className="course-preview__review-date">
                        {new Date(rv.time).toLocaleDateString("vi-VN")}
                      </div>

                      <div className="course-preview__review-rating">
                        {"⭐".repeat(rv.rating)}
                      </div>

                      <p>{rv.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có đánh giá nào.</p>
              )}
            </div>
          )}
        </div>

        {/* ==================== RIGHT SIDEBAR ==================== */}
        <div className="course-preview__main-col course-preview__main-col--right">
          <div className="course-preview__pricing-card">
            <div className="course-preview__price-main">
              {course.is_free ? (
                <span className="course-preview__price-sale">Miễn phí</span>
              ) : (
                <>
                  <span className="course-preview__price-sale">
                    {Number(course.price).toLocaleString()}₫
                  </span>
                  {course.discount_percent && (
                    <>
                      <span className="course-preview__price-old">
                        {Number(course.old_price).toLocaleString()}₫
                      </span>
                      <span className="course-preview__price-discount">
                        -{course.discount_percent}%
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            {course.is_free ? (
              <button
                className="course-preview__btn-add-cart"
                onClick={handleEnrollCourse}
              >
                Học miễn phí
              </button>
            ) : (
              <>
                <button
                  className="course-preview__btn-add-cart"
                  onClick={handleEnrollCourse}
                >
                  Đăng ký khóa học
                </button>
              </>
            )}

            <div className="course-preview__info-list">
              <div>
                <i className="fa fa-check"></i> Truy cập trọn đời
              </div>
              <div>
                <i className="fa fa-check"></i> Chứng chỉ hoàn thành
              </div>
              <div>
                <i className="fa fa-check"></i> Nội dung cập nhật liên tục
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PAYMENT MODAL ==================== */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        course={course}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CoursePreview;
