import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStartExamSession } from "../../../services/Assessment/assessmentMutations";
import "../AssessmentCSS/Tabs.css";
import PartSelector from "./PartSelector";
import Comment from "../AssessmentJSX/Comment";
const tabs = ["Luyện tập", "Full test", "Thảo luận"];

const parts = [
  {
    name: "Part 1",
    description: "Tranh và người và vật",
    count: 6,
  },
  {
    name: "Part 2",
    description: "Câu hỏi ngắn",
    count: 25,
  },
  {
    name: "Part 3",
    description: "Hội thoại ngắn",
    count: 39,
  },
  {
    name: "Part 4",
    description: "Bài nói ngắn",
    count: 30,
  },
  {
    name: "Part 5",
    description: "Từ vựng & ngữ pháp",
    count: 40,
  },
  {
    name: "Part 6",
    description: "Hoàn thành đoạn văn",
    count: 12,
  },
  {
    name: "Part 7",
    description: "Đọc hiểu",
    count: 48,
  },
];

// {
//   "test_id": 1,
//   "session_type": "FULL_TEST",
//   "selected_parts": [1, 2, 3],
//   "time_limit_minutes": 120
// }

const Tabs = (Props) => {
  const { data, testId } = Props;

  console.log("testId", testId);
  const [activeTab, setActiveTab] = useState("Luyện tập");
  const navigate = useNavigate();
  const { mutateAsync: createStartExam, isPending: loadingStartExam } =
    useStartExamSession();

  const handleStartTest = async () => {
    const testId = Props?.testId;
    const session_type = "FULL_TEST";
    const time_limit_minutes = 120;
    const selected_parts = [1, 2, 3, 4, 5, 6, 7];

    const result = await createStartExam({
      test_id: testId,
      session_type,
      selected_parts,
      time_limit_minutes,
    });

    console.log("===", result);
    if (result && +result.EC === 0) {
      // ✅ Truyền sessionData qua navigation
      navigate("/assessmentTest", {
        state: {
          sessionData: result.DT,
        },
      });
    }
  };
  return (
    <div className="assessment-tabs">
      <div className="assessment-tabs__header">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`assessment-tabs__btn ${
              activeTab === tab ? "assessment-tabs__btn--active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Luyện tập" && (
        <PartSelector data={data} testId={testId} />
      )}

      {activeTab === "Full test" && (
        <div className="assessment-tabs_content_fix">
          <div className="assessment-tabs__content">
            <p>Chế độ Full Test sẽ làm toàn bộ 200 câu trong 120 phút.</p>
            <button
              className="assessment-tabs__start-btn"
              onClick={handleStartTest}
            >
              Bắt đầu làm bài
            </button>
          </div>
        </div>
      )}

      {activeTab === "Thảo luận" && (
        <div className="assessment-tabs__content">
          <Comment />
        </div>
      )}
    </div>
  );
};

export default Tabs;
