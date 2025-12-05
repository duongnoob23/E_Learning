import React from "react";
import "../AssessmentCSS/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="assessment-sidebar">
      {/* --- Profile Card --- */}
      <div className="assessment-sidebar__profile-card">
        <div className="assessment-sidebar__avatar" />
        <p className="assessment-sidebar__username">lamtiendung11082002</p>
        <p className="assessment-sidebar__note">
          <i className="fa fa-info-circle" /> Bạn chưa tạo mục tiêu cho quá
          trình luyện thi của mình.{" "}
          <span className="assessment-sidebar__link">Tạo ngay.</span>
        </p>
        <button className="assessment-sidebar__button">
          📊 Thống kê kết quả
        </button>
      </div>

      {/* --- Ads --- */}
      <div className="assessment-sidebar__ads">
        {/* <img
          src="https://via.placeholder.com/300x120?text=IELTS+Courses"
          alt="IELTS Ad"
        />
        <img
          src="https://via.placeholder.com/300x120?text=TOEIC+Score+Calculator"
          alt="TOEIC Calculator"
        />
        <img
          src="https://via.placeholder.com/300x120?text=Study4+Extension"
          alt="Study4 Extension"
        /> */}
      </div>
    </aside>
  );
};

export default Sidebar;
