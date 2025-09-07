// Client/pages/Blog/Blog.jsx
import React, { useState, useMemo } from "react";
import "./Blog.css";

// Màu chủ đạo theo design system
const PRIMARY_COLOR = "#4fd1c7";
const ACCENT_COLOR = "#FF6B35";

// Dữ liệu blog posts
const blogData = [
  {
    id: 1,
    title: "10 Cách Học Từ Vựng Tiếng Anh Hiệu Quả Nhất",
    excerpt: "Khám phá những phương pháp học từ vựng tiếng Anh hiệu quả nhất, giúp bạn ghi nhớ lâu dài và sử dụng thành thạo trong giao tiếp hàng ngày.",
    author: "Admin",
    category: "Học tiếng Anh",
    tags: ["từ vựng", "phương pháp", "ghi nhớ"],
    date: "2 ngày trước",
    readTime: "5 phút",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
    featured: true,
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: "Bí Quyết Luyện Thi TOEIC Listening Đạt 900+",
    excerpt: "Chia sẻ kinh nghiệm và bí quyết luyện thi TOEIC Listening để đạt điểm cao trong kỳ thi. Bao gồm các tips và tricks từ giáo viên có kinh nghiệm.",
    author: "Lâm Tiến Dưỡng",
    category: "TOEIC",
    tags: ["TOEIC", "Listening", "luyện thi"],
    date: "1 tuần trước",
    readTime: "7 phút",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    featured: false,
    views: 2100,
    likes: 156
  },
  {
    id: 3,
    title: "Cách Viết IELTS Writing Task 2 Hoàn Hảo",
    excerpt: "Hướng dẫn chi tiết cách viết IELTS Writing Task 2 với cấu trúc bài viết và từ vựng phù hợp. Kèm theo các bài mẫu và phân tích.",
    author: "Vũ Công Duy",
    category: "IELTS",
    tags: ["IELTS", "Writing", "Task 2"],
    date: "2 tuần trước",
    readTime: "8 phút",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    featured: true,
    views: 1800,
    likes: 134
  },
  {
    id: 4,
    title: "Phương Pháp Học Tiếng Anh Giao Tiếp Tự Nhiên",
    excerpt: "Tìm hiểu cách học tiếng Anh giao tiếp tự nhiên như người bản xứ. Các phương pháp thực tế và hiệu quả cho người mới bắt đầu.",
    author: "Vũ Hoài Thư",
    category: "Học tiếng Anh",
    tags: ["giao tiếp", "tự nhiên", "phương pháp"],
    date: "3 tuần trước",
    readTime: "6 phút",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    featured: false,
    views: 950,
    likes: 67
  },
  {
    id: 5,
    title: "Lộ Trình Học TOEIC 4 Kỹ Năng Từ 0-800+",
    excerpt: "Lộ trình chi tiết học TOEIC 4 kỹ năng từ con số 0 đến 800+. Bao gồm tài liệu, phương pháp và timeline cụ thể cho từng giai đoạn.",
    author: "Vũ Danh Phong",
    category: "TOEIC",
    tags: ["TOEIC", "4 kỹ năng", "lộ trình"],
    date: "1 tháng trước",
    readTime: "10 phút",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    featured: false,
    views: 3200,
    likes: 245
  },
  {
    id: 6,
    title: "IELTS Speaking: Cách Trả Lời Part 1 Hiệu Quả",
    excerpt: "Hướng dẫn chi tiết cách trả lời IELTS Speaking Part 1 một cách tự nhiên và hiệu quả. Kèm theo các câu hỏi thường gặp và câu trả lời mẫu.",
    author: "Vũ Công Duy",
    category: "IELTS",
    tags: ["IELTS", "Speaking", "Part 1"],
    date: "1 tháng trước",
    readTime: "6 phút",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    featured: false,
    views: 1500,
    likes: 98
  },
  {
    id: 7,
    title: "Từ Vựng Tiếng Anh Chuyên Ngành Công Nghệ",
    excerpt: "Tổng hợp từ vựng tiếng Anh chuyên ngành công nghệ thông tin. Hữu ích cho developer, IT và những người làm việc trong lĩnh vực tech.",
    author: "Admin",
    category: "Học tiếng Anh",
    tags: ["từ vựng", "công nghệ", "IT"],
    date: "1 tháng trước",
    readTime: "5 phút",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    featured: false,
    views: 800,
    likes: 45
  },
  {
    id: 8,
    title: "Cách Học Tiếng Anh Qua Phim Hiệu Quả",
    excerpt: "Phương pháp học tiếng Anh qua phim một cách hiệu quả. Cách chọn phim phù hợp, các bước học và tài nguyên hữu ích.",
    author: "Vũ Hoài Thư",
    category: "Học tiếng Anh",
    tags: ["học qua phim", "listening", "giải trí"],
    date: "2 tháng trước",
    readTime: "7 phút",
    image: "https://images.unsplash.com/photo-1489599803000-0b0b0b0b0b0b?auto=format&fit=crop&w=400&q=80",
    featured: false,
    views: 1200,
    likes: 78
  }
];

// Lấy danh sách categories và tags
function getFilterOptions(posts) {
  const categories = {};
  const tags = {};
  const authors = {};
  
  posts.forEach((post) => {
    categories[post.category] = (categories[post.category] || 0) + 1;
    authors[post.author] = (authors[post.author] || 0) + 1;
    post.tags.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
  });
  
  return {
    categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
    tags: Object.entries(tags).map(([name, count]) => ({ name, count })),
    authors: Object.entries(authors).map(([name, count]) => ({ name, count }))
  };
}

const Blog = () => {
  // State management
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter posts
  const filteredPosts = useMemo(() => {
    return blogData.filter((post) => {
      // Search
      if (search && !post.title.toLowerCase().includes(search.toLowerCase()) && 
          !post.excerpt.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== "all" && post.category !== selectedCategory) {
        return false;
      }
      
      return true;
    });
  }, [search, selectedCategory]);

  // Get filter options
  const filterOptions = useMemo(() => getFilterOptions(blogData), []);

  // Get recent posts (latest 3)
  const recentPosts = useMemo(() => {
    return blogData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, []);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    blogData.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, []);

  return (
    <div className="blog-page">
      <div className="blog-container">
        {/* Header */}
        <div className="blog-header">
          <h1>All Articles</h1>
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="fa fa-search blog-search-icon"></i>
          </div>
        </div>

        <div className="blog-main">
          {/* Main Content */}
          <section className="blog-content">
            <div className="blog-posts">
              {filteredPosts.length === 0 && (
                <div className="no-posts">Không tìm thấy bài viết phù hợp.</div>
              )}
              
              {filteredPosts.map((post) => (
                <article className="blog-post" key={post.id}>
                  <div className="blog-post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  
                  <div className="blog-post-content">
                    <h3 className="blog-post-title">{post.title}</h3>
                    <div className="blog-post-date">
                      <i className="fa fa-calendar"></i> {post.date}
                    </div>
                    <p className="blog-post-excerpt">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="blog-pagination">
              <button className="pagination-btn">
                <i className="fa fa-chevron-left"></i>
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="blog-sidebar">
            {/* Category Section */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Category</h3>
              <div className="category-list">
                <div 
                  className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <span className="category-name">All</span>
                  <span className="category-count">{blogData.length}</span>
                </div>
                {filterOptions.categories.map((category) => (
                  <div 
                    key={category.name} 
                    className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posts Section */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Recent Posts</h3>
              <div className="recent-posts">
                {recentPosts.map((post) => (
                  <div key={post.id} className="recent-post">
                    <div className="recent-post-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className="recent-post-content">
                      <h4 className="recent-post-title">{post.title}</h4>
                      <div className="recent-post-date">
                        <i className="fa fa-calendar"></i> {post.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Tags</h3>
              <div className="tags-list">
                {allTags.map((tag) => (
                  <span key={tag} className="tag-item">#{tag}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;