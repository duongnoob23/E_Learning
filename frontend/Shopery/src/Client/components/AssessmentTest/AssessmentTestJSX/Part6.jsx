/* File: src/components/Part6.jsx */
import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../services/Assessment/assessmentQueries";

export default function Part6({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const partId = useMemo(() => {
    return partData.find((item, index) => +item.part_number == 6);
  }, [partData]);
  const { data, isLoading, error } = usePartQuestions(partId.part_id, true);

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

  console.log("DATA PART 6", data);

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
          <div
            key={groupIndex}
            className="passage"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: "32px",
              gap: "24px",
            }}
          >
            {/* Bên trái: hình ảnh */}
            <div
              className="passage__image"
              style={{
                flex: "0 0 40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f9f9f9",
              }}
            >
              {/* <img
                src={
                  group[0]?.image_file && group[0]?.image_file.trim() !== ""
                    ? group[0].image_file
                    : "https://s4-media1.study4.com/media/gg_imgs/test/fd3ac8e07e2891fd958c44c5e24b3b87ab250aed.jpg"
                }
                alt="passage visual"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "cover",
                }}
              /> */}
            </div>

            {/* Bên phải: 4 câu hỏi */}
            <div
              className="passage__questions"
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                className="passage__title"
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Text Completion {groupIndex + 1}
              </div>

              {group.map((question, index) => (
                <div
                  key={question.question_id}
                  ref={(el) => registerRef(question.question_id, el)}
                  className="question question--p6"
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    padding: "12px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="question__prompt"
                    style={{
                      marginBottom: "8px",
                      fontSize: "15px",
                      color: "#333",
                    }}
                  >
                    <strong>{question.question_number}.</strong>{" "}
                    {question.question_text}
                  </div>

                  <div
                    className="question__options"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {question.choices.map((choice) => (
                      <label
                        key={choice.choice_id}
                        className="option"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        <input
                          type="radio"
                          name={`q-${question.question_id}`}
                          checked={
                            answers[question.question_id] === choice.choice_id
                          }
                          onChange={() =>
                            onAnswer(question.question_id, choice.choice_id)
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <span>
                          {choice.choice_letter}. {choice.choice_text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// {passageGroups.map((group, groupIndex) => (
//   <div key={groupIndex} className="passage">
//     <div className="passage__title">
//       Text Completion {groupIndex + 1}
//     </div>
//     <div className="passage__text">
//       {/* Hiển thị passage text nếu có */}
//       <p>
//         Read the following text and choose the best answer for each
//         blank.
//       </p>
//     </div>
//     {group.map((question) => (
//       <div
//         key={question.question_id}
//         ref={(el) => registerRef(question.question_id, el)}
//         className="question question--p6"
//       >
//         <div className="question__left">
//           <div className="question__num">
//             {question.question_number}
//           </div>
//         </div>
//         <div className="question__body">
//           <div className="question__prompt">
//             {question.question_text}
//           </div>

//           <div className="question__options">
//             {question.choices.map((choice) => (
//               <label key={choice.choice_id} className="option">
//                 <input
//                   type="radio"
//                   name={`q-${question.question_id}`}
//                   checked={
//                     answers[question.question_id] === choice.choice_id
//                   }
//                   onChange={() =>
//                     onAnswer(question.question_id, choice.choice_id)
//                   }
//                 />
//                 <span className="option__label">
//                   {choice.choice_letter}. {choice.choice_text}
//                 </span>
//               </label>
//             ))}
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// ))}
