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
    avatar: "/assets/images/instructor-hung.jpg",
  },
  moreInstructors: 1,
  video: {
    thumb: "/assets/images/toeic-4skills-thumb.jpg",
    duration: "9:15",
    progress: 0.06,
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
  price: 29.99,
  oldPrice: 69.99,
  discount: 57,
  info: [
    { icon: "fa-signal", label: "Skill Level", value: "All Levels" },
    { icon: "fa-clock", label: "Duration", value: "15hr 45mins" },
    { icon: "fa-calendar", label: "Last Updated", value: "August 15, 2025" },
    { icon: "fa-list", label: "Lessons", value: "30 Lessons" },
    {
      icon: "fa-certificate",
      label: "Certificate",
      value: "Digital Certificate",
    },
    { icon: "fa-users", label: "Students", value: "1850" },
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
      user: { name: "Trần Thị Lan", avatar: "/assets/images/user1.jpg" },
      date: "October 03, 2025",
      content:
        "Khóa học này rất hay, mình đã cải thiện kỹ năng nghe rất nhiều. Cảm ơn thầy Hùng!",
      replies: [
        {
          id: 11,
          user: {
            name: "Nguyễn Văn Hùng",
            avatar: "/assets/images/instructor-hung.jpg",
          },
          date: "October 04, 2025",
          content:
            "Cảm ơn bạn Lan! Hãy tiếp tục luyện tập để đạt điểm cao nhé!",
        },
      ],
    },
    {
      id: 2,
      user: { name: "Nguyễn Văn An", avatar: "/assets/images/user2.jpg" },
      date: "October 02, 2025",
      content: "Bài tập Reading rất sát đề thi, rất hữu ích!",
      replies: [],
    },
    {
      id: 3,
      user: { name: "Phạm Thị Hồng", avatar: "/assets/images/user3.jpg" },
      date: "October 01, 2025",
      content: "Mình thích phần Speaking, nhưng cần thêm bài tập thực hành.",
      replies: [
        {
          id: 12,
          user: {
            name: "Nguyễn Văn Hùng",
            avatar: "/assets/images/instructor-hung.jpg",
          },
          date: "October 02, 2025",
          content:
            "Cảm ơn ý kiến của bạn Hồng! Sẽ có thêm bài tập trong bản cập nhật sau.",
        },
      ],
    },
  ],
};

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
                ({fakeCourse.ratingCount} ratings)
              </span>
            </span>
          </div>
          <div className="course-preview__meta">
            <span>
              <i className="fa fa-list"></i> {fakeCourse.lessons} Lessons
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
              +{fakeCourse.moreInstructors} more instructors
            </span>
          </div>
        </div>
        <div className="course-preview__header-right">
          <div className="course-preview__video">
            <img
              src={fakeCourse.video.thumb}
              alt="Course Preview"
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
          About
        </span>
        <span
          className={`course-preview__tab ${
            activeTab === "discussions" ? "course-preview__tab--active" : ""
          }`}
          onClick={() => setActiveTab("discussions")}
        >
          Discussions
        </span>
      </div>

      {/* Tab Content: 2 columns */}
      <div className="course-preview__main-row">
        <div className="course-preview__main-col course-preview__main-col--left">
          {activeTab === "about" && (
            <div className="course-preview__about">
              <h2 className="course-preview__about-title">About this course</h2>
              {fakeCourse.about.map((p, i) => (
                <p key={i} className="course-preview__about-desc">
                  {p}
                </p>
              ))}
              <div className="course-preview__about-learn">
                <h3>What will you learn in this online course?</h3>
                <ul>
                  {fakeCourse.learn.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="course-preview__skills-req">
                <div className="course-preview__skills">
                  <h2>Skills you will gain</h2>
                  <div className="course-preview__skills-list">
                    {fakeCourse.skills.map((skill, i) => (
                      <span className="course-preview__skill-tag" key={i}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="course-preview__requirements">
                  <h2>Requirements</h2>
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
                  What's in this course?
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
                          {mod.lectures} lectures | {mod.time}
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
            </div>
          )}
          {activeTab === "discussions" && (
            <div className="course-preview__discussions">
              <h2 className="course-preview__discussions-title">Comments</h2>
              <div className="course-preview__discussions-count">
                {fakeCourse.discussions.length} Comments
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
                      <div className="discussion-item__text">{cmt.content}</div>
                      <div className="discussion-item__reply-link">Reply</div>
                      {cmt.replies &&
                        cmt.replies.map((rep) => (
                          <div className="discussion-reply" key={rep.id}>
                            <div className="discussion-item__avatar">
                              <img src={rep.user.avatar} alt={rep.user.name} />
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
                                Reply
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
                <h3>Leave A Comment</h3>
                <div className="discussion-form__desc">
                  Your email address will not be published. Required fields are
                  marked *
                </div>
                <form>
                  <div className="discussion-form__row">
                    <input type="text" placeholder="Name*" required />
                    <input type="email" placeholder="Email*" required />
                  </div>
                  <textarea placeholder="Comment" required></textarea>
                  <div className="discussion-form__row">
                    <label>
                      <input type="checkbox" /> Save my name, email in this
                      browser for the next time I comment
                    </label>
                  </div>
                  <button className="discussion-form__submit" type="submit">
                    Post Comment
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
                ${fakeCourse.price}
              </span>
              <span className="course-preview__price-old">
                ${fakeCourse.oldPrice}
              </span>
              <span className="course-preview__price-discount">
                {fakeCourse.discount}% Off
              </span>
            </div>
            <button className="course-preview__btn-add-cart">
              Add to Cart
            </button>
            <button className="course-preview__btn-buy-now">Buy Now</button>
            <div className="course-preview__info-list">
              {fakeCourse.info.map((info, i) => (
                <div key={i}>
                  <i className={`fa ${info.icon}`}></i> <b>{info.label}:</b>{" "}
                  {info.value}
                </div>
              ))}
            </div>
            <div className="course-preview__about-achieve">
              <h4>What will you achieve?</h4>
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

      {/* ...Các phần instructor, related giữ nguyên nếu muốn... */}
    </div>
  );
};

export default CoursePreview;
