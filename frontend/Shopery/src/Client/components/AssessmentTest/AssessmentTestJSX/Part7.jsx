/* File: src/components/Part7.jsx */
import React, { useEffect, useState, useMemo } from "react";
import { usePartQuestions } from "../../../services/Assessment/assessmentQueries";

export default function Part7({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
}) {
  const [questions, setQuestions] = useState([]);
  const partId = useMemo(() => {
    return partData.find((item, index) => +item.part_number == 7);
  }, [partData]);
  const { data, isLoading, error } = usePartQuestions(partId.part_id, true);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      onDataLoaded(data.DT);
    }
  }, [data, onDataLoaded]);

  const groupedPassages = useMemo(() => {
    // Gom nhóm theo transcript (vì cùng đoạn đọc)
    const map = new Map();
    for (const q of questions) {
      if (!map.has(q.transcript)) map.set(q.transcript, []);
      map.get(q.transcript).push(q);
    }
    return Array.from(map.entries());
  }, [questions]);

  if (isLoading) {
    return (
      <section className="part part--7">
        <h3 className="part__title">Part 7</h3>
        <p>Đang tải câu hỏi Part 7...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--7">
        <h3 className="part__title">Part 7</h3>
        <p className="error">Lỗi khi tải dữ liệu.</p>
      </section>
    );
  }

  return (
    <section className="part part--7" style={{ padding: "16px 0" }}>
      <h3 className="part__title" style={{ fontSize: "20px", fontWeight: 600 }}>
        Part 7 — Reading Comprehension
      </h3>

      {groupedPassages.map(([transcript, group], index) => (
        <div key={index} className="passage" style={{ marginTop: "32px" }}>
          {/* Passage Box */}
          <div
            className="passage__content"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            <div
              className="passage__title"
              style={{ fontWeight: 600, marginBottom: "12px" }}
            >
              Đoạn {index + 1}
            </div>
            <p style={{ color: "#333", whiteSpace: "pre-line" }}>
              {transcript}
            </p>
          </div>

          {/* Questions */}
          <div
            className="passage__questions"
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {group.map((question) => (
              <div
                key={question.question_id}
                ref={(el) => registerRef(question.question_id, el)}
                className="question question--p7"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  background: "white",
                  flexDirection: "column",
                  display: "flex",
                }}
              >
                <div
                  className="question__text"
                  style={{
                    fontWeight: 500,
                    fontSize: "15px",
                    marginBottom: "10px",
                    color: "#111827",
                  }}
                >
                  {question.question_number}. {question.question_text}
                </div>

                <div
                  className="question__choices"
                  style={{ display: "grid", gap: "6px" }}
                >
                  {question.choices.map((choice) => (
                    <label
                      key={choice.choice_id}
                      className="choice"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        cursor: "pointer",
                        lineHeight: 1.4,
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
                        style={{ marginTop: "3px" }}
                      />
                      <span>
                        <strong>{choice.choice_letter}.</strong>{" "}
                        {choice.choice_text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
