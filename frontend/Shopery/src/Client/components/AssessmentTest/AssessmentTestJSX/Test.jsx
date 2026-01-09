/* File: src/data/mockData.js */
// Mock TOEIC test data generator (200 questions) - structured by Part


/* File: src/components/TestHeader.jsx */
import React from 'react';

export default function TestHeader({ title, onExit }) {
  return (
    <div className="toeic-header">
      <div className="toeic-header__title">{title}</div>
      <div className="toeic-header__actions">
        <button className="toeic-header__exit" onClick={onExit}>Thoát</button>
      </div>
    </div>
  );
}

/* File: src/components/QuestionNavigator.jsx */
import React from 'react';

export default function QuestionNavigator({ partsSummary, answers, onJump }) {
  return (
    <aside className="navigator">
      <div className="navigator__top">
        <div className="navigator__timer">Thời gian còn lại:<div className="navigator__time">119:41</div></div>
        <button className="navigator__submit">NỘP BÀI</button>
      </div>

      <div className="navigator__note">
        <div className="navigator__restore">Khôi phục/lưu bài làm</div>
        <div className="navigator__hint">Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh dấu review</div>
      </div>

      <div className="navigator__parts">
        {partsSummary.map((part) => (
          <div key={part.part} className="navigator__part">
            <div className="navigator__part-title">Part {part.part}</div>
            <div className="navigator__grid">
              {part.questionIds.map((qid) => {
                const answered = answers[qid];
                return (
                  <button
                    key={qid}
                    className={`navigator__item ${answered ? 'navigator__item--answered' : ''}`}
                    onClick={() => onJump(qid)}
                    aria-label={`Question ${qid}`}
                  >
                    {qid}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* File: src/components/Part1.jsx */
import React from 'react';

export default function Part1({ items, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--1">
      <h3 className="part__title">Part 1</h3>
      <div className="part__list">
        {items.map((it) => (
          <div key={it.id} ref={(el) => registerRef(it.id, el)} className="question question--photo">
            <div className="question__left">
              <div className="question__num">{it.id}</div>
            </div>
            <div className="question__body">
              <div className="question__prompt">{it.prompt}</div>
              <img src={it.image} alt={`photo ${it.id}`} className="question__image" />
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

/* File: src/components/Part2.jsx */
import React from 'react';

export default function Part2({ items, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--2">
      <h3 className="part__title">Part 2</h3>
      <div className="part__list">
        {items.map((it) => (
          <div key={it.id} ref={(el) => registerRef(it.id, el)} className="question question--qresp">
            <div className="question__left">
              <div className="question__num">{it.id}</div>
            </div>
            <div className="question__body">
              <div className="question__audio"> {it.prompt} (audio)</div>
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

/* File: src/components/Part3.jsx */
import React from 'react';

export default function Part3({ groups, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--3">
      <h3 className="part__title">Part 3</h3>
      <div className="part__list">
        {groups.map((g, gi) => (
          <div key={g.groupId} className="conversation">
            <div className="conversation__header">Conversation {gi + 1} — (audio)</div>
            <div className="conversation__script">{g.script}</div>
            {g.questions.map((q) => (
              <div key={q.id} ref={(el) => registerRef(q.id, el)} className="question question--conv">
                <div className="question__left"><div className="question__num">{q.id}</div></div>
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

/* File: src/components/Part4.jsx */
import React from 'react';

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
              <div key={q.id} ref={(el) => registerRef(q.id, el)} className="question question--talk">
                <div className="question__left"><div className="question__num">{q.id}</div></div>
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

/* File: src/components/Part5.jsx */


/* File: src/components/Part6.jsx */
import React from 'react';

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
              <div key={q.id} ref={(el) => registerRef(q.id, el)} className="question question--p6">
                <div className="question__left"><div className="question__num">{q.id}</div></div>
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

/* File: src/components/Part7.jsx */
import React from 'react';

export default function Part7({ passages, onAnswer, registerRef, answers }) {
  return (
    <section className="part part--7">
      <h3 className="part__title">Part 7</h3>
      <div className="part__list">
        {passages.map((p) => (
          <div key={p.passageId} className="passage">
            <div className="passage__title">{p.title}</div>
            <div className="passage__text">{p.text}</div>
            {p.questions.map((q) => (
              <div key={q.id} ref={(el) => registerRef(q.id, el)} className="question question--p7">
                <div className="question__left"><div className="question__num">{q.id}</div></div>
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

