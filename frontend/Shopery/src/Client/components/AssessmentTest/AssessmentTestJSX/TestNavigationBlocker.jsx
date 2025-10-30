import React, { useState } from "react";
import { useExamLeaveBlocker } from "../../../hooks/Assessment/useExamLeaveBlocker";

/**
 * Component test để demo useExamLeaveBlocker hook
 * Sử dụng để test các trường hợp navigation
 */
export default function TestNavigationBlocker() {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    console.log("Submitting exam...", answers);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    console.log("Exam submitted successfully!");
  };

  const { customNavigate } = useExamLeaveBlocker(
    !isSubmitted, // Chỉ block khi chưa nộp bài
    "⚠️ Bài kiểm tra chưa được nộp. Bạn có chắc muốn rời khỏi trang không?",
    handleSubmit
  );

  const handleAnswer = (questionId, choiceId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Test Navigation Blocker</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Trạng thái: {isSubmitted ? "✅ Đã nộp bài" : "❌ Chưa nộp bài"}</h2>
        <p>Số câu đã trả lời: {Object.keys(answers).length}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Câu hỏi mẫu:</h3>
        {[1, 2, 3].map((qId) => (
          <div key={qId} style={{ marginBottom: "10px" }}>
            <p>Câu {qId}: Chọn đáp án?</p>
            <div>
              {["A", "B", "C", "D"].map((choice) => (
                <label key={choice} style={{ marginRight: "10px" }}>
                  <input
                    type="radio"
                    name={`q${qId}`}
                    checked={answers[qId] === choice}
                    onChange={() => handleAnswer(qId, choice)}
                  />
                  {choice}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitted}
          style={{
            padding: "10px 20px",
            backgroundColor: isSubmitted ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitted ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitted ? "Đã nộp bài" : "Nộp bài"}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test Navigation (sẽ bị block nếu chưa nộp bài):</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => customNavigate("/")}>Về trang chủ</button>
          <button onClick={() => customNavigate("/profile")}>
            Xem profile
          </button>
          <button onClick={() => customNavigate("/course")}>
            Xem khóa học
          </button>
          <button onClick={() => customNavigate("/assessment")}>
            Danh sách bài thi
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test Links (sẽ bị block nếu chưa nộp bài):</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#007bff", textDecoration: "underline" }}>
            Link về trang chủ
          </a>
          <a
            href="/profile"
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            Link profile
          </a>
          <a
            href="/course"
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            Link khóa học
          </a>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test Browser Navigation:</h3>
        <p>Thử các cách sau để test:</p>
        <ul>
          <li>Nhấn F5 (reload page)</li>
          <li>Nhấn Ctrl+R (reload page)</li>
          <li>Nhấn nút Back/Forward của browser</li>
          <li>Đóng tab/browser</li>
          <li>Nhập URL khác vào address bar</li>
        </ul>
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "4px",
        }}
      >
        <h4>Hướng dẫn test:</h4>
        <ol>
          <li>Trả lời một vài câu hỏi (chưa nộp bài)</li>
          <li>Thử click các button/link navigation → Sẽ hiện confirm dialog</li>
          <li>Thử F5 hoặc đóng tab → Sẽ hiện browser warning</li>
          <li>Nộp bài (click "Nộp bài")</li>
          <li>Thử lại các navigation → Sẽ không bị block nữa</li>
        </ol>
      </div>
    </div>
  );
}
