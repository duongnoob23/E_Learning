import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";
import "./Part2.scss";

export default function Part2({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
  partNumber = 2,
}) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [essays, setEssays] = useState({});

  // ✅ FIX: Load essays/notes từ answers khi answers thay đổi
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      const loadedEssays = {};
      const loadedNotes = {};

      Object.keys(answers).forEach((qid) => {
        const answer = answers[qid];
        if (typeof answer === "object" && answer !== null) {
          if (answer.essay) loadedEssays[qid] = answer.essay;
          if (answer.notes) loadedNotes[qid] = answer.notes;
        }
      });

      if (Object.keys(loadedEssays).length > 0) {
        setEssays((prev) => {
          const hasChanges = Object.keys(loadedEssays).some(
            (qid) => prev[qid] !== loadedEssays[qid]
          );
          return hasChanges ? { ...prev, ...loadedEssays } : prev;
        });
      }

      if (Object.keys(loadedNotes).length > 0) {
        setNotes((prev) => {
          const hasChanges = Object.keys(loadedNotes).some(
            (qid) => prev[qid] !== loadedNotes[qid]
          );
          return hasChanges ? { ...prev, ...loadedNotes } : prev;
        });
      }
    }
  }, [answers]);

  const partId = useMemo(() => {
    if (!partData || !Array.isArray(partData)) return null;
    const part = partData.find((item) => item.part_number == partNumber);
    return part?.part_id || null;
  }, [partData, partNumber]);

  const { data, isLoading, error } = usePartQuestions(partId, !!partId);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setAllQuestions(data.DT);
      setLoading(false);

      // ✅ API getPartQuestions(partId) đã trả về đúng questions của part đó
      // KHÔNG CẦN filter lại vì backend đã filter theo partId rồi
      if (onDataLoaded && data.DT.length > 0) {
        onDataLoaded(partId || partNumber, data.DT);
      }
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 2 questions:", error);
    }
    // ✅ BỎ onDataLoaded khỏi deps để tránh infinite loop
  }, [data, error, partNumber, partId]);

  // ✅ API đã filter theo partId rồi, dùng trực tiếp
  const questions = allQuestions;

  const handleNotesChange = (questionId, notesText) => {
    setNotes((prev) => ({ ...prev, [questionId]: notesText }));
    if (onAnswer) {
      onAnswer(questionId, { notes: notesText });
    }
  };

  const handleEssayChange = (questionId, essayText) => {
    setEssays((prev) => ({ ...prev, [questionId]: essayText }));
    if (onAnswer) {
      onAnswer(questionId, { essay: essayText });
    }
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  if (loading || isLoading) {
    return (
      <section className="part part--writing part--writing-2">
        <h3 className="part__title">Part 2 - TOEIC Writing</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--writing part--writing-2">
        <h3 className="part__title">Part 2 - TOEIC Writing</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi</p>
        </div>
      </section>
    );
  }

  return (
    <section className="part part--writing part--writing-2">
      <h3 className="part__title">Part 2 - TOEIC Writing</h3>

      {/* ✅ Hiển thị TOÀN BỘ câu hỏi */}
      {questions.length > 0 && (
        <div className="part__questions-container">
          {questions.map((question) => (
            <div
              key={question.question_id}
              ref={(el) => {
                if (registerRef && el) {
                  registerRef(question.question_id, el);
                }
              }}
              className="part__content"
              style={{ marginBottom: "32px" }}
            >
              <div className="part__question">
                <QuestionContent question={question} />
              </div>

              <div className="part__answer">
                <NotesAndEssay
                  questionId={question.question_id}
                  questionNumber={question.question_number}
                  initialNotes={notes[question.question_id] || ""}
                  initialEssay={essays[question.question_id] || ""}
                  onNotesChange={handleNotesChange}
                  onEssayChange={handleEssayChange}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation buttons removed */}
    </section>
  );
}

function QuestionContent({ question }) {
  const { content, question_text, type, image_file } = question || {};

  if (type === "respond-email" || content?.email) {
    const email = content?.email || {};
    return (
      <div className="part__question-card">
        <h3 className="part__question-title">Respond to an email</h3>
        <div className="part__email-header">
          <div>
            <strong>From:</strong> {email.from || "update@dailyjobseeker.com"}
          </div>
          <div>
            <strong>To:</strong> {email.to || "Anna Billings"}
          </div>
          <div>
            <strong>Subject:</strong>{" "}
            {email.subject || "Daily Jobseeker update"}
          </div>
          <div>
            <strong>Sent:</strong> {email.sent || "March 14, 20-"}
          </div>
        </div>
        <div className="part__email-body">
          {email.body || content?.text || content?.body}
        </div>
        {content?.directions && (
          <div className="part__directions">
            <strong>Directions:</strong> {content.directions}
          </div>
        )}
      </div>
    );
  }

  // ✅ FIX: Check cả content.image_file và image_file ở root level
  const imageUrl = content?.image_file || image_file;
  if (type === "describe-picture" || imageUrl) {
    return (
      <div className="part__question-card">
        <h3 className="part__question-title">
          Write a sentence based on a picture
        </h3>
        {imageUrl && (
          <div className="part__image-container">
            <img
              src={imageUrl}
              alt="Question"
              className="part__image"
              onError={(e) => {
                console.error("❌ [Writing] Image load error:", imageUrl);
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
        {question_text && (
          <div className="part__question-text">{question_text}</div>
        )}
      </div>
    );
  }

  return (
    <div className="part__question-card">
      <h3 className="part__question-title">Write an essay</h3>
      {content?.text && (
        <div className="part__question-text">{content.text}</div>
      )}
      {question_text && (
        <div className="part__question-text">{question_text}</div>
      )}
    </div>
  );
}

function NotesAndEssay({
  questionId,
  questionNumber,
  initialNotes,
  initialEssay,
  onNotesChange,
  onEssayChange,
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [essay, setEssay] = useState(initialEssay);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    setEssay(initialEssay);
  }, [initialEssay]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    if (onNotesChange) {
      onNotesChange(questionId, newNotes);
    }
  };

  const handleEssayChange = (e) => {
    const newEssay = e.target.value;
    setEssay(newEssay);
    if (onEssayChange) {
      onEssayChange(questionId, newEssay);
    }
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <div className="part__answer-card">
      <div className="part__question-number">{questionNumber}</div>
      <button
        onClick={() => setShowNotes(!showNotes)}
        className="part__notes-btn"
      >
        {showNotes ? "Ẩn ghi chú" : "Thêm ghi chú / dàn ý"}
      </button>
      {showNotes && (
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Thêm ghi chú tại đây..."
          className="part__notes-textarea"
        />
      )}
      <div>
        <textarea
          value={essay}
          onChange={handleEssayChange}
          placeholder="Viết essay tại đây..."
          className="part__essay-textarea"
        />
        <div className="part__word-count">
          Word count: {getWordCount(essay)}
        </div>
      </div>
    </div>
  );
}
