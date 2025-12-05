/* File: src/components/TOEIC/Reading/Part5.jsx */
import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";

export default function Part5({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const partId = useMemo(() => {
    return partData.find((item, index) => +item.part_number == 5);
  }, [partData]);
  const { data, isLoading, error } = usePartQuestions(partId?.part_id, !!partId);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 5 questions:", error);
    }
    // ✅ Loại bỏ onDataLoaded khỏi dependency để tránh vòng lặp vô hạn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

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

