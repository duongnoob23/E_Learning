import React from "react";

export default function Part2({ items, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--2">
      <h3 className="part__title">Part 2</h3>
      <div className="part__list">
        {items.map((it) => (
          <div
            key={it.id}
            ref={(el) => registerRef(it.id, el)}
            className="question question--qresp"
          >
            <div className="question__left">
              <div className="question__num">{it.id}</div>
            </div>
            <div className="question__body">
              <div className="question__audio">🔊 {it.prompt} (audio)</div>
              <div className="question__options">
                {it.options.map((opt, idx) => (
                  <label key={idx} className="option">
                    <input
                      type="radio"
                      name={`q-${it.id}`}
                      checked={answers[it.id] === idx}
                      onChange={() => onAnswer(it.id, idx)}
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
