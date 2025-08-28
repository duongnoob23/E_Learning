import { useState, useMemo } from "react";
import "./Course.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CoursePreview from "./CoursePreview/CoursePreview";
// Màu xanh chủ đạo
const PRIMARY_COLOR = "#1ec28b";

// Dữ liệu khóa học đa dạng
const courseData = [
  {
    id: 1,
    title: "TOEIC 2 Kỹ Năng - Listening & Reading",
    instructor: "Lâm Tiến Dưỡng",
    desc: "Khóa học luyện thi TOEIC 2 kỹ năng, phù hợp cho người mới bắt đầu.",
    rating: 4.8,
    reviews: 1342,
    price: 0,
    oldPrice: 29.0,
    bestSeller: true,
    discount: 100,
    image:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    category: "Toeic 2 kĩ năng",
    level: "Beginner",
    duration: "4 Tuần",
    students: 320,
    isFree: true,
  },
  {
    id: 2,
    title: "TOEIC 4 Kỹ Năng - Full Skills",
    instructor: "Vũ Dan Phong",
    desc: "Chinh phục TOEIC 4 kỹ năng với lộ trình bài bản, tài liệu chuẩn quốc tế.",
    rating: 4.6,
    reviews: 980,
    price: 19.99,
    oldPrice: 39.99,
    bestSeller: false,
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    category: "Toeic 4 kĩ năng",
    level: "Intermediate",
    duration: "6 Tuần",
    students: 210,
    isFree: false,
  },
  {
    id: 3,
    title: "IELTS Speaking Master",
    instructor: "Vũ Công Duy",
    desc: "Nâng cao kỹ năng Speaking IELTS với giáo viên bản ngữ, feedback chi tiết.",
    rating: 4.9,
    reviews: 2100,
    price: 29.99,
    oldPrice: 49.99,
    bestSeller: true,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    category: "IELTS",
    level: "Expert",
    duration: "8 Tuần",
    students: 500,
    isFree: false,
  },
  {
    id: 4,
    title: "Tiếng Anh Giao Tiếp Cơ Bản",
    instructor: "Vũ Hoài Thư",
    desc: "Học tiếng Anh giao tiếp từ con số 0, thực hành qua tình huống thực tế.",
    rating: 4.3,
    reviews: 800,
    price: 0,
    oldPrice: 25.0,
    bestSeller: false,
    discount: 100,
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    category: "Tiếng anh cơ bản",
    level: "Beginner",
    duration: "3 Tuần",
    students: 150,
    isFree: true,
  },
  {
    id: 5,
    title: "IELTS Writing Intensive",
    instructor: "Lâm Tiến Dưỡng",
    desc: "Chuyên sâu kỹ năng viết IELTS, sửa bài chi tiết từng câu.",
    rating: 4.7,
    reviews: 1120,
    price: 24.99,
    oldPrice: 39.99,
    bestSeller: false,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    category: "IELTS",
    level: "Intermediate",
    duration: "5 Tuần",
    students: 200,
    isFree: false,
  },
  {
    id: 6,
    title: "TOEIC Listening Practice",
    instructor: "Vũ Dan Phong",
    desc: "Luyện nghe TOEIC với đề thi thật, cập nhật liên tục.",
    rating: 4.2,
    reviews: 670,
    price: 9.99,
    oldPrice: 19.99,
    bestSeller: false,
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    category: "Toeic 2 kĩ năng",
    level: "Beginner",
    duration: "2 Tuần",
    students: 110,
    isFree: false,
  },
  {
    id: 7,
    title: "Tiếng Anh Cho Người Mất Gốc",
    instructor: "Vũ Công Duy",
    desc: "Khóa học dành cho người mất gốc, xây nền tảng vững chắc.",
    rating: 4.5,
    reviews: 900,
    price: 0,
    oldPrice: 20.0,
    bestSeller: false,
    discount: 100,
    image:
      "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=400&q=80",
    category: "Tiếng anh cơ bản",
    level: "Beginner",
    duration: "4 Tuần",
    students: 180,
    isFree: true,
  },
  {
    id: 8,
    title: "IELTS Reading Tips & Tricks",
    instructor: "Vũ Hoài Thư",
    desc: "Bí quyết làm bài Reading IELTS nhanh, chính xác, tiết kiệm thời gian.",
    rating: 4.4,
    reviews: 650,
    price: 14.99,
    oldPrice: 29.99,
    bestSeller: false,
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=400&q=80",
    category: "IELTS",
    level: "Intermediate",
    duration: "3 Tuần",
    students: 120,
    isFree: false,
  },
  {
    id: 9,
    title: "TOEIC Speaking & Writing",
    instructor: "Lâm Tiến Dưỡng",
    desc: "Luyện nói và viết TOEIC, tăng điểm nhanh chóng.",
    rating: 4.6,
    reviews: 780,
    price: 19.99,
    oldPrice: 34.99,
    bestSeller: false,
    discount: 43,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    category: "Toeic 4 kĩ năng",
    level: "Expert",
    duration: "6 Tuần",
    students: 210,
    isFree: false,
  },
  {
    id: 10,
    title: "Tiếng Anh Phỏng Vấn Xin Việc",
    instructor: "Vũ Dan Phong",
    desc: "Chuẩn bị phỏng vấn xin việc bằng tiếng Anh, luyện tập thực tế.",
    rating: 4.1,
    reviews: 400,
    price: 7.99,
    oldPrice: 15.99,
    bestSeller: false,
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    category: "Tiếng anh cơ bản",
    level: "Intermediate",
    duration: "2 Tuần",
    students: 90,
    isFree: false,
  },
  {
    id: 11,
    title: "IELTS Listening Advanced",
    instructor: "Vũ Công Duy",
    desc: "Luyện nghe IELTS nâng cao, cập nhật đề mới nhất.",
    rating: 4.8,
    reviews: 1100,
    price: 27.99,
    oldPrice: 39.99,
    bestSeller: true,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    category: "IELTS",
    level: "Expert",
    duration: "7 Tuần",
    students: 300,
    isFree: false,
  },
  {
    id: 12,
    title: "TOEIC Grammar Foundation",
    instructor: "Vũ Hoài Thư",
    desc: "Nắm vững ngữ pháp TOEIC, luyện tập qua bài tập thực tế.",
    rating: 4.0,
    reviews: 350,
    price: 0,
    oldPrice: 15.0,
    bestSeller: false,
    discount: 100,
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    category: "Toeic 2 kĩ năng",
    level: "Beginner",
    duration: "3 Tuần",
    students: 80,
    isFree: true,
  },
];

// Lấy danh sách động cho filter
function getFilterOptions(courses) {
  const categories = {};
  const instructors = {};
  const levels = {};
  courses.forEach((c) => {
    categories[c.category] = (categories[c.category] || 0) + 1;
    instructors[c.instructor] = (instructors[c.instructor] || 0) + 1;
    levels[c.level] = (levels[c.level] || 0) + 1;
  });
  return {
    categories: Object.entries(categories).map(([name, count]) => ({
      name,
      count,
    })),
    instructors: Object.entries(instructors).map(([name, count]) => ({
      name,
      count,
    })),
    levels: Object.entries(levels).map(([name, count]) => ({ name, count })),
  };
}

const reviewOptions = [5, 4, 3, 2, 1];

function Course() {
  // State filter
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedReview, setSelectedReview] = useState([]);
  const [showReview, setShowReview] = useState(false);

  const navigate = useNavigate();
  // Lọc dữ liệu động
  const filteredCourses = useMemo(() => {
    return courseData.filter((course) => {
      // Search
      if (search && !course.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      // Category
      if (
        selectedCategories.length &&
        !selectedCategories.includes(course.category)
      )
        return false;
      // Instructor
      if (
        selectedInstructors.length &&
        !selectedInstructors.includes(course.instructor)
      )
        return false;
      // Level
      if (selectedLevels.length && !selectedLevels.includes(course.level))
        return false;
      // Price
      if (selectedPrice === "free" && !course.isFree) return false;
      if (selectedPrice === "paid" && course.isFree) return false;
      // Review
      if (
        selectedReview.length &&
        !selectedReview.includes(Math.round(course.rating))
      )
        return false;
      return true;
    });
  }, [
    search,
    selectedCategories,
    selectedInstructors,
    selectedLevels,
    selectedPrice,
    selectedReview,
  ]);

  // Lấy options filter động theo dữ liệu đã lọc
  const filterOptions = useMemo(() => getFilterOptions(courseData), []);

  // Xử lý chọn filter
  const handleCheckbox = (value, arr, setArr) => {
    setArr((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleReview = (star) => {
    setSelectedReview((prev) =>
      prev.includes(star) ? prev.filter((v) => v !== star) : [...prev, star]
    );
  };

  return (
    <div className="course-container">
      <div className="course-page">
        <div className="course-header">
          <h2>All Courses</h2>
          <div className="course-search">
            <input
              type="text"
              placeholder="Search course name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="fa fa-search icon-search"></i>
          </div>
          <div className="course-view-toggle">
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
              aria-label="List view"
            >
              <i className="fa fa-list"></i>
            </button>
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              <i className="fa fa-th-large"></i>
            </button>
          </div>
        </div>
        <div className="course-main">
          <aside className="course-filter">
            <div className="filter-group">
              <h4>Thể loại</h4>
              {filterOptions.categories.map((c) => (
                <label key={c.name} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c.name)}
                    onChange={() =>
                      handleCheckbox(
                        c.name,
                        selectedCategories,
                        setSelectedCategories
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  {c.name}
                  <span className="filter-count">{c.count}</span>
                </label>
              ))}
            </div>
            <div className="filter-group">
              <h4>Instructor</h4>
              {filterOptions.instructors.map((i) => (
                <label key={i.name} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedInstructors.includes(i.name)}
                    onChange={() =>
                      handleCheckbox(
                        i.name,
                        selectedInstructors,
                        setSelectedInstructors
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  {i.name}
                  <span className="filter-count">{i.count}</span>
                </label>
              ))}
            </div>
            <div className="filter-group filter-group-price">
              <h4>Giá</h4>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "all"}
                  onChange={() => setSelectedPrice("all")}
                />
                <span className="radiomark"></span>
                Tất cả
                <span className="filter-count">{courseData.length}</span>
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "free"}
                  onChange={() => setSelectedPrice("free")}
                />
                <span className="radiomark"></span>
                Miễn phí
                <span className="filter-count">
                  {courseData.filter((c) => c.isFree).length}
                </span>
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "paid"}
                  onChange={() => setSelectedPrice("paid")}
                />
                <span className="radiomark"></span>
                Trả phí
                <span className="filter-count">
                  {courseData.filter((c) => !c.isFree).length}
                </span>
              </label>
              <button
                className="btn-review"
                onClick={() => setShowReview((v) => !v)}
              >
                Xem Thêm <i className="fa fa-angle-double-right"></i>
              </button>
            </div>
            <div className="filter-group">
              <h4>Review</h4>
              {reviewOptions.map((star) => (
                <label
                  key={star}
                  className={`custom-checkbox star-checkbox ${
                    selectedReview.includes(star) ? "checked" : ""
                  }`}
                  onClick={() => handleReview(star)}
                >
                  <input
                    type="checkbox"
                    checked={selectedReview.includes(star)}
                    readOnly
                  />
                  <span className="checkmark"></span>
                  {[...Array(star)].map((_, i) => (
                    <i
                      key={i}
                      className="fa fa-star"
                      style={{ color: PRIMARY_COLOR, marginRight: 2 }}
                    ></i>
                  ))}
                  <span className="filter-count">
                    {
                      courseData.filter((c) => Math.round(c.rating) === star)
                        .length
                    }
                  </span>
                </label>
              ))}
            </div>
            <div className="filter-group">
              <h4>Level</h4>
              {filterOptions.levels.map((l) => (
                <label key={l.name} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(l.name)}
                    onChange={() =>
                      handleCheckbox(l.name, selectedLevels, setSelectedLevels)
                    }
                  />
                  <span className="checkmark"></span>
                  {l.name}
                  <span className="filter-count">{l.count}</span>
                </label>
              ))}
            </div>
          </aside>
          <section className={`course-list ${view}`}>
            {filteredCourses.length === 0 && (
              <div className="no-course">Không tìm thấy khóa học phù hợp.</div>
            )}
            {filteredCourses.map((course) => (
              <div className="course-card" key={course.id}>
                <div className="course-card-img">
                  <img src={course.image} alt={course.title} />
                  <div className="course-card-tags">
                    {course.bestSeller && (
                      <span className="tag best-seller">Best Seller</span>
                    )}
                    {course.discount > 0 && (
                      <span className="tag discount">
                        {course.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <div className="course-card-content">
                  <div className="course-card-meta">
                    <span className="course-card-instructor">
                      <i className="fa fa-user"></i> {course.instructor}
                    </span>
                    <span className="course-card-duration">
                      <i className="fa fa-clock"></i> {course.duration}
                    </span>
                    <span className="course-card-students">
                      <i className="fa fa-users"></i> {course.students} HV
                    </span>
                  </div>
                  <h3>{course.title}</h3>
                  <div className="course-card-desc">{course.desc}</div>
                  <div className="course-card-rating">
                    <span className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className="fa fa-star"
                          style={{
                            color:
                              i < Math.round(course.rating)
                                ? PRIMARY_COLOR
                                : "#e4e5e9",
                          }}
                        ></i>
                      ))}
                    </span>
                    <span className="reviews">
                      ({course.reviews.toLocaleString()})
                    </span>
                  </div>
                  <div className="course-card-price">
                    {course.isFree ? (
                      <>
                        <span className="old-price">
                          ${course.oldPrice.toFixed(2)}
                        </span>
                        <span
                          className="price"
                          style={{ color: PRIMARY_COLOR }}
                        >
                          Free
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="price">
                          ${course.price.toFixed(2)}
                        </span>
                        <span className="old-price">
                          ${course.oldPrice.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="btn-view-more"
                  >
                    View More <i className="fa fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="course-pagination">
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
        </div>
      </div>
    </div>
  );
}

export default Course;
