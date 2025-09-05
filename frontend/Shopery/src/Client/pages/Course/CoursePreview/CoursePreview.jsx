import React, { useState } from "react";
import "./CoursePreview.css";

const fakeCourse = {
  category: "Toeic 4 kĩ năng",
  title: "TOEIC 4 Skills Mastery: Chuẩn bị cho kỳ thi TOEIC",
  shortDesc:
    "Khóa học toàn diện giúp bạn làm chủ 4 kỹ năng TOEIC (Listening, Reading, Speaking, Writing) để đạt điểm cao trong kỳ thi.",
  rating: 4.7,
  ratingCount: 450,
  lessons: 30,
  duration: "15hr 45mins",
  instructor: {
    name: "Nguyễn Văn Hùng",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Avatar giảng viên
  },
  moreInstructors: 1,
  video: {
    thumb:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80", // Ảnh lớp học tiếng Anh
    duration: "9:15",
    progress: 0.1,
    youtube: "https://www.youtube.com/watch?v=2Xc9gXyf2G4", // Link video YouTube
  },
  about: [
    "Khóa học TOEIC 4 Skills Mastery được thiết kế dành riêng cho người Việt, giúp bạn cải thiện kỹ năng nghe, đọc, nói và viết để sẵn sàng cho kỳ thi TOEIC.",
    "Với phương pháp giảng dạy thực tế, bạn sẽ được thực hành qua các bài tập sát đề thi, bài nghe mô phỏng từ người bản xứ và hướng dẫn chi tiết từ giảng viên có kinh nghiệm.",
    "Sau khóa học, bạn sẽ tự tin hơn với khả năng tiếng Anh và đạt mục tiêu điểm số mong muốn (từ 600 đến 900+).",
  ],
  learn: [
    "Làm quen với cấu trúc đề thi TOEIC.",
    "Phát triển kỹ năng Listening và Reading hiệu quả.",
    "Thực hành Speaking và Writing theo format thực tế.",
    "Tăng vốn từ vựng chuyên sâu cho TOEIC.",
    "Xử lý các câu hỏi khó trong kỳ thi.",
  ],
  price: 299000,
  oldPrice: 699000,
  discount: 57,
  info: [
    { icon: "fa-signal", label: "Trình độ", value: "Mọi trình độ" },
    { icon: "fa-clock", label: "Thời lượng", value: "15 giờ 45 phút" },
    { icon: "fa-calendar", label: "Cập nhật", value: "15/08/2025" },
    { icon: "fa-list", label: "Bài học", value: "30 bài học" },
    {
      icon: "fa-certificate",
      label: "Chứng chỉ",
      value: "Chứng chỉ điện tử",
    },
    { icon: "fa-users", label: "Học viên", value: "1850" },
  ],
  achieve: [
    "Đạt điểm TOEIC từ 600 trở lên.",
    "Hiểu và trả lời các câu hỏi Listening chính xác.",
    "Viết bài luận ngắn theo yêu cầu thi.",
    "Tự tin giao tiếp trong môi trường làm việc.",
    "Chuẩn bị tốt cho kỳ thi quốc tế.",
  ],
  skills: [
    "Listening",
    "Reading",
    "Speaking",
    "Writing",
    "Vocabulary",
    "Test Strategies",
    "Time Management",
    "Confidence",
  ],
  requirements: [
    "Kiến thức tiếng Anh cơ bản (trình độ A2 trở lên).",
    "Tai nghe và máy tính để học online.",
    "Sự kiên trì và cam kết học tập hàng ngày.",
  ],
  modules: [
    {
      title: "Introduction to TOEIC Exam",
      lectures: 3,
      time: "30min",
      lessons: [
        { name: "Giới thiệu về kỳ thi TOEIC", time: "10:00" },
        { name: "Cấu trúc đề thi và cách tính điểm", time: "10:00" },
        { name: "Lập kế hoạch học tập hiệu quả", time: "10:00" },
      ],
    },
    {
      title: "Listening Skills Development",
      lectures: 6,
      time: "1hr 15min",
      lessons: [
        { name: "Nghe hiểu Part 1 & 2", time: "12:00" },
        { name: "Nghe Part 3: Hội thoại ngắn", time: "12:00" },
        { name: "Nghe Part 4: Bài nói dài", time: "12:00" },
        { name: "Bài tập thực hành Listening", time: "15:00" },
        { name: "Mẹo xử lý câu hỏi khó", time: "12:00" },
        { name: "Ôn tập và kiểm tra", time: "12:00" },
      ],
    },
    {
      title: "Reading Skills Mastery",
      lectures: 5,
      time: "1hr",
      lessons: [
        { name: "Đọc hiểu Part 5: Điền từ", time: "12:00" },
        { name: "Đọc Part 6: Đoạn văn ngắn", time: "12:00" },
        { name: "Đọc Part 7: Đoạn văn dài", time: "12:00" },
        { name: "Chiến lược làm bài Reading", time: "12:00" },
        { name: "Bài tập thực hành", time: "12:00" },
      ],
    },
    {
      title: "Speaking Practice",
      lectures: 4,
      time: "45min",
      lessons: [
        { name: "Luyện phát âm chuẩn", time: "10:00" },
        { name: "Thực hành câu hỏi Speaking", time: "12:00" },
        { name: "Mô phỏng tình huống thực tế", time: "12:00" },
        { name: "Phản hồi và cải thiện", time: "11:00" },
      ],
    },
    {
      title: "Writing Techniques",
      lectures: 4,
      time: "45min",
      lessons: [
        { name: "Viết câu ngắn (Part 1)", time: "10:00" },
        { name: "Viết email (Part 2)", time: "12:00" },
        { name: "Bài tập viết thực hành", time: "12:00" },
        { name: "Kiểm tra và sửa lỗi", time: "11:00" },
      ],
    },
    {
      title: "Mock Test & Review",
      lectures: 3,
      time: "1hr 30min",
      lessons: [
        { name: "Đề thi mẫu TOEIC", time: "30:00" },
        { name: "Phân tích đáp án chi tiết", time: "30:00" },
        { name: "Ôn tập cuối khóa", time: "30:00" },
      ],
    },
  ],
  discussions: [
    {
      id: 1,
      user: {
        name: "Trần Thị Lan",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      date: "03/10/2025",
      content:
        "Khóa học này rất hay, mình đã cải thiện kỹ năng nghe rất nhiều. Cảm ơn thầy Hùng!",
      replies: [
        {
          id: 11,
          user: {
            name: "Nguyễn Văn Hùng",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          date: "04/10/2025",
          content:
            "Cảm ơn bạn Lan! Hãy tiếp tục luyện tập để đạt điểm cao nhé!",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Nguyễn Văn An",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      date: "02/10/2025",
      content: "Bài tập Reading rất sát đề thi, rất hữu ích!",
      replies: [],
    },
    {
      id: 3,
      user: {
        name: "Phạm Thị Hồng",
        avatar: "https://randomuser.me/api/portraits/women/47.jpg",
      },
      date: "01/10/2025",
      content: "Mình thích phần Speaking, nhưng cần thêm bài tập thực hành.",
      replies: [
        {
          id: 12,
          user: {
            name: "Nguyễn Văn Hùng",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          date: "02/10/2025",
          content:
            "Cảm ơn ý kiến của bạn Hồng! Sẽ có thêm bài tập trong bản cập nhật sau.",
        },
      ],
    },
  ],
};

// Dữ liệu giảng viên

const instructor = {
  name: "Nguyễn Văn Hùng",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Ảnh Unsplash giáo viên
  bio: "Thạc sĩ Ngôn ngữ Anh, 10 năm kinh nghiệm luyện thi TOEIC, IELTS. Đã giúp hơn 2000 học viên đạt mục tiêu điểm số mong muốn.",
  social: [
    { icon: "fa-facebook", url: "#" },
    { icon: "fa-youtube", url: "#" },
    { icon: "fa-envelope", url: "#" },
  ],
};

// Dữ liệu khóa học gợi ý
const suggestedCourses = [
  {
    title: "IELTS Speaking: Bí quyết đạt 7.0+",
    instructor: "Nguyễn Thị Mai",
    thumb:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80", // Ảnh Unsplash speaking
    price: 399000,
    oldPrice: 799000,
    rating: 4.8,
    students: 1200,
  },
  {
    title: "Luyện phát âm tiếng Anh chuẩn Mỹ",
    instructor: "Trần Văn Bảo",
    thumb:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80", // Ảnh Unsplash pronunciation
    price: 299000,
    oldPrice: 599000,
    rating: 4.7,
    students: 950,
  },
];

const CoursePreview = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [openModuleIdx, setOpenModuleIdx] = useState(null);

  // Accordion logic
  const handleToggleModule = (idx) => {
    setOpenModuleIdx(openModuleIdx === idx ? null : idx);
  };

  return (
    <div className="course-preview">
      {/* Header Section */}
      <div className="course-preview__container">
        <section className="course-preview__header">
          <div className="course-preview__header-left">
            <span className="course-preview__badge">{fakeCourse.category}</span>
            <h1 className="course-preview__title">{fakeCourse.title}</h1>
            <div className="course-preview__desc">{fakeCourse.shortDesc}</div>
            <div className="course-preview__rating-row">
              <span className="course-preview__rating">
                {fakeCourse.rating}{" "}
                <i className="fa fa-star" style={{ color: "#ffc107" }}></i>
                <span className="course-preview__rating-count">
                  ({fakeCourse.ratingCount} đánh giá)
                </span>
              </span>
            </div>
            <div className="course-preview__meta">
              <span>
                <i className="fa fa-list"></i> {fakeCourse.lessons} bài học
              </span>
              <span>
                <i className="fa fa-clock"></i> {fakeCourse.duration}
              </span>
            </div>
            <div className="course-preview__instructor">
              <img
                className="course-preview__instructor-avatar"
                src={fakeCourse.instructor.avatar}
                alt={fakeCourse.instructor.name}
              />
              <span className="course-preview__instructor-name">
                {fakeCourse.instructor.name}
              </span>
              <span className="course-preview__more-instructors">
                +{fakeCourse.moreInstructors} giảng viên khác
              </span>
            </div>
          </div>
          <div className="course-preview__header-right">
            <div className="course-preview__video">
              <img
                src={fakeCourse.video.thumb}
                alt="Xem trước khóa học"
                className="course-preview__video-thumb"
              />
              <button className="course-preview__video-play">
                <i className="fa fa-play"></i>
              </button>
              <div className="course-preview__video-progress">
                <div
                  className="course-preview__video-progress-bar"
                  style={{ width: `${fakeCourse.video.progress * 100}%` }}
                ></div>
              </div>
              <div className="course-preview__video-duration">
                {fakeCourse.video.duration}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
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
              activeTab === "discussions" ? "course-preview__tab--active" : ""
            }`}
            onClick={() => setActiveTab("discussions")}
          >
            Bình luận
          </span>
        </div>

        {/* Tab Content: 2 columns */}
        <div className="course-preview__main-row">
          <div className="course-preview__main-col course-preview__main-col--left">
            {activeTab === "about" && (
              <div className="course-preview__about">
                <h2 className="course-preview__about-title">
                  Giới thiệu khóa học
                </h2>
                {fakeCourse.about.map((p, i) => (
                  <p key={i} className="course-preview__about-desc">
                    {p}
                  </p>
                ))}
                <div className="course-preview__about-learn">
                  <h3>Bạn sẽ học được gì trong khóa học này?</h3>
                  <ul>
                    {fakeCourse.learn.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="course-preview__skills-req">
                  <div className="course-preview__skills">
                    <h2>Kỹ năng đạt được</h2>
                    <div className="course-preview__skills-list">
                      {fakeCourse.skills.map((skill, i) => (
                        <span className="course-preview__skill-tag" key={i}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="course-preview__requirements">
                    <h2>Yêu cầu</h2>
                    <ul>
                      {fakeCourse.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Curriculum Section */}
                <section className="course-preview__curriculum">
                  <h2 className="course-preview__curriculum-title">
                    Nội dung khóa học
                  </h2>
                  <div className="curriculum-accordion">
                    {fakeCourse.modules.map((mod, idx) => (
                      <div
                        className={`curriculum-accordion__item${
                          openModuleIdx === idx
                            ? " curriculum-accordion__item--open"
                            : ""
                        }`}
                        key={mod.title}
                      >
                        <div
                          className="curriculum-accordion__title"
                          onClick={() => handleToggleModule(idx)}
                        >
                          <span>{mod.title}</span>
                          <span className="curriculum-accordion__meta">
                            {mod.lectures} bài giảng | {mod.time}
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
                            {mod.lessons.map((lesson, i) => (
                              <div
                                className="curriculum-accordion__lesson"
                                key={i}
                              >
                                <i className="fa fa-play-circle"></i>
                                <span>{lesson.name}</span>
                                <span className="curriculum-accordion__lesson-time">
                                  {lesson.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Instructor */}
                <section className="course-preview__instructor-section">
                  <h2 className="course-preview__instructor-title">
                    Giảng viên
                  </h2>
                  <div className="course-preview__instructor-card">
                    <img
                      className="course-preview__instructor-avatar-lg"
                      src={instructor.avatar}
                      alt={instructor.name}
                    />
                    <div>
                      <div className="course-preview__instructor-name-lg">
                        {instructor.name}
                      </div>
                      <div className="course-preview__instructor-bio">
                        {instructor.bio}
                      </div>
                      <div className="course-preview__instructor-social">
                        {instructor.social.map((s, i) => (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className={`fa ${s.icon}`}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Suggested Courses */}
              </div>
            )}
            {activeTab === "discussions" && (
              <div className="course-preview__discussions">
                <h2 className="course-preview__discussions-title">Bình luận</h2>
                <div className="course-preview__discussions-count">
                  {fakeCourse.discussions.length} bình luận
                </div>
                <div className="discussion-list">
                  {fakeCourse.discussions.map((cmt) => (
                    <div className="discussion-item" key={cmt.id}>
                      <div className="discussion-item__avatar">
                        <img src={cmt.user.avatar} alt={cmt.user.name} />
                      </div>
                      <div className="discussion-item__content">
                        <div className="discussion-item__header">
                          <span className="discussion-item__name">
                            {cmt.user.name}
                          </span>
                          <span className="discussion-item__date">
                            {cmt.date}
                          </span>
                        </div>
                        <div className="discussion-item__text">
                          {cmt.content}
                        </div>
                        <div className="discussion-item__reply-link">
                          Trả lời
                        </div>
                        {cmt.replies &&
                          cmt.replies.map((rep) => (
                            <div className="discussion-reply" key={rep.id}>
                              <div className="discussion-item__avatar">
                                <img
                                  src={rep.user.avatar}
                                  alt={rep.user.name}
                                />
                              </div>
                              <div className="discussion-item__content">
                                <div className="discussion-item__header">
                                  <span className="discussion-item__name">
                                    {rep.user.name}
                                  </span>
                                  <span className="discussion-item__date">
                                    {rep.date}
                                  </span>
                                </div>
                                <div className="discussion-item__text">
                                  {rep.content}
                                </div>
                                <div className="discussion-item__reply-link">
                                  Trả lời
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                <div className="course-preview__discussions-pagination">
                  <button className="active">1</button>
                  <button>2</button>
                  <button>3</button>
                </div>
                {/* Comment Form */}
                <div className="discussion-form">
                  <h3>Để lại bình luận</h3>
                  <div className="discussion-form__desc">
                    Email của bạn sẽ không được hiển thị công khai. Các trường
                    bắt buộc được đánh dấu *
                  </div>
                  <form>
                    <div className="discussion-form__row">
                      <input type="text" placeholder="Họ tên*" required />
                      <input type="email" placeholder="Email*" required />
                    </div>
                    <textarea
                      placeholder="Nội dung bình luận"
                      required
                    ></textarea>
                    <div className="discussion-form__row">
                      <label>
                        <input type="checkbox" /> Lưu tên, email cho lần bình
                        luận sau
                      </label>
                    </div>
                    <button className="discussion-form__submit" type="submit">
                      Gửi bình luận
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="course-preview__main-col course-preview__main-col--right">
            <div className="course-preview__pricing-card">
              <div className="course-preview__price-main">
                <span className="course-preview__price-sale">
                  {fakeCourse.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                <span className="course-preview__price-old">
                  {fakeCourse.oldPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                <span className="course-preview__price-discount">
                  Giảm {fakeCourse.discount}%
                </span>
              </div>
              <button className="course-preview__btn-add-cart">
                Thêm vào giỏ hàng
              </button>
              <button className="course-preview__btn-buy-now">Mua ngay</button>
              <div className="course-preview__info-list">
                {fakeCourse.info.map((info, i) => (
                  <div key={i}>
                    <i className={`fa ${info.icon}`}></i> <b>{info.label}:</b>{" "}
                    {info.value}
                  </div>
                ))}
              </div>
              <div className="course-preview__about-achieve">
                <h4>Bạn sẽ đạt được gì?</h4>
                <ul>
                  {fakeCourse.achieve.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Requirements */}

        <section className="course-preview__suggested">
          <h2 className="course-preview__suggested-title">Khóa học gợi ý</h2>
          <div className="course-preview__suggested-list">
            {suggestedCourses.map((c, i) => (
              <div className="course-preview__suggested-item" key={i}>
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
                  <div className="course-preview__suggested-rating">
                    <i className="fa fa-star" style={{ color: "#ffc107" }}></i>{" "}
                    {c.rating} | {c.students} học viên
                  </div>
                  <div className="course-preview__suggested-price">
                    <span className="course-preview__price-sale">
                      {c.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    <span className="course-preview__price-old">
                      {c.oldPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <button className="course-preview__btn-buy-now course-preview__btn-buy-now--sm">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoursePreview;
