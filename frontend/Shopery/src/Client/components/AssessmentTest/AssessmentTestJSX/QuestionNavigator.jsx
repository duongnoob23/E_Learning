/* File: src/components/QuestionNavigator.jsx */
import React, { useEffect, useState } from "react";

export default function QuestionNavigator({
  partsSummary,
  answers,
  onJump,
  onSubmit,
  isSubmitting,
  onNavigate,
}) {
  // ✅ BẮT ĐẦU: thêm state cho đồng hồ đếm ngược
  // const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 phút = 7200 giây
  // console.log("PART", partsSummary);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   // cleanup
  //   return () => clearInterval(timer);
  // }, []);

  // ✅ Format hiển thị (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // // ✅ Nếu muốn, có thể tự động nộp bài khi hết giờ:
  // useEffect(() => {
  //   if (timeLeft === 0) {
  //     alert("Hết thời gian làm bài. Bài sẽ được tự động nộp.");
  //     onSubmit();
  //   }
  // }, [timeLeft, onSubmit]);
  // // ✅ HẾT PHẦN ĐỒNG HỒ

  return (
    <aside className="navigator">
      <div className="navigator__top">
        <div className="navigator__timer">
          Thời gian còn lại:
          {/* <div className="navigator__time">{formatTime(timeLeft)}</div> */}
          <div className="navigator__time">0:00</div>
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
                const answered = answers[qid];
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
