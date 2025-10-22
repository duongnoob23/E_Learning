/* File: src/components/Part3.jsx */
import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../services/Assessment/assessmentQueries";

export default function Part3({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const partId = useMemo(() => {
    return partData.find((item, index) => item.part_number == 3);
  }, [partData]);
  const { data, isLoading, error } = usePartQuestions(partId.part_id, true);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setQuestions(data.DT);
      setLoading(false);
      onDataLoaded(data.DT);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 3 questions:", error);
    }
  }, [data, error, onDataLoaded]);

  if (loading || isLoading) {
    return (
      <section className="part part--3">
        <h3 className="part__title">Part 3</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi Part 3...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--3">
        <h3 className="part__title">Part 3</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi Part 3</p>
        </div>
      </section>
    );
  }

  // Group questions by conversation (mỗi 3 câu là 1 conversation)
  const conversationGroups = [];
  for (let i = 0; i < questions.length; i += 3) {
    conversationGroups.push(questions.slice(i, i + 3));
  }

  return (
    <section className="part part--3">
      <h3 className="part__title">Part 3</h3>
      <div className="part__list">
        {conversationGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="conversation">
            {/* <div className="conversation__header">
              Conversation {groupIndex + 1} — (audio)
            </div>
            <div className="conversation__script">
              {group[0]?.transcript && <p>{group[0].transcript}</p>}
            </div> */}
            {group.map((question) => (
              <div
                key={question.question_id}
                ref={(el) => registerRef(question.question_id, el)}
                className="question question--conv"
              >
                <div className="question__left">
                  <div className="question__num">
                    {question.question_number}
                  </div>
                </div>
                <div className="question__body">
                  {question.audio_file && (
                    <div className="question__audio">
                      🔊 <audio controls src={question.audio_file} />
                    </div>
                  )}
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
