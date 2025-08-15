// Blog Page - Trang bài viết học tiếng Anh
import React, { useState } from "react";
import "./Blog.css";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Dữ liệu mẫu - sau này sẽ lấy từ API
  const blogPosts = [
    {
      id: 1,
      title: "10 cách học từ vựng tiếng Anh hiệu quả",
      excerpt:
        "Khám phá những phương pháp học từ vựng tiếng Anh hiệu quả nhất, giúp bạn nhớ lâu và sử dụng đúng ngữ cảnh.",
      category: "vocabulary",
      author: "Giáo viên TOTC",
      date: "15/12/2024",
      readTime: "5 phút",
      image:
        "https://via.placeholder.com/300x200/667eea/ffffff?text=Vocabulary",
    },
    {
      id: 2,
      title: "Ngữ pháp cơ bản: Thì hiện tại đơn",
      excerpt:
        "Hướng dẫn chi tiết về thì hiện tại đơn trong tiếng Anh, bao gồm cấu trúc, cách sử dụng và ví dụ thực tế.",
      category: "grammar",
      author: "Giáo viên TOTC",
      date: "14/12/2024",
      readTime: "7 phút",
      image: "https://via.placeholder.com/300x200/764ba2/ffffff?text=Grammar",
    },
    {
      id: 3,
      title: "Luyện phát âm tiếng Anh chuẩn xác",
      excerpt:
        "Các kỹ thuật luyện phát âm tiếng Anh chuẩn xác, giúp bạn tự tin giao tiếp với người bản xứ.",
      category: "pronunciation",
      author: "Giáo viên TOTC",
      date: "13/12/2024",
      readTime: "6 phút",
      image:
        "https://via.placeholder.com/300x200/f093fb/ffffff?text=Pronunciation",
    },
    {
      id: 4,
      title: "Từ vựng chủ đề: Du lịch và khám phá",
      excerpt:
        "Bộ từ vựng tiếng Anh chủ đề du lịch, giúp bạn tự tin giao tiếp khi đi du lịch nước ngoài.",
      category: "vocabulary",
      author: "Giáo viên TOTC",
      date: "12/12/2024",
      readTime: "4 phút",
      image: "https://via.placeholder.com/300x200/f5576c/ffffff?text=Travel",
    },
  ];

  const categories = [
    { id: "all", name: "Tất cả", count: blogPosts.length },
    {
      id: "vocabulary",
      name: "Từ vựng",
      count: blogPosts.filter((post) => post.category === "vocabulary").length,
    },
    {
      id: "grammar",
      name: "Ngữ pháp",
      count: blogPosts.filter((post) => post.category === "grammar").length,
    },
    {
      id: "pronunciation",
      name: "Phát âm",
      count: blogPosts.filter((post) => post.category === "pronunciation")
        .length,
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="blog-page">
      <div className="blog-container">
        <div className="blog-header">
          <h1>Blog học tiếng Anh</h1>
          <p>Khám phá những bài viết hữu ích để nâng cao kỹ năng tiếng Anh</p>
        </div>

        {/* Category Filter */}
        <div className="blog-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`blog-category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
              <span className="blog-category-count">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="blog-posts">
          {filteredPosts.map((post) => (
            <article key={post.id} className="blog-post">
              <div className="blog-post-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-post-category">
                  {categories.find((cat) => cat.id === post.category)?.name}
                </div>
              </div>

              <div className="blog-post-content">
                <div className="blog-post-meta">
                  <span className="blog-post-author">{post.author}</span>
                  <span className="blog-post-date">{post.date}</span>
                  <span className="blog-post-read-time">{post.readTime}</span>
                </div>

                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-post-excerpt">{post.excerpt}</p>

                <button className="blog-post-read-more">Đọc thêm</button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="blog-load-more">
          <button className="blog-load-more-btn">Xem thêm bài viết</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
