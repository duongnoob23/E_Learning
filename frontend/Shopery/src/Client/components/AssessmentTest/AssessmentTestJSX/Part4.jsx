/* File: src/components/Part4.jsx */
import React, { useEffect, useState } from "react";
import { usePartQuestions } from "../../../services/Assessment/assessmentQueries";

export default function Part4({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = usePartQuestions(4, true);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 4 questions:", error);
    }
  }, [data, error, onDataLoaded]);

  if (loading || isLoading) {
    return (
      <section className="part part--4">
        <h3 className="part__title">Part 4</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi Part 4...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--4">
        <h3 className="part__title">Part 4</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi Part 4</p>
        </div>
      </section>
    );
  }

  // Group questions by talk (mỗi 3 câu là 1 talk)
  const talkGroups = [];
  for (let i = 0; i < questions.length; i += 3) {
    talkGroups.push(questions.slice(i, i + 3));
  }

  return (
    <section className="part part--4">
      <h3 className="part__title">Part 4</h3>
      <div className="part__list">
        {talkGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="talk">
            <div className="talk__header">Talk {groupIndex + 1} — (audio)</div>
            <div className="talk__script">
              {/* Hiển thị transcript nếu có */}
              {group[0]?.transcript && <p>{group[0].transcript}</p>}
            </div>
            {group.map((question) => (
              <div
                key={question.question_id}
                ref={(el) => registerRef(question.question_id, el)}
                className="question question--talk"
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
        ))}
      </div>
    </section>
  );
}

// import React from "react";

// export default function Part4({ groups, onAnswer, registerRef, answers }) {
//   return (
//     <section className="part part--4">
//       <h3 className="part__title">Part 4</h3>
//       <div className="part__list">
//         {groups.map((g, gi) => (
//           <div key={g.groupId} className="talk">
//             <div className="talk__header">Talk {gi + 1} — (audio)</div>
//             <div className="talk__script">{g.script}</div>
//             {g.questions.map((q) => (
//               <div
//                 key={q.id}
//                 ref={(el) => registerRef(q.id, el)}
//                 className="question question--talk"
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
