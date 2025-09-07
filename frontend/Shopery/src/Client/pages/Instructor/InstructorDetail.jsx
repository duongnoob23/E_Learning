// Client/pages/Instructor/InstructorDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import "./InstructorDetail.css";

// Import data từ Instructor.jsx (trong thực tế sẽ fetch từ API)
const instructorData = [
  {
    id: 1,
    name: "Lâm Tiến Dưỡng",
    title: "Founder & Mentor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    category: "TOEIC",
    rating: 4.9,
    reviews: 245,
    experience: "8 năm kinh nghiệm",
    students: 1200,
    courses: 6,
    specialties: ["TOEIC Listening", "TOEIC Reading", "Business English"],
    about: "Với hơn 8 năm kinh nghiệm trong lĩnh vực giảng dạy tiếng Anh, tôi đã giúp hàng nghìn học viên đạt được mục tiêu TOEIC của mình. Phương pháp giảng dạy của tôi tập trung vào việc xây dựng nền tảng vững chắc và phát triển kỹ năng thực tế. Tôi tin rằng việc học tiếng Anh không chỉ là ghi nhớ từ vựng và ngữ pháp, mà còn là việc hiểu và áp dụng ngôn ngữ trong các tình huống thực tế. Với kinh nghiệm làm việc tại các trung tâm ngoại ngữ hàng đầu và đã từng du học tại Mỹ, tôi hiểu rõ những khó khăn mà học viên Việt Nam gặp phải khi học tiếng Anh.",
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
      },
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
      },
      {
        id: 4,
        title: "TOEIC Test Strategies: Chiến Lược Làm Bài Hiệu Quả",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 123,
        lessons: 18,
        duration: "9hr 30mins",
        price: 259000,
        originalPrice: 359000,
        category: "TOEIC"
      },
      {
        id: 5,
        title: "Business English for TOEIC: Tiếng Anh Thương Mại",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        reviews: 67,
        lessons: 16,
        duration: "8hr 30mins",
        price: 229000,
        originalPrice: 329000,
        category: "TOEIC"
      },
      {
        id: 6,
        title: "TOEIC Vocabulary Master: Từ Vựng Cốt Lõi",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 134,
        lessons: 22,
        duration: "11hr 45mins",
        price: 269000,
        originalPrice: 369000,
        category: "TOEIC"
      }
    ]
  },
  {
    id: 2,
    name: "Vũ Danh Phong",
    title: "Senior Instructor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    category: "TOEIC",
    rating: 4.8,
    reviews: 189,
    experience: "6 năm kinh nghiệm",
    students: 890,
    courses: 3,
    specialties: ["TOEIC 4 Skills", "Speaking", "Writing"],
    about: "Chuyên gia TOEIC với 6 năm kinh nghiệm, tôi đã phát triển phương pháp học tập hiệu quả giúp học viên cải thiện điểm số một cách nhanh chóng. Tôi tin rằng việc học tiếng Anh phải thú vị và thực tế. Với background về ngôn ngữ học và kinh nghiệm giảng dạy tại nhiều trung tâm lớn, tôi hiểu rõ cách tiếp cận phù hợp với từng đối tượng học viên.",
    courses: [
      {
        id: 7,
        title: "TOEIC Speaking & Writing: Kỹ Năng Thực Hành",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 87,
        lessons: 20,
        duration: "10hr 15mins",
        price: 279000,
        originalPrice: 379000,
        category: "TOEIC"
      },
      {
        id: 8,
        title: "TOEIC Listening Advanced: Nâng Cao Kỹ Năng Nghe",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 95,
        lessons: 22,
        duration: "11hr 30mins",
        price: 289000,
        originalPrice: 389000,
        category: "TOEIC"
      },
      {
        id: 9,
        title: "TOEIC Reading Comprehension: Đọc Hiểu Chuyên Sâu",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 112,
        lessons: 19,
        duration: "9hr 45mins",
        price: 269000,
        originalPrice: 369000,
        category: "TOEIC"
      }
    ]
  },
  {
    id: 3,
    name: "Vũ Công Duy",
    title: "IELTS Expert",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    category: "IELTS",
    rating: 4.9,
    reviews: 312,
    experience: "10 năm kinh nghiệm",
    students: 1500,
    courses: 4,
    specialties: ["IELTS Speaking", "IELTS Writing", "Academic English"],
    about: "Với 10 năm kinh nghiệm giảng dạy IELTS, tôi đã giúp hơn 1500 học viên đạt được band điểm mong muốn. Chuyên môn của tôi là IELTS Speaking và Writing, với phương pháp giảng dạy cá nhân hóa và hiệu quả. Tôi từng là giám khảo IELTS và hiểu rõ tiêu chí chấm điểm, giúp học viên đạt được kết quả tốt nhất.",
    courses: [
      {
        id: 10,
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
        id: 11,
        title: "IELTS Writing Task 1 & 2: Kỹ Thuật Viết Bài",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 189,
        lessons: 22,
        duration: "11hr 45mins",
        price: 349000,
        originalPrice: 449000,
        category: "IELTS"
      },
      {
        id: 12,
        title: "IELTS Listening Strategies: Chiến Lược Nghe Hiệu Quả",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 156,
        lessons: 20,
        duration: "10hr 30mins",
        price: 329000,
        originalPrice: 429000,
        category: "IELTS"
      },
      {
        id: 13,
        title: "IELTS Reading Techniques: Kỹ Thuật Đọc Nhanh",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 178,
        lessons: 24,
        duration: "12hr 15mins",
        price: 339000,
        originalPrice: 439000,
        category: "IELTS"
      }
    ]
  },
  {
    id: 4,
    name: "Vũ Hoài Thư",
    title: "Communication Specialist",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
    category: "Basic English",
    rating: 4.7,
    reviews: 156,
    experience: "5 năm kinh nghiệm",
    students: 650,
    courses: 2,
    specialties: ["Basic English", "Conversation", "Pronunciation"],
    about: "Chuyên gia giao tiếp tiếng Anh với 5 năm kinh nghiệm, tôi tập trung vào việc giúp học viên tự tin trong giao tiếp hàng ngày. Phương pháp của tôi kết hợp lý thuyết và thực hành để đạt hiệu quả tối đa. Tôi tin rằng giao tiếp tự tin là chìa khóa để thành công trong học tập và công việc.",
    courses: [
      {
        id: 14,
        title: "Basic English Conversation: Giao Tiếp Cơ Bản",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        reviews: 67,
        lessons: 16,
        duration: "8hr 30mins",
        price: 199000,
        originalPrice: 299000,
        category: "Basic English"
      },
      {
        id: 15,
        title: "English Pronunciation Master: Phát Âm Chuẩn",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 89,
        lessons: 18,
        duration: "9hr 15mins",
        price: 229000,
        originalPrice: 329000,
        category: "Basic English"
      }
    ]
  },
  {
    id: 5,
    name: "Nguyễn Thị Lan",
    title: "Grammar Expert",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    category: "Basic English",
    rating: 4.6,
    reviews: 98,
    experience: "7 năm kinh nghiệm",
    students: 420,
    courses: 3,
    specialties: ["Grammar", "Basic English", "Vocabulary"],
    about: "Chuyên gia ngữ pháp tiếng Anh với 7 năm kinh nghiệm, tôi đã phát triển phương pháp học ngữ pháp dễ hiểu và thú vị. Tôi tin rằng ngữ pháp là nền tảng quan trọng để học tiếng Anh hiệu quả. Với cách tiếp cận thực tế và dễ hiểu, tôi giúp học viên nắm vững ngữ pháp một cách tự nhiên.",
    courses: [
      {
        id: 16,
        title: "English Grammar Fundamentals: Ngữ Pháp Cơ Bản",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 89,
        lessons: 20,
        duration: "10hr 45mins",
        price: 229000,
        originalPrice: 329000,
        category: "Basic English"
      },
      {
        id: 17,
        title: "English Vocabulary Builder: Xây Dựng Từ Vựng",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        reviews: 76,
        lessons: 17,
        duration: "8hr 45mins",
        price: 209000,
        originalPrice: 309000,
        category: "Basic English"
      },
      {
        id: 18,
        title: "English Tenses Master: Thì Động Từ Hoàn Hảo",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 95,
        lessons: 19,
        duration: "9hr 30mins",
        price: 219000,
        originalPrice: 319000,
        category: "Basic English"
      }
    ]
  },
  {
    id: 8,
    name: "Lê Văn Hùng",
    title: "Academic English Tutor",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    category: "IELTS",
    rating: 4.9,
    reviews: 203,
    experience: "8 năm kinh nghiệm",
    students: 950,
    courses: 3,
    specialties: ["IELTS Reading", "IELTS Listening", "Academic Writing"],
    about: "Chuyên gia tiếng Anh học thuật với 8 năm kinh nghiệm, tôi đã giúp hàng trăm học viên đạt được mục tiêu du học và làm việc quốc tế. Chuyên môn của tôi là IELTS Reading và Academic Writing. Với bằng Thạc sĩ ngôn ngữ học và kinh nghiệm giảng dạy tại các trường đại học, tôi hiểu rõ yêu cầu của tiếng Anh học thuật.",
    courses: [
      {
        id: 19,
        title: "IELTS Reading Mastery: Đọc Hiểu Học Thuật",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 156,
        lessons: 24,
        duration: "12hr 15mins",
        price: 329000,
        originalPrice: 429000,
        category: "IELTS"
      },
      {
        id: 20,
        title: "Academic Writing Skills: Kỹ Năng Viết Học Thuật",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 134,
        lessons: 21,
        duration: "10hr 45mins",
        price: 309000,
        originalPrice: 409000,
        category: "IELTS"
      },
      {
        id: 21,
        title: "IELTS Listening Academic: Nghe Hiểu Học Thuật",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 142,
        lessons: 23,
        duration: "11hr 30mins",
        price: 319000,
        originalPrice: 419000,
        category: "IELTS"
      }
    ]
  },
  {
    id: 9,
    name: "Hoàng Thị Mai",
    title: "Conversation Expert",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    category: "Basic English",
    rating: 4.5,
    reviews: 89,
    experience: "4 năm kinh nghiệm",
    students: 380,
    courses: 2,
    specialties: ["Conversation", "Daily English", "Pronunciation"],
    about: "Chuyên gia giao tiếp tiếng Anh với 4 năm kinh nghiệm, tôi tập trung vào việc giúp học viên tự tin trong các tình huống giao tiếp hàng ngày. Phương pháp của tôi thực tế và dễ áp dụng. Tôi tin rằng việc thực hành giao tiếp thường xuyên là cách tốt nhất để cải thiện kỹ năng tiếng Anh.",
    courses: [
      {
        id: 22,
        title: "Daily English Conversation: Tiếng Anh Hàng Ngày",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.4,
        reviews: 45,
        lessons: 14,
        duration: "7hr 20mins",
        price: 179000,
        originalPrice: 279000,
        category: "Basic English"
      },
      {
        id: 23,
        title: "English for Travel: Tiếng Anh Du Lịch",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.3,
        reviews: 34,
        lessons: 12,
        duration: "6hr 15mins",
        price: 159000,
        originalPrice: 259000,
        category: "Basic English"
      }
    ]
  },
  {
    id: 10,
    name: "Đỗ Minh Khang",
    title: "TOEIC Master",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    category: "TOEIC",
    rating: 4.8,
    reviews: 178,
    experience: "7 năm kinh nghiệm",
    students: 720,
    courses: 4,
    specialties: ["TOEIC Strategy", "Test Taking", "Time Management"],
    about: "Chuyên gia TOEIC với 7 năm kinh nghiệm, tôi đã phát triển các chiến lược hiệu quả giúp học viên đạt điểm cao trong thời gian ngắn. Chuyên môn của tôi là test-taking strategies và time management. Với kinh nghiệm làm giám khảo TOEIC, tôi hiểu rõ cách thức ra đề và cách tối ưu hóa điểm số.",
    courses: [
      {
        id: 24,
        title: "TOEIC Test Strategies: Chiến Lược Làm Bài Hiệu Quả",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 123,
        lessons: 18,
        duration: "9hr 30mins",
        price: 259000,
        originalPrice: 359000,
        category: "TOEIC"
      },
      {
        id: 25,
        title: "TOEIC Time Management: Quản Lý Thời Gian",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 98,
        lessons: 16,
        duration: "8hr 15mins",
        price: 239000,
        originalPrice: 339000,
        category: "TOEIC"
      },
      {
        id: 26,
        title: "TOEIC Mock Tests: Luyện Đề Thi Thật",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 156,
        lessons: 20,
        duration: "10hr 45mins",
        price: 279000,
        originalPrice: 379000,
        category: "TOEIC"
      },
      {
        id: 27,
        title: "TOEIC Score Booster: Tăng Điểm Nhanh Chóng",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 134,
        lessons: 17,
        duration: "8hr 45mins",
        price: 249000,
        originalPrice: 349000,
        category: "TOEIC"
      }
    ]
  },
  {
    id: 11,
    name: "Bùi Thị Linh",
    title: "IELTS Writing Specialist",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    category: "IELTS",
    rating: 4.9,
    reviews: 256,
    experience: "9 năm kinh nghiệm",
    students: 1100,
    courses: 3,
    specialties: ["IELTS Writing", "Essay Structure", "Academic Vocabulary"],
    about: "Chuyên gia IELTS Writing với 9 năm kinh nghiệm, tôi đã giúp hơn 1100 học viên cải thiện kỹ năng viết và đạt band điểm mong muốn. Phương pháp của tôi tập trung vào cấu trúc bài viết và từ vựng học thuật. Với bằng Tiến sĩ ngôn ngữ học và kinh nghiệm chấm thi IELTS, tôi hiểu rõ tiêu chí chấm điểm và cách đạt điểm cao.",
    courses: [
      {
        id: 28,
        title: "IELTS Writing Task 2: Cấu Trúc Bài Viết Hoàn Hảo",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        reviews: 198,
        lessons: 26,
        duration: "13hr 45mins",
        price: 379000,
        originalPrice: 479000,
        category: "IELTS"
      },
      {
        id: 29,
        title: "IELTS Writing Task 1: Mô Tả Biểu Đồ Chuyên Nghiệp",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 167,
        lessons: 22,
        duration: "11hr 30mins",
        price: 329000,
        originalPrice: 429000,
        category: "IELTS"
      },
      {
        id: 30,
        title: "Academic Vocabulary for IELTS: Từ Vựng Học Thuật",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 145,
        lessons: 24,
        duration: "12hr 15mins",
        price: 309000,
        originalPrice: 409000,
        category: "IELTS"
      }
    ]
  }
];

const InstructorDetail = () => {
  const { id } = useParams();
  const instructor = instructorData.find(inst => inst.id === parseInt(id));

  if (!instructor) {
    return (
      <div className="instructor-detail-page">
        <div className="instructor-container">
          <div className="not-found">
            <h2>Không tìm thấy giảng viên</h2>
            <Link to="/instructor" className="back-link">
              Quay lại danh sách giảng viên
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="instructor-detail-page">
      <div className="instructor-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">></span>
          <Link to="/instructor" className="breadcrumb-link">Instructor</Link>
        </div>

        {/* Main Content */}
        <div className="instructor-detail-content">
          {/* Left Column - Instructor Profile */}
          <div className="instructor-profile">
            <div className="instructor-avatar">
              <img src={instructor.image} alt={instructor.name} />
            </div>
            
            <div className="instructor-basic-info">
              <h1 className="instructor-name">{instructor.name}</h1>
              <p className="instructor-title">{instructor.title}</p>
              
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
                  {instructor.rating} ({instructor.reviews} đánh giá)
                </span>
              </div>
            </div>

            <div className="instructor-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fa fa-users"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-number">{instructor.students.toLocaleString()}</div>
                  <div className="stat-label">Total Students</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fa fa-book"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-number">{instructor.courses.length}</div>
                  <div className="stat-label">Courses</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - About & Courses */}
          <div className="instructor-details">
            {/* About Section */}
            <section className="about-section">
              <h2 className="section-title">About me</h2>
              <div className="about-content">
                <p>{instructor.about}</p>
              </div>
            </section>

            {/* My Courses Section */}
            <section className="courses-section">
              <h2 className="section-title">My Courses</h2>
              <div className="courses-grid">
                {instructor.courses.map((course) => (
                  <div key={course.id} className="course-card">
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                      <div className="course-category">{course.category}</div>
                    </div>
                    
                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      
                      <div className="course-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa fa-star ${i < Math.floor(course.rating) ? 'filled' : ''}`}
                            ></i>
                          ))}
                        </div>
                        <span className="rating-text">
                          {course.rating} ({course.reviews})
                        </span>
                      </div>
                      
                      <div className="course-meta">
                        <span className="course-lessons">{course.lessons} Lessons</span>
                        <span className="course-duration">{course.duration}</span>
                      </div>
                      
                      <div className="course-author">By {instructor.name}</div>
                      
                      <div className="course-price">
                        <span className="current-price">{formatPrice(course.price)}</span>
                        {course.originalPrice > course.price && (
                          <span className="original-price">{formatPrice(course.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetail;
