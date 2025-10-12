import React from "react";

export default function Part6({ passages, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--6">
      <h3 className="part__title">Part 6</h3>
      <div className="part__list">
        {passages.map((p) => (
          <div key={p.passageId} className="passage">
            <div className="passage__title">{p.title}</div>
            <div className="passage__text">{p.text}</div>
            {p.questions.map((q) => (
              <div
                key={q.id}
                ref={(el) => registerRef(q.id, el)}
                className="question question--p6"
              >
                <div className="question__left">
                  <div className="question__num">{q.id}</div>
                </div>
                <div className="question__body">
                  <div className="question__prompt">{q.prompt}</div>
                  <div className="question__options">
                    {q.options.map((opt, idx) => (
                      <label key={idx} className="option">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={answers[q.id] === idx}
                          onChange={() => onAnswer(q.id, idx)}
                        />
                        <span className="option__label">{opt}</span>
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
