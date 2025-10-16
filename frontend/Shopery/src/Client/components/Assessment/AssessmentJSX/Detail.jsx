import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useTestDetail,
  useTestParts,
} from "../../../services/Assessment/assessmentQueries";
import "../AssessmentCSS/Detail.css";
import InfoBox from "./InfoBox";
import Sidebar from "./Sidebar";
import Tabs from "./Tabs";

const Detail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const location = useLocation();
  const testId = location.state?.testId;
  console.log("detaill - testid", testId);
  const { data: detailsData, isLoading: detailsLoading } = useTestDetail(id);
  const { data: partsData, isLoading: partsLoading } = useTestParts(id);
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
  }, [detailsData]);

  if (detailsLoading || partsLoading) return <p>Đang tải dữ liệu đề thi...</p>;

  return (
    <div className="assessment-detail container">
      <div className="assessment-detail__main">
        <InfoBox exam={exam} data={detailsData.DT} />
        <Tabs data={partsData.DT} testId={testId}>
          {" "}
        </Tabs>
      </div>

      <div className="assessment-detail__sidebar">
        <Sidebar />
      </div>
    </div>
  );
};

export default Detail;

{
  /* <AssessmentTabs
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
</AssessmentTabs> */
}
