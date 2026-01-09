/* File: src/components/TOEIC/Listening/Part1.jsx */
import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";

export default function Part1({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const partId = useMemo(() => {
    return partData.find((item, index) => +item.part_number == 1);
  }, [partData]);

  // Gọi API riêng cho Part 1
  const { data, isLoading, error } = usePartQuestions(
    partId?.part_id,
    !!partId
  );

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT); // Gửi dữ liệu về parent
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 1 questions:", error);
    }
    // ✅ Loại bỏ onDataLoaded khỏi dependency để tránh vòng lặp vô hạn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  if (loading || isLoading) {
    return (
      <section className="part part--1">
        <h3 className="part__title">Part 1</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi Part 1...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--1">
        <h3 className="part__title">Part 1</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi Part 1</p>
        </div>
      </section>
    );
  }

  return (
    <section className="part part--1">
      <h3 className="part__title">Part 1</h3>
      <div className="part__list">
        {questions.map((question) => (
          <div
            key={question.question_id}
            ref={(el) => registerRef(question.question_id, el)}
            className="question question--photo"
          >
            <div className="question__left">
              <div className="question__num">{question.question_number}</div>
            </div>
            <div className="question__body">
              {/* Hiển thị audio nếu có */}
              {question.audio_file && (
                <div className="question__audio">
                  <audio controls src={question.audio_file} />
                </div>
              )}

              {question.image_file && (
                <img
                  style={{
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                  src={
                    question.image_file ||
                    `https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW1hZ2UlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600`
                  }
                  alt={`photo ${question.question_number}`}
                  className="question__image"
                />
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
                      {choice.choice_letter}.
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
