import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../AssessmentCSS/AssessmentDetail.css";
import AssessmentSidebar from "./AssessmentSidebar";
import AssessmentInfoBox from "./AssessmentInfoBox";
import AssessmentTabs from "./AssessmentTabs";
import AssessmentPartSelector from "./AssessmentPartSelector";

const AssessmentDetail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);

  // ✅ Giả lập API call — trong thực tế bạn sẽ gọi từ server theo id
  useEffect(() => {
    const mockData = {
      id,
      title: "New Economy TOEIC Test 10",
      duration: 120,
      questions: 200,
      participants: 757968,
      comments: 601,
      tags: ["TOEIC", "Listening", "Reading"],
      note: "Chú ý: Đề được quy đổi theo thang điểm scaled...",
    };
    setExam(mockData);
  }, [id]);

  if (!exam) return <p>Đang tải dữ liệu đề thi...</p>;

  return (
    <div className="assessment-detail container">
      <div className="assessment-detail__main">
        <AssessmentInfoBox exam={exam} />
        <AssessmentTabs
          tabs={["Thông tin đề thi", "Luyện tập", "Full Test", "Thảo luận"]}
        >
          <div label="Thông tin đề thi">
            <p>{exam.note}</p>
          </div>

          <div label="Luyện tập">
            <AssessmentPartSelector />
          </div>
    
          <div label="Full Test">
            <p>Chế độ làm toàn bộ đề thi.</p>
          </div>

          <div label="Thảo luận">
            <p>Hiển thị bình luận, chia sẻ kinh nghiệm làm đề.</p>
          </div>
        </AssessmentTabs>
      </div>

      <div className="assessment-detail__sidebar">
        <AssessmentSidebar />
      </div>
    </div>
  );
};

export default AssessmentDetail;
