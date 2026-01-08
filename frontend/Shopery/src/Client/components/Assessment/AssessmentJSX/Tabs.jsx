import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useStartExamSession,
  useCancelExamSession,
} from "../../../services/Assessment/assessmentMutations";
import "../AssessmentCSS/Tabs.css";
import Comment from "../AssessmentJSX/Comment";
import PartSelector from "./PartSelector";
import ActiveSessionModal from "./ActiveSessionModal";

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

  console.log("data", JSON.stringify(data, null, 2));
  console.log("testId", testId);

  const [activeTab, setActiveTab] = useState("Luyện tập");
  const navigate = useNavigate();
  
  // Mutations
  const { mutateAsync: createStartExam, isPending: loadingStartExam } =
    useStartExamSession();
  const { mutateAsync: cancelSession, isPending: loadingCancel } =
    useCancelExamSession();

  // State cho ActiveSessionModal
  const [showActiveSessionModal, setShowActiveSessionModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [requestedTestId, setRequestedTestId] = useState(null);

  const handleStartTest = async () => {
    const currentTestId = Props?.testId;
    const session_type = "FULL_TEST";
    const time_limit_minutes = 120;

    // ✅ Lấy tất cả parts từ data thực tế thay vì hardcode
    const selected_parts =
      data && Array.isArray(data)
        ? data.map((part) => part.part_number).sort((a, b) => a - b)
        : [1, 2, 3, 4, 5, 6, 7]; // Fallback nếu không có data

    const result = await createStartExam({
      test_id: currentTestId,
      session_type,
      selected_parts,
      time_limit_minutes,
    });

    console.log("[Tabs] startExamSession result:", result);

    // ✅ EC = 0 + is_newly_created = true → Vào làm bài ngay
    if (result && result.EC === "0" && result.DT?.is_newly_created) {
      navigate("/assessmentTest", {
        state: {
          sessionData: result.DT,
          partData: data,
        },
      });
      return;
    }

    // ✅ EC = 3 → Có active sessions → Hiển thị modal
    if (result && result.EC === "3" && result.DT?.active_sessions) {
      console.log("[Tabs] Active sessions detected:", result.DT.active_sessions);
      setActiveSessions(result.DT.active_sessions);
      setRequestedTestId(result.DT.requested_test_id);
      setShowActiveSessionModal(true);
      return;
    }

    // ✅ EC = 0 nhưng không có is_newly_created (có thể là session đã tồn tại)
    if (result && result.EC === "0") {
      navigate("/assessmentTest", {
        state: {
          sessionData: result.DT,
          partData: data,
        },
      });
    }
  };

  // ✅ Handler: Tiếp tục bài thi cũ
  const handleContinueSession = (session) => {
    console.log("[Tabs] Continuing session:", session);
    setShowActiveSessionModal(false);
    
    // Navigate đến assessmentTest với session data từ active session
    navigate("/assessmentTest", {
      state: {
        sessionData: {
          ...session,
          // Đảm bảo có các trường cần thiết
          exam_session_id: session.exam_session_id,
          test_id: session.test_id,
          start_time: session.start_time,
          time_limit_minutes: session.time_limit_minutes,
          selected_parts: session.selected_parts,
          cached_answers: session.cached_answers, // Đáp án đã lưu từ Redis
        },
        partData: data,
      },
    });
  };

  // ✅ Handler: Hủy bài thi
  const handleCancelSession = async (sessionId) => {
    try {
      const result = await cancelSession(sessionId);
      if (result && result.EC === "0") {
        // Xóa session khỏi danh sách
        const updatedSessions = activeSessions.filter(
          (s) => s.exam_session_id !== sessionId
        );
        setActiveSessions(updatedSessions);

        // Nếu hết active sessions → Tự động tạo bài thi mới
        if (updatedSessions.length === 0) {
          setShowActiveSessionModal(false);
          // Gọi lại handleStartTest để tạo session mới
          handleStartTest();
        }
      }
    } catch (error) {
      console.error("[Tabs] Cancel session error:", error);
    }
  };

  // ✅ Handler: Đóng modal
  const handleCloseModal = () => {
    setShowActiveSessionModal(false);
    setActiveSessions([]);
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
      // phần luyện tập từng phần một
      {activeTab === "Luyện tập" && (
        <PartSelector data={data} testId={testId} />
      )}
      // Phần làm full test
      {activeTab === "Full test" && (
        <>
          <div className="assessment-tabs_content_fix">
            <div className="assessment-tabs__content">
              <div className="assessment-banner__fullTest">
                ‼️Sẵn sàng để bắt đầu làm full test? Để đạt được kết quả tốt
                nhất, bạn cần dành ra 120 phút cho bài test này.
              </div>
              <button
                className="assessment-tabs__start-btn"
                onClick={handleStartTest}
              >
                Bắt đầu làm bài
              </button>
            </div>
          </div>
          <Comment testId={testId} />
        </>
      )}
      // Phần thảo luận trong chi tiết đề thi
      {activeTab === "Thảo luận" && (
        <div className="assessment-tabs__content">
          <Comment testId={testId} />
        </div>
      )}

      {/* ✅ Active Session Modal */}
      <ActiveSessionModal
        isOpen={showActiveSessionModal}
        sessions={activeSessions}
        requestedTestId={requestedTestId}
        onContinue={handleContinueSession}
        onCancel={handleCancelSession}
        onClose={handleCloseModal}
        isLoading={loadingCancel}
      />
    </div>
  );
};

export default Tabs;
