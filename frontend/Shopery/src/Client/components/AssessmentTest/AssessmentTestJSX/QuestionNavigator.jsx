/* File: src/components/QuestionNavigator.jsx */
import React from "react";

export default function QuestionNavigator({
  partsSummary,
  answers,
  onJump,
  onSubmit,
  isSubmitting,
  onNavigate,
}) {
  return (
    <aside className="navigator">
      <div className="navigator__top">
        <div className="navigator__timer">
          Thời gian còn lại:<div className="navigator__time">119:41</div>
        </div>
        <button
          className="navigator__submit"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang nộp..." : "NỘP BÀI"}
        </button>
        <button className="navigator__submit" onClick={onNavigate}>
          ĐÁP ÁN
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
              {part.questionIds.map((qid) => {
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
                    {qid}
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
// /* File: src/components/QuestionNavigator.jsx */
// import React from "react";

// export default function QuestionNavigator({ partsSummary, answers, onJump }) {
//   return (
//     <aside className="navigator">
//       <div className="navigator__top">
//         <div className="navigator__timer">
//           Thời gian còn lại:<div className="navigator__time">119:41</div>
//         </div>
//         <button className="navigator__submit">NỘP BÀI</button>
//       </div>

//       <div className="navigator__note">
//         <div className="navigator__restore">Khôi phục/lưu bài làm</div>
//         <div className="navigator__hint">
//           Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh dấu
//           review
//         </div>
//       </div>

//       <div className="navigator__parts">
//         {partsSummary.map((part) => (
//           <div key={part.part} className="navigator__part">
//             <div className="navigator__part-title">Part {part.part}</div>
//             <div className="navigator__grid">
//               {part.questionIds.map((qid) => {
//                 const answered = answers[qid];
//                 return (
//                   <button
//                     key={qid}
//                     className={`navigator__item ${
//                       answered ? "navigator__item--answered" : ""
//                     }`}
//                     onClick={() => onJump(qid)}
//                     aria-label={`Question ${qid}`}
//                   >
//                     {qid}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// }
