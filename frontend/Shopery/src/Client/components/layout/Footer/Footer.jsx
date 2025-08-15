import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">TOTC</h3>
            <p className="footer__description">
              Nền tảng học trực tuyến hàng đầu, giúp bạn phát triển kỹ năng một
              cách hiệu quả.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Liên kết</h4>
            <ul className="footer__links">
              <li>
                <a href="/about">Về chúng tôi</a>
              </li>
              <li>
                <a href="/courses">Khóa học</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/contact">Liên hệ</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Hỗ trợ</h4>
            <ul className="footer__links">
              <li>
                <a href="/help">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="/faq">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="/privacy">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="/terms">Điều khoản sử dụng</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Liên hệ</h4>
            <div className="footer__contact">
              <p>📧 info@totc.edu.vn</p>
              <p>📞 1900-1234</p>
              <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2024 TOTC. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
