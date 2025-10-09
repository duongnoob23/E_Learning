import React from "react";

export default function Part5({ items, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--5">
      <h3 className="part__title">Part 5</h3>
      <div className="part__list">
        {items.map((q) => (
          <div
            key={q.id}
            ref={(el) => registerRef(q.id, el)}
            className="question question--incomplete"
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
    </section>
  );
}
