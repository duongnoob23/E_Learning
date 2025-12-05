/* File: src/components/TOEIC/Reading/Part6.jsx */
import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";

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
  const { data, isLoading, error } = usePartQuestions(partId?.part_id, !!partId);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 6 questions:", error);
    }
    // ✅ Loại bỏ onDataLoaded khỏi dependency để tránh vòng lặp vô hạn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

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

