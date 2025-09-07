// Client/pages/Instructor/Instructor.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Instructor.css";

// Màu chủ đạo theo design system
const PRIMARY_COLOR = "#4fd1c7";
const ACCENT_COLOR = "#FF6B35";

// Dữ liệu giảng viên
const instructorData = [
  {
    id: 1,
    name: "Lâm Tiến Dưỡng",
    title: "Founder & Mentor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    category: "TOEIC",
    rating: 4.9,
    reviews: 245,
    experience: "8 năm kinh nghiệm",
    students: 1200,
    courses: 6,
    specialties: ["TOEIC Listening", "TOEIC Reading", "Business English"],
    about: "Với hơn 8 năm kinh nghiệm trong lĩnh vực giảng dạy tiếng Anh, tôi đã giúp hàng nghìn học viên đạt được mục tiêu TOEIC của mình. Phương pháp giảng dạy của tôi tập trung vào việc xây dựng nền tảng vững chắc và phát triển kỹ năng thực tế.",
    courses: [
      {
        id: 1,
        title: "TOEIC Listening Mastery: Từ Cơ Bản Đến Nâng Cao",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 156,
        lessons: 24,
        duration: "12hr 30mins",
        price: 299000,
        originalPrice: 399000,
        category: "TOEIC"
      },
      {
        id: 2,
        title: "TOEIC Reading Strategies: Đọc Hiểu Hiệu Quả",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 98,
        lessons: 18,
        duration: "9hr 45mins",
        price: 249000,
        originalPrice: 349000,
        category: "TOEIC"
      }
    ]
  },
  {
    id: 2,
    name: "Vũ Danh Phong",
    title: "Senior Instructor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    category: "TOEIC",
    rating: 4.8,
    reviews: 189,
    experience: "6 năm kinh nghiệm",
    students: 890,
    courses: 3,
    specialties: ["TOEIC 4 Skills", "Speaking", "Writing"],
    about: "Chuyên gia TOEIC với 6 năm kinh nghiệm, tôi đã phát triển phương pháp học tập hiệu quả giúp học viên cải thiện điểm số một cách nhanh chóng. Tôi tin rằng việc học tiếng Anh phải thú vị và thực tế.",
    courses: [
      {
        id: 3,
        title: "TOEIC Speaking & Writing: Kỹ Năng Thực Hành",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 87,
        lessons: 20,
        duration: "10hr 15mins",
        price: 279000,
        originalPrice: 379000,
        category: "TOEIC"
      }
    ]
  },
  {
    id: 3,
    name: "Vũ Công Duy",
    title: "IELTS Expert",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    category: "IELTS",
    rating: 4.9,
    reviews: 312,
    experience: "10 năm kinh nghiệm",
    students: 1500,
    courses: 4,
    specialties: ["IELTS Speaking", "IELTS Writing", "Academic English"],
    about: "Với 10 năm kinh nghiệm giảng dạy IELTS, tôi đã giúp hơn 1500 học viên đạt được band điểm mong muốn. Chuyên môn của tôi là IELTS Speaking và Writing, với phương pháp giảng dạy cá nhân hóa và hiệu quả.",
    courses: [
      {
        id: 4,
        title: "IELTS Speaking Mastery: Tự Tin Giao Tiếp",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        reviews: 234,
        lessons: 28,
        duration: "14hr 20mins",
        price: 399000,
        originalPrice: 499000,
        category: "IELTS"
      },
      {
        id: 5,
        title: "IELTS Writing Task 1 & 2: Kỹ Thuật Viết Bài",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 189,
        lessons: 22,
        duration: "11hr 45mins",
        price: 349000,
        originalPrice: 449000,
        category: "IELTS"
      }
    ]
  },
  {
    id: 4,
    name: "Vũ Hoài Thư",
    title: "Communication Specialist",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80",
    category: "Basic English",
    rating: 4.7,
    reviews: 156,
    experience: "5 năm kinh nghiệm",
    students: 650,
    courses: 2,
    specialties: ["Basic English", "Conversation", "Pronunciation"],
    about: "Chuyên gia giao tiếp tiếng Anh với 5 năm kinh nghiệm, tôi tập trung vào việc giúp học viên tự tin trong giao tiếp hàng ngày. Phương pháp của tôi kết hợp lý thuyết và thực hành để đạt hiệu quả tối đa.",
    courses: [
      {
        id: 6,
        title: "Basic English Conversation: Giao Tiếp Cơ Bản",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        reviews: 67,
        lessons: 16,
        duration: "8hr 30mins",
        price: 199000,
        originalPrice: 299000,
        category: "Basic English"
      }
    ]
  },
  {
    id: 5,
    name: "Nguyễn Thị Lan",
    title: "Grammar Expert",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    category: "Basic English",
    rating: 4.6,
    reviews: 98,
    experience: "7 năm kinh nghiệm",
    students: 420,
    courses: 3,
    specialties: ["Grammar", "Basic English", "Vocabulary"],
    about: "Chuyên gia ngữ pháp tiếng Anh với 7 năm kinh nghiệm, tôi đã phát triển phương pháp học ngữ pháp dễ hiểu và thú vị. Tôi tin rằng ngữ pháp là nền tảng quan trọng để học tiếng Anh hiệu quả.",
    courses: [
      {
        id: 7,
        title: "English Grammar Fundamentals: Ngữ Pháp Cơ Bản",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 89,
        lessons: 20,
        duration: "10hr 45mins",
        price: 229000,
        originalPrice: 329000,
        category: "Basic English"
      }
    ]
  },
  {
    id: 8,
    name: "Lê Văn Hùng",
    title: "Academic English Tutor",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    category: "IELTS",
    rating: 4.9,
    reviews: 203,
    experience: "8 năm kinh nghiệm",
    students: 950,
    courses: 3,
    specialties: ["IELTS Reading", "IELTS Listening", "Academic Writing"],
    about: "Chuyên gia tiếng Anh học thuật với 8 năm kinh nghiệm, tôi đã giúp hàng trăm học viên đạt được mục tiêu du học và làm việc quốc tế. Chuyên môn của tôi là IELTS Reading và Academic Writing.",
    courses: [
      {
        id: 8,
        title: "IELTS Reading Mastery: Đọc Hiểu Học Thuật",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 156,
        lessons: 24,
        duration: "12hr 15mins",
        price: 329000,
        originalPrice: 429000,
        category: "IELTS"
      }
    ]
  },
  {
    id: 9,
    name: "Hoàng Thị Mai",
    title: "Conversation Expert",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    category: "Basic English",
    rating: 4.5,
    reviews: 89,
    experience: "4 năm kinh nghiệm",
    students: 380,
    courses: 2,
    specialties: ["Conversation", "Daily English", "Pronunciation"],
    about: "Chuyên gia giao tiếp tiếng Anh với 4 năm kinh nghiệm, tôi tập trung vào việc giúp học viên tự tin trong các tình huống giao tiếp hàng ngày. Phương pháp của tôi thực tế và dễ áp dụng.",
    courses: [
      {
        id: 9,
        title: "Daily English Conversation: Tiếng Anh Hàng Ngày",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.4,
        reviews: 45,
        lessons: 14,
        duration: "7hr 20mins",
        price: 179000,
        originalPrice: 279000,
        category: "Basic English"
      }
    ]
  },
  {
    id: 10,
    name: "Đỗ Minh Khang",
    title: "TOEIC Master",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    category: "TOEIC",
    rating: 4.8,
    reviews: 178,
    experience: "7 năm kinh nghiệm",
    students: 720,
    courses: 4,
    specialties: ["TOEIC Strategy", "Test Taking", "Time Management"],
    about: "Chuyên gia TOEIC với 7 năm kinh nghiệm, tôi đã phát triển các chiến lược hiệu quả giúp học viên đạt điểm cao trong thời gian ngắn. Chuyên môn của tôi là test-taking strategies và time management.",
    courses: [
      {
        id: 10,
        title: "TOEIC Test Strategies: Chiến Lược Làm Bài Hiệu Quả",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 123,
        lessons: 18,
        duration: "9hr 30mins",
        price: 259000,
        originalPrice: 359000,
        category: "TOEIC"
      }
    ]
  },
  {
    id: 11,
    name: "Bùi Thị Linh",
    title: "IELTS Writing Specialist",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
    category: "IELTS",
    rating: 4.9,
    reviews: 256,
    experience: "9 năm kinh nghiệm",
    students: 1100,
    courses: 3,
    specialties: ["IELTS Writing", "Essay Structure", "Academic Vocabulary"],
    about: "Chuyên gia IELTS Writing với 9 năm kinh nghiệm, tôi đã giúp hơn 1100 học viên cải thiện kỹ năng viết và đạt band điểm mong muốn. Phương pháp của tôi tập trung vào cấu trúc bài viết và từ vựng học thuật.",
    courses: [
      {
        id: 11,
        title: "IELTS Writing Task 2: Cấu Trúc Bài Viết Hoàn Hảo",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        reviews: 198,
        lessons: 26,
        duration: "13hr 45mins",
        price: 379000,
        originalPrice: 479000,
        category: "IELTS"
      }
    ]
  }
];

// Categories cho filter
const categories = [
  { id: "all", name: "All Mentors", count: instructorData.length },
  { id: "TOEIC", name: "TOEIC", count: instructorData.filter(i => i.category === "TOEIC").length },
  { id: "IELTS", name: "IELTS", count: instructorData.filter(i => i.category === "IELTS").length },
  { id: "Basic English", name: "Basic English", count: instructorData.filter(i => i.category === "Basic English").length }
];

const Instructor = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter instructors
  const filteredInstructors = useMemo(() => {
    if (selectedCategory === "all") {
      return instructorData;
    }
    return instructorData.filter(instructor => instructor.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="instructor-page">
      <div className="instructor-container">
        {/* Hero Section */}
        <section className="instructor-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>E-Learning has the qualified mentor</h1>
              <p>Discover our expert instructors who will guide you on your learning journey</p>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80" 
                alt="Mentor illustration" 
              />
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="instructor-filter">
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Instructor Grid */}
        <section className="instructor-grid">
          {filteredInstructors.map((instructor) => (
            <Link key={instructor.id} to={`/instructor/${instructor.id}`} className="instructor-card-link">
              <div className="instructor-card">
                <div className="instructor-image">
                  <img src={instructor.image} alt={instructor.name} />
                </div>
                <div className="instructor-info">
                  <h3 className="instructor-name">{instructor.name}</h3>
                  <div className="instructor-title">
                    <span>{instructor.title}</span>
                    <i className="fa fa-chevron-down"></i>
                  </div>
                  {instructor.rating && (
                    <div className="instructor-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa fa-star ${i < Math.floor(instructor.rating) ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                      <span className="rating-text">
                        {instructor.rating} ({instructor.reviews})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Pagination */}
        <section className="instructor-pagination">
          <button className="pagination-btn prev">
            <i className="fa fa-chevron-left"></i>
          </button>
          <span className="pagination-info">Page 1 of 3</span>
          <button className="pagination-btn next">
            <i className="fa fa-chevron-right"></i>
          </button>
        </section>
      </div>
    </div>
  );
};

export default Instructor;
