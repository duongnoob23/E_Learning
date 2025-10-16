/* File: src/components/Part2.jsx */
import React, { useEffect, useState } from "react";
import { usePartQuestions } from "../../../services/Assessment/assessmentQueries";

export default function Part2({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API riêng cho Part 2
  const { data, isLoading, error } = usePartQuestions(2, true);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 2 questions:", error);
    }
  }, [data, error, onDataLoaded]);

  if (loading || isLoading) {
    return (
      <section className="part part--2">
        <h3 className="part__title">Part 2</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi Part 2...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--2">
        <h3 className="part__title">Part 2</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi Part 2</p>
        </div>
      </section>
    );
  }

  return (
    <section className="part part--2">
      <h3 className="part__title">Part 2</h3>
      <div className="part__list">
        {questions.map((question) => (
          <div
            key={question.question_id}
            ref={(el) => registerRef(question.question_id, el)}
            className="question question--qresp"
          >
            <div className="question__left">
              <div className="question__num">{question.question_number}</div>
            </div>
            <div className="question__body">
              <div className="question__prompt">{question.question_text}</div>

              {/* Hiển thị audio nếu có */}
              {question.audio_file && (
                <div className="question__audio">
                  🔊 <audio controls src={question.audio_file} />
                </div>
              )}

              <div className="question__options">
                {question.choices.map((choice) => (
                  <label key={choice.choice_id} className="option">
                    <input
                      type="radio"
                      name={`q-${question.question_id}`}
                      checked={
                        answers[question.question_id] === choice.choice_id
                      }
                      onChange={() =>
                        onAnswer(question.question_id, choice.choice_id)
                      }
                    />
                    <span className="option__label">
                      {choice.choice_letter}. {choice.choice_text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// import React from "react";

// export default function Part2({ items, onAnswer, registerRef, answers }) {
//   return (
//     <section className="part part--2">
//       <h3 className="part__title">Part 2</h3>
//       <div className="part__list">
//         {items.map((it) => (
//           <div
//             key={it.id}
//             ref={(el) => registerRef(it.id, el)}
//             className="question question--qresp"
//           >
//             <div className="question__left">
//               <div className="question__num">{it.id}</div>
//             </div>
//             <div className="question__body">
//               <div className="question__audio">🔊 {it.prompt} (audio)</div>
//               <div className="question__options">
//                 {it.options.map((opt, idx) => (
//                   <label key={idx} className="option">
//                     <input
//                       type="radio"
//                       name={`q-${it.id}`}
//                       checked={answers[it.id] === idx}
//                       onChange={() => onAnswer(it.id, idx)}
//                     />
//                     <span className="option__label">{opt}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
