// src/Admin/features/courses/components/QuestionsTab.jsx
import React, { useEffect, useState } from "react";

export default function QuestionsTab({ part, onChangePart }) {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // reset khi đổi part
    setExpandedId(null);
    if (part && part.questions.length === 0) {
      onChangePart({ ...part, questions: [makeEmptyQuestion(part, 1)] });
      setExpandedId((prev) => prev || "q-1");
    }
    // eslint-disable-next-line
  }, [part?.key]);

  if (!part) return null;

  function addQuestion() {
    if (part.questions.length >= part.expectedMax) return;
    const nextOrder = part.questions.length + 1;
    const q = makeEmptyQuestion(part, nextOrder);
    onChangePart({ ...part, questions: [...part.questions, q] });
    setExpandedId(q.id); // chỉ mở 1 câu
    // setTimeout(
    //   () =>
    //     document
    //       .getElementById(q.id)
    //       ?.scrollIntoView({ behavior: "smooth", block: "center" }),
    //   0
    // );
  }

  function update(qid, patch) {
    onChangePart({
      ...part,
      questions: part.questions.map((q) =>
        q.id === qid ? { ...q, ...patch } : q
      ),
    });
  }

  function setChoiceText(q, key, text) {
    update(q.id, {
      choices: q.choices.map((c) => (c.key === key ? { ...c, text } : c)),
    });
  }

  function remove(qid) {
    const arr = part.questions
      .filter((q) => q.id !== qid)
      .map((q, i) => ({ ...q, order: i + 1 }));
    onChangePart({ ...part, questions: arr });
    if (expandedId === qid) setExpandedId(arr[0]?.id || null);
  }

  const atMax = part.questions.length >= part.expectedMax;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{part.title}</div>
          <div style={{ color: "#9ca3af", fontSize: 12 }}>
            {part.questions.length} / {part.expectedMax}
          </div>
        </div>
        <button
          className="btn btn--primary"
          disabled={atMax}
          onClick={addQuestion}
        >
          Add Question
        </button>
      </div>

      {part.questions.map((q, idx) => {
        const open = expandedId === q.id;
        return (
          <div key={q.id} id={q.id} className="q-item">
            <div
              className="q-head"
              onClick={() => setExpandedId(open ? null : q.id)}
            >
              <div>
                Question {idx + 1}
                {q.title ? ` — ${q.title}` : ""}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => remove(q.id)}>
                  Delete
                </button>
              </div>
              <div>{open ? "▲" : "▼"}</div>
            </div>
            {open && (
              <div className="q-body">
                <div className="field">
                  <label>Question Title (optional)</label>
                  <input
                    value={q.title}
                    onChange={(e) => update(q.id, { title: e.target.value })}
                  />
                </div>

                {/* Media theo Part (đơn giản) */}
                {part.requires?.image && (
                  <div className="field">
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        update(q.id, {
                          media: {
                            ...q.media,
                            image: e.target.files?.[0] || null,
                          },
                        })
                      }
                    />
                  </div>
                )}
                {part.requires?.audio && (
                  <div className="field">
                    <label>Audio</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        update(q.id, {
                          media: {
                            ...q.media,
                            audio: e.target.files?.[0] || null,
                          },
                        })
                      }
                    />
                  </div>
                )}
                {(part.type === "reading" || part.requires?.passage) && (
                  <div className="field">
                    <label>Passage (text)</label>
                    <textarea
                      rows={3}
                      value={q.media.passage}
                      onChange={(e) =>
                        update(q.id, {
                          media: { ...q.media, passage: e.target.value },
                        })
                      }
                    />
                  </div>
                )}

                <div className="field">
                  <label>Question Text</label>
                  <textarea
                    rows={2}
                    value={q.text}
                    onChange={(e) => update(q.id, { text: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Transcript (optional)</label>
                  <textarea
                    rows={2}
                    value={q.transcript}
                    onChange={(e) =>
                      update(q.id, { transcript: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label>Choices</label>
                  {q.choices.map((c) => (
                    <div key={c.key} className="choice-row">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctKey === c.key}
                        onChange={() => update(q.id, { correctKey: c.key })}
                      />
                      <input
                        value={c.text}
                        placeholder={`Option ${c.key}`}
                        onChange={(e) =>
                          setChoiceText(q, c.key, e.target.value)
                        }
                      />
                      <div style={{ color: "#9ca3af", fontSize: 12 }}>
                        Correct?
                      </div>
                    </div>
                  ))}
                </div>

                <div className="field">
                  <label>Explanation (optional)</label>
                  <textarea
                    rows={2}
                    value={q.explanation}
                    onChange={(e) =>
                      update(q.id, { explanation: e.target.value })
                    }
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => remove(q.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function makeEmptyQuestion(part, order) {
  const choices = Array.from({ length: part.choiceCount || 4 }, (_, i) => ({
    key: String.fromCharCode(65 + i),
    text: "",
  }));
  return {
    id: `q-${order}-${Math.random().toString(36).slice(2, 7)}`,
    order,
    title: "",
    text: "",
    transcript: "",
    explanation: "",
    correctKey: "",
    choices,
    media: { image: null, audio: null, passage: "" },
  };
}
