// VocabularySentenceCompletionCreator.jsx - Form tạo lesson vocabulary_sentence_completion
import React, { useState } from "react";
import "./CreatorForm.css";

export default function VocabularySentenceCompletionCreator({
  onDataChange,
}) {
  const [questions, setQuestions] = useState([
    {
      question_id: 1,
      vi_text: "",
      sentence_template: "",
      shuffled_words: [{ word_id: 1, text: "" }],
      blanks: [{ blank_id: "blank1", correct_word_id: 1 }],
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: Date.now(),
        vi_text: "",
        sentence_template: "",
        shuffled_words: [{ word_id: Date.now(), text: "" }],
        blanks: [{ blank_id: "blank1", correct_word_id: Date.now() }],
      },
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.question_id !== questionId));
  };

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId ? { ...q, [field]: value } : q
      )
    );
  };

  const handleAddWord = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              shuffled_words: [
                ...q.shuffled_words,
                { word_id: Date.now(), text: "" },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveWord = (questionId, wordId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              shuffled_words: q.shuffled_words.filter(
                (w) => w.word_id !== wordId
              ),
            }
          : q
      )
    );
  };

  const handleWordChange = (questionId, wordId, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              shuffled_words: q.shuffled_words.map((w) =>
                w.word_id === wordId ? { ...w, text: value } : w
              ),
            }
          : q
      )
    );
  };

  const handleAddBlank = (questionId) => {
    const blankId = `blank${Date.now()}`;
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              blanks: [
                ...q.blanks,
                { blank_id: blankId, correct_word_id: q.shuffled_words[0]?.word_id || 1 },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveBlank = (questionId, blankId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              blanks: q.blanks.filter((b) => b.blank_id !== blankId),
            }
          : q
      )
    );
  };

  const handleBlankChange = (questionId, blankId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              blanks: q.blanks.map((b) =>
                b.blank_id === blankId ? { ...b, [field]: value } : b
              ),
            }
          : q
      )
    );
  };

  // Gửi dữ liệu lên parent khi có thay đổi
  React.useEffect(() => {
    onDataChange?.({
      type: "vocabulary_sentence_completion",
      questions: questions,
    });
  }, [questions, onDataChange]);

  return (
    <div className="creator-form">
      <h4 className="creator-form-title">Tạo Lesson: Hoàn thiện câu</h4>

      <div className="creator-form-group">
        <div className="creator-form-group-header">
          <label className="creator-form-label">Danh sách câu hỏi *</label>
          <button
            type="button"
            className="creator-form-add-btn"
            onClick={handleAddQuestion}
          >
            + Thêm câu hỏi
          </button>
        </div>

        {questions.map((question, qIndex) => (
          <div key={question.question_id} className="creator-form-item-card">
            <div className="creator-form-item-header">
              <span className="creator-form-item-number">
                Câu hỏi {qIndex + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="creator-form-remove-btn"
                  onClick={() => handleRemoveQuestion(question.question_id)}
                >
                  × Xóa
                </button>
              )}
            </div>

            <div className="creator-form-grid">
              <div className="creator-form-field creator-form-field-full">
                <label>Câu tiếng Việt *</label>
                <input
                  type="text"
                  value={question.vi_text}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "vi_text",
                      e.target.value
                    )
                  }
                  placeholder="Tôi vui mừng vì hôm nay trời nắng"
                />
              </div>

              <div className="creator-form-field creator-form-field-full">
                <label>Sentence Template *</label>
                <input
                  type="text"
                  value={question.sentence_template}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "sentence_template",
                      e.target.value
                    )
                  }
                  placeholder='I am {blank1} because today is {blank2}'
                />
                <small style={{ color: "#6b7280", marginTop: "4px", display: "block" }}>
                  Sử dụng {"{blank1}"}, {"{blank2}"}, ... để đánh dấu vị trí trống
                </small>
              </div>
            </div>

            {/* Words */}
            <div className="creator-form-group" style={{ marginTop: "16px" }}>
              <div className="creator-form-group-header">
                <label className="creator-form-label">Danh sách từ *</label>
                <button
                  type="button"
                  className="creator-form-add-btn"
                  onClick={() => handleAddWord(question.question_id)}
                >
                  + Thêm từ
                </button>
              </div>

              {question.shuffled_words.map((word, wIndex) => (
                <div
                  key={word.word_id}
                  className="creator-form-item-card"
                  style={{ background: "#fff", marginTop: "12px" }}
                >
                  <div className="creator-form-item-header">
                    <span className="creator-form-item-number">
                      Từ {wIndex + 1}
                    </span>
                    {question.shuffled_words.length > 1 && (
                      <button
                        type="button"
                        className="creator-form-remove-btn"
                        onClick={() =>
                          handleRemoveWord(question.question_id, word.word_id)
                        }
                      >
                        × Xóa
                      </button>
                    )}
                  </div>
                  <div className="creator-form-field">
                    <label>Text</label>
                    <input
                      type="text"
                      value={word.text}
                      onChange={(e) =>
                        handleWordChange(
                          question.question_id,
                          word.word_id,
                          e.target.value
                        )
                      }
                      placeholder="happy"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Blanks */}
            <div className="creator-form-group" style={{ marginTop: "16px" }}>
              <div className="creator-form-group-header">
                <label className="creator-form-label">Các ô trống *</label>
                <button
                  type="button"
                  className="creator-form-add-btn"
                  onClick={() => handleAddBlank(question.question_id)}
                >
                  + Thêm ô trống
                </button>
              </div>

              {question.blanks.map((blank, bIndex) => (
                <div
                  key={blank.blank_id}
                  className="creator-form-item-card"
                  style={{ background: "#fff", marginTop: "12px" }}
                >
                  <div className="creator-form-item-header">
                    <span className="creator-form-item-number">
                      Ô trống {bIndex + 1}
                    </span>
                    {question.blanks.length > 1 && (
                      <button
                        type="button"
                        className="creator-form-remove-btn"
                        onClick={() =>
                          handleRemoveBlank(question.question_id, blank.blank_id)
                        }
                      >
                        × Xóa
                      </button>
                    )}
                  </div>
                  <div className="creator-form-grid">
                    <div className="creator-form-field">
                      <label>Blank ID</label>
                      <input
                        type="text"
                        value={blank.blank_id}
                        onChange={(e) =>
                          handleBlankChange(
                            question.question_id,
                            blank.blank_id,
                            "blank_id",
                            e.target.value
                          )
                        }
                        placeholder="blank1"
                      />
                    </div>
                    <div className="creator-form-field">
                      <label>Correct Word ID</label>
                      <select
                        value={blank.correct_word_id}
                        onChange={(e) =>
                          handleBlankChange(
                            question.question_id,
                            blank.blank_id,
                            "correct_word_id",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {question.shuffled_words.map((word) => (
                          <option key={word.word_id} value={word.word_id}>
                            {word.text || `Word ${word.word_id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

