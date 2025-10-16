/* File: src/components/Part5.jsx */
import React, { useEffect, useState } from "react";
import { usePartQuestions } from "../../../services/Assessment/assessmentQueries";

export default function Part5({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = usePartQuestions(5, true);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 5 questions:", error);
    }
  }, [data, error, onDataLoaded]);

  if (loading || isLoading) {
    return (
      <section className="part part--5">
        <h3 className="part__title">Part 5</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi Part 5...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--5">
        <h3 className="part__title">Part 5</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi Part 5</p>
        </div>
      </section>
    );
  }

  return (
    <section className="part part--5">
      <h3 className="part__title">Part 5</h3>
      <div className="part__list">
        {questions.map((question) => (
          <div
            key={question.question_id}
            ref={(el) => registerRef(question.question_id, el)}
            className="question question--incomplete"
          >
            <div className="question__left">
              <div className="question__num">{question.question_number}</div>
            </div>
            <div className="question__body">
              <div className="question__prompt">{question.question_text}</div>

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

// export default function Part5({ items, onAnswer, registerRef, answers }) {
//   return (
//     <section className="part part--5">
//       <h3 className="part__title">Part 5</h3>
//       <div className="part__list">
//         {items.map((q) => (
//           <div
//             key={q.id}
//             ref={(el) => registerRef(q.id, el)}
//             className="question question--incomplete"
//           >
//             <div className="question__left">
//               <div className="question__num">{q.id}</div>
//             </div>
//             <div className="question__body">
//               <div className="question__prompt">{q.prompt}</div>
//               <div className="question__options">
//                 {q.options.map((opt, idx) => (
//                   <label key={idx} className="option">
//                     <input
//                       type="radio"
//                       name={`q-${q.id}`}
//                       checked={answers[q.id] === idx}
//                       onChange={() => onAnswer(q.id, idx)}
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
