import React from "react";

export default function Part4({ groups, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--4">
      <h3 className="part__title">Part 4</h3>
      <div className="part__list">
        {groups.map((g, gi) => (
          <div key={g.groupId} className="talk">
            <div className="talk__header">Talk {gi + 1} — (audio)</div>
            <div className="talk__script">{g.script}</div>
            {g.questions.map((q) => (
              <div
                key={q.id}
                ref={(el) => registerRef(q.id, el)}
                className="question question--talk"
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
