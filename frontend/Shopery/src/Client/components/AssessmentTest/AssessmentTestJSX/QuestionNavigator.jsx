/* File: src/components/QuestionNavigator.jsx */
import React from "react";

export default function QuestionNavigator({
  partsSummary,
  answers,
  onJump,
  onSubmit,
  isSubmitting,
  onNavigate,
  timeLeft, // ✅ Nhận timeLeft từ parent component
}) {
  // ✅ Format hiển thị (HH:MM:SS hoặc MM:SS)
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) {
      return "0:00";
    }
    
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <aside className="navigator">
      <div className="navigator__top">
        <div className="navigator__timer">
          Thời gian còn lại:
          <div className="navigator__time" style={{
            color: timeLeft !== null && timeLeft < 300 ? "#EF4444" : "inherit" // Đỏ khi còn < 5 phút
          }}>
            {formatTime(timeLeft)}
          </div>
        </div>
        <button
          className="navigator__submit"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang nộp..." : "NỘP BÀI"}
        </button>
      </div>

      <div className="navigator__note">
        <div className="navigator__restore">Khôi phục/lưu bài làm</div>
        <div className="navigator__hint">
          Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh dấu
          review
        </div>
      </div>

      <div className="navigator__parts">
        {partsSummary.map((part) => (
          <div key={part.part} className="navigator__part">
            <div className="navigator__part-title">Part {part.part}</div>
            <div className="navigator__grid">
              {part.questionIds.map((qid, index) => {
                const answer = answers[qid];
                // ✅ Check nhiều loại answer: recording/essay/notes/selected_choice_id
                let answered = false;
                if (answer) {
                  if (typeof answer === "object") {
                    // Speaking/Writing: check recording, essay, hoặc notes có nội dung
                    answered = !!(
                      answer.recording ||
                      (answer.essay && answer.essay.trim()) ||
                      (answer.notes && answer.notes.trim()) ||
                      answer.selected_choice_id
                    );
                  } else {
                    // Listening/Reading: primitive value (choice ID)
                    answered = true;
                  }
                }
                return (
                  <button
                    key={qid}
                    className={`navigator__item ${
                      answered ? "navigator__item--answered" : ""
                    }`}
                    onClick={() => onJump(qid)}
                    aria-label={`Question ${qid}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
