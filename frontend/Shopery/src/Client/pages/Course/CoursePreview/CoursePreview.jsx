import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseDetail } from "../../../../Client/services/Course/courseQueries";
import "./CoursePreview.css";
import { courseApi } from "../../../api/Course/courseApi";
import { toast } from "react-toastify";
import PaymentModal from "../../../components/Course/Payment/PaymentModal";
const CoursePreview = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [openModuleIdx, setOpenModuleIdx] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id || 1;
  const { id } = useParams();

  // 🔥 Gọi API thật
  const { data, isLoading, error } = useCourseDetail(id);
  const course = data?.DT?.course;
  const suggestedCourses = data?.DT?.suggestedCourses || [];

  const handleToggleModule = (idx) => {
    setOpenModuleIdx(openModuleIdx === idx ? null : idx);
  };
  const handlePaymentSuccess = (courseId) => {
    toast.success("Thanh toán thành công! ✅");
    setIsPaymentModalOpen(false);
    navigate(`/lesson/${courseId}`);
  };
  const handleEnrollCourse = async () => {
    try {
      const res = await courseApi.enrollCourse(userId, course.course_id);

      if (res.EC === "0") {
        const { is_free, payment_status } = res.DT;

        if (payment_status === "paid" && is_free) {
          toast.success(res.EM);
          navigate(`/lesson/${course.course_id}`);
        } else if (payment_status === "pending" && !is_free) {
          toast.info("💳 " + res.EM);
          // 👉 Ở đây bạn có thể hiển thị modal thanh toán
          setIsPaymentModalOpen(true);
        } else {
          toast.warning("⚠️ Không xác định trạng thái khóa học.");
        }
      } else {
        toast.error(res.EM || "Đăng ký thất bại!");
      }
    } catch (err) {
      console.error("Enroll error:", err);
      toast.error("Có lỗi xảy ra khi đăng ký khóa học!");
    }
  };
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
      }
      if (urlObj.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed${urlObj.pathname}`;
      }
    } catch {
      return null;
    }
    return null;
  };

  if (isLoading) return <div className="loading">Đang tải khóa học...</div>;
  if (error || !course) return <div className="error">Không thể tải chi tiết khóa học.</div>;

  return (
    <div className="course-preview">
      <div className="course-preview__container">
        {/* ===== HEADER ===== */}
        <section className="course-preview__header">
          <div className="course-preview__header-left">
            <span className="course-preview__badge">{course.category}</span>
            <h1 className="course-preview__title">{course.title}</h1>
            <div className="course-preview__desc">{course.shortDesc}</div>
            <div className="course-preview__rating-row">
              <span className="course-preview__rating">
                {course.rating}{" "}
                <i className="fa fa-star" style={{ color: "#ffc107" }}></i>
                <span className="course-preview__rating-count">
                  ({course.ratingCount} đánh giá)
                </span>
              </span>
            </div>
            <div className="course-preview__meta">
              <span>
                <i className="fa fa-list"></i> {course.lessons} bài học
              </span>
              <span>
                <i className="fa fa-clock"></i> {course.duration}
              </span>
            </div>
            <div className="course-preview__instructor">
              <img
                className="course-preview__instructor-avatar"
                src={course.instructor?.avatar}
                alt={course.instructor?.name}
              />
              <span className="course-preview__instructor-name">
                {course.instructor?.name}
              </span>
            </div>
          </div>

          <div className="course-preview__header-right">
            <div className="course-preview__video">
              {course.video?.url?.includes("youtube") ? (
                <iframe
                  width="100%"
                  height="360"
                  src={getYoutubeEmbedUrl(course.video.url)}
                  title="Video Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  className="course-preview__video-player"
                  src={course.video?.url}
                  poster={course.video?.thumb}
                  controls
                />
              )}
            </div>
          </div>
        </section>

        {/* ===== 2-COLUMN LAYOUT ===== */}
        <div className="course-preview__main-row">
          {/* LEFT COLUMN */}
          <div className="course-preview__main-col course-preview__main-col--left">
            {/* ===== TABS ===== */}
            <div className="course-preview__tabs">
              <span
                className={`course-preview__tab ${
                  activeTab === "about" ? "course-preview__tab--active" : ""
                }`}
                onClick={() => setActiveTab("about")}
              >
                Giới thiệu
              </span>
              <span
                className={`course-preview__tab ${
                  activeTab === "curriculum" ? "course-preview__tab--active" : ""
                }`}
                onClick={() => setActiveTab("curriculum")}
              >
                Nội dung khóa học
              </span>
            </div>

            {/* ===== ABOUT TAB ===== */}
            {activeTab === "about" && (
              <section className="course-preview__about">
                <h2>Giới thiệu khóa học</h2>
                {course.about?.length > 0 ? (
                  course.about.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>Chưa có thông tin giới thiệu khóa học.</p>
                )}

                {/* === Skills & Requirements === */}
                {(course.skills?.length || course.requirements?.length) && (
                  <div className="course-preview__skills-req">
                    <div className="course-preview__skills">
                      <h2>Kỹ năng đạt được</h2>
                      <div className="course-preview__skills-list">
                        {course.skills?.map((skill, i) => (
                          <span key={i} className="course-preview__skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="course-preview__requirements">
                      <h2>Yêu cầu</h2>
                      <ul>
                        {course.requirements?.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ===== CURRICULUM TAB ===== */}
            {activeTab === "curriculum" && (
              <section className="course-preview__curriculum">
                <h2>Nội dung khóa học</h2>
                {course.modules && course.modules.length > 0 ? (
                  <div className="curriculum-accordion">
                    {course.modules.map((mod, idx) => (
                      <div
                        key={idx}
                        className={`curriculum-accordion__item${
                          openModuleIdx === idx
                            ? " curriculum-accordion__item--open"
                            : ""
                        }`}
                      >
                        <div
                          className="curriculum-accordion__title"
                          onClick={() => handleToggleModule(idx)}
                        >
                          <span>{mod.title}</span>
                          <span className="curriculum-accordion__meta">
                            {mod.lectures || 0} bài giảng{" "}
                            {mod.time ? `| ${mod.time}` : ""}
                          </span>
                          <span className="curriculum-accordion__arrow">
                            <i
                              className={`fa ${
                                openModuleIdx === idx
                                  ? "fa-chevron-up"
                                  : "fa-chevron-down"
                              }`}
                            ></i>
                          </span>
                        </div>

                        {openModuleIdx === idx && (
                          <div className="curriculum-accordion__content">
                            {mod.lessons && mod.lessons.length > 0 ? (
                              mod.lessons.map((lesson, i) => (
                                <div
                                  key={i}
                                  className="curriculum-accordion__lesson"
                                >
                                  <i className="fa fa-play-circle"></i>
                                  <span>
                                    {lesson.name ||
                                      lesson.title ||
                                      `Bài học ${i + 1}`}
                                  </span>
                                  {lesson.time && (
                                    <span className="curriculum-accordion__lesson-time">
                                      {lesson.time}
                                    </span>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="curriculum-accordion__lesson curriculum-empty">
                                <i className="fa fa-info-circle"></i> Chưa có bài
                                học trong module này
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Chưa có module nào được thêm vào khóa học này.</p>
                )}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <div className="course-preview__main-col course-preview__main-col--right">
          <div className="course-preview__pricing-card">
            {/* ===== Giá khóa học ===== */}
          <div className="course-preview__price-main">
            {course.pricing?.is_free ? (
              <span className="course-preview__price-sale">Miễn phí</span>
            ) : (
              <>
                <span className="course-preview__price-sale">
                  {course.pricing?.price_display}
                </span>

                {course.pricing?.has_discount && (
                  <>
                    <span className="course-preview__price-old">
                      {course.pricing?.old_price_display}
                    </span>
                    <span className="course-preview__price-discount">
                      {course.pricing?.discount_badge}
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          {/* ===== Nút hành động ===== */}
          {course.pricing?.is_free ? (
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

          {/* ===== Thông tin khóa học ===== */}
          <div className="course-preview__info-list">
            <div>
              <i className="fa fa-clock"></i>
              <span>
                <b>Thời lượng:</b> {course.duration || "Không rõ"}
              </span>
            </div>
            <div>
              <i className="fa fa-list"></i>
              <span>
                <b>Bài học:</b> {course.lessons || 0}
              </span>
            </div>
            <div>
              <i className="fa fa-signal"></i>
              <span>
                <b>Trình độ:</b> {course.level || "Tất cả"}
              </span>
            </div>
            <div>
              <i className="fa fa-language"></i>
              <span>
                <b>Ngôn ngữ:</b> {course.language || "Tiếng Anh"}
              </span>
            </div>
          </div>

          {/* ===== Thành tựu đạt được (nếu có) ===== */}
          {course.achieve?.length > 0 && (
            <div className="course-preview__about-achieve">
              <h4>Bạn sẽ đạt được gì?</h4>
              <ul>
                {course.achieve.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
          </div>
        </div>

        {/* ===== SUGGESTED COURSES ===== */}
        <section className="course-preview__suggested">
          <h2>Khóa học gợi ý</h2>
          {suggestedCourses.length > 0 ? (
            <div className="course-preview__suggested-list">
              {suggestedCourses.map((c, i) => (
                <div key={i} className="course-preview__suggested-item">
                  <img
                    src={c.thumb}
                    alt={c.title}
                    className="course-preview__suggested-thumb"
                  />
                  <div className="course-preview__suggested-info">
                    <div className="course-preview__suggested-title-sm">
                      {c.title}
                    </div>
                    <div className="course-preview__suggested-instructor">
                      <i className="fa fa-user"></i> {c.instructor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Hiện chưa có khóa học gợi ý.</p>
          )}
        </section>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={course}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CoursePreview;
