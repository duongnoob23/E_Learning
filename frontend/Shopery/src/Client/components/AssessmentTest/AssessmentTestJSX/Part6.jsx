/* File: src/components/Part6.jsx */
import React, { useEffect, useState } from "react";
import { usePartQuestions } from "../../../services/Assessment/assessmentQueries";

export default function Part6({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = usePartQuestions(6, true);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 6 questions:", error);
    }
  }, [data, error, onDataLoaded]);

  if (loading || isLoading) {
    return (
      <section className="part part--6">
        <h3 className="part__title">Part 6</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi Part 6...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--6">
        <h3 className="part__title">Part 6</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi Part 6</p>
        </div>
      </section>
    );
  }

  // Group questions by passage (mỗi 4 câu là 1 passage)
  const passageGroups = [];
  for (let i = 0; i < questions.length; i += 4) {
    passageGroups.push(questions.slice(i, i + 4));
  }

  return (
    <section className="part part--6">
      <h3 className="part__title">Part 6</h3>
      <div className="part__list">
        {passageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="passage">
            <div className="passage__title">
              Text Completion {groupIndex + 1}
            </div>
            <div className="passage__text">
              {/* Hiển thị passage text nếu có */}
              <p>
                Read the following text and choose the best answer for each
                blank.
              </p>
            </div>
            {group.map((question) => (
              <div
                key={question.question_id}
                ref={(el) => registerRef(question.question_id, el)}
                className="question question--p6"
              >
                <div className="question__left">
                  <div className="question__num">
                    {question.question_number}
                  </div>
                </div>
                <div className="question__body">
                  <div className="question__prompt">
                    {question.question_text}
                  </div>

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
        ))}
      </div>
    </section>
  );
}

// import React from "react";

// export default function Part6({ passages, onAnswer, registerRef, answers }) {
//   return (
//     <section className="part part--6">
//       <h3 className="part__title">Part 6</h3>
//       <div className="part__list">
//         {passages.map((p) => (
//           <div key={p.passageId} className="passage">
//             <div className="passage__title">{p.title}</div>
//             <div className="passage__text">{p.text}</div>
//             {p.questions.map((q) => (
//               <div
//                 key={q.id}
//                 ref={(el) => registerRef(q.id, el)}
//                 className="question question--p6"
//               >
//                 <div className="question__left">
//                   <div className="question__num">{q.id}</div>
//                 </div>
//                 <div className="question__body">
//                   <div className="question__prompt">{q.prompt}</div>
//                   <div className="question__options">
//                     {q.options.map((opt, idx) => (
//                       <label key={idx} className="option">
//                         <input
//                           type="radio"
//                           name={`q-${q.id}`}
//                           checked={answers[q.id] === idx}
//                           onChange={() => onAnswer(q.id, idx)}
//                         />
//                         <span className="option__label">{opt}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
