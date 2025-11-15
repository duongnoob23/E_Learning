import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";

/**
 * Component chính cho TOEIC Writing Part
 * Layout: Question content (left) + Notes & Essay (right)
 */
export default function WritingPart({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
  partNumber, // ✅ Nhận partNumber từ AssessmentTest
}) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [notes, setNotes] = useState({}); // { questionId: notesText }
  const [essays, setEssays] = useState({}); // { questionId: essayText }

  // ✅ Sử dụng partNumber từ props
  const currentPartNumber = useMemo(() => {
    if (partNumber) return partNumber;
    if (!partData || !Array.isArray(partData)) return 1;
    return partData[0]?.part_number || 1;
  }, [partNumber, partData]);

  // ✅ Tìm part_id tương ứng với currentPartNumber
  const partId = useMemo(() => {
    if (!partData || !Array.isArray(partData)) return null;
    const part = partData.find((item) => item.part_number == currentPartNumber);
    return part?.part_id || null;
  }, [partData, currentPartNumber]);

  const { data, isLoading, error } = usePartQuestions(partId, !!partId);

  useEffect(() => {
    if (data?.EC === "0" && data?.DT) {
      setAllQuestions(data.DT);
      setLoading(false);
      // ✅ Filter questions theo part_number và gửi về parent
      const partQuestions = data.DT.filter(
        (q) => q.part_number == currentPartNumber
      );
      onDataLoaded(partQuestions);
    } else if (error) {
      setLoading(false);
      console.error("Error loading Writing questions:", error);
    }
  }, [data, error, onDataLoaded, currentPartNumber]);

  // ✅ Filter questions theo part_number hiện tại
  const questions = useMemo(() => {
    return allQuestions.filter((q) => q.part_number == currentPartNumber);
  }, [allQuestions, currentPartNumber]);

  const currentQuestion = questions[activeQuestionIndex] || null;

  const handleNotesChange = (questionId, notesText) => {
    setNotes((prev) => ({ ...prev, [questionId]: notesText }));
    if (onAnswer) {
      onAnswer(questionId, { notes: notesText, type: "notes" });
    }
  };

  const handleEssayChange = (questionId, essayText) => {
    setEssays((prev) => ({ ...prev, [questionId]: essayText }));
    if (onAnswer) {
      onAnswer(questionId, { essay: essayText, type: "essay" });
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
      <section className="part part--writing">
        <h3 className="part__title">TOEIC Writing</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--writing">
        <h3 className="part__title">TOEIC Writing</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi</p>
        </div>
      </section>
    );
  }

  // ✅ Reset activeQuestionIndex khi questions thay đổi
  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [currentPartNumber]);

  return (
    <section className="part part--writing" style={{ padding: "16px 0" }}>
      <h3
        className="part__title"
        style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}
      >
        Part {currentPartNumber} - TOEIC Writing
      </h3>

      {/* Question Navigation */}
      {questions.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {questions.map((q, index) => (
            <button
              key={q.question_id}
              onClick={() => setActiveQuestionIndex(index)}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: activeQuestionIndex === index ? "#2196F3" : "#fff",
                color: activeQuestionIndex === index ? "#fff" : "#333",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Câu {q.question_number}
            </button>
          ))}
        </div>
      )}

      {/* Main Content: Question (Left) + Notes & Essay (Right) */}
      {currentQuestion && (
        <div
          key={currentQuestion.question_id}
          ref={(el) =>
            registerRef && registerRef(currentQuestion.question_id, el)
          }
          style={{
            display: "grid",
            gridTemplateColumns: "65% 35%",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Left: Question Content */}
          <div>
            <QuestionContent question={currentQuestion} />
          </div>

          {/* Right: Notes & Essay */}
          <div>
            <NotesAndEssay
              questionId={currentQuestion.question_id}
              questionNumber={currentQuestion.question_number}
              initialNotes={notes[currentQuestion.question_id] || ""}
              initialEssay={essays[currentQuestion.question_id] || ""}
              onNotesChange={handleNotesChange}
              onEssayChange={handleEssayChange}
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "24px",
        }}
      >
        <button
          onClick={() => {
            if (activeQuestionIndex > 0) {
              setActiveQuestionIndex(activeQuestionIndex - 1);
            }
          }}
          disabled={activeQuestionIndex === 0}
          style={{
            padding: "10px 20px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            background: "#fff",
            cursor: activeQuestionIndex === 0 ? "not-allowed" : "pointer",
            opacity: activeQuestionIndex === 0 ? 0.5 : 1,
          }}
        >
          ← Trước
        </button>

        <button
          onClick={() => {
            if (activeQuestionIndex < questions.length - 1) {
              setActiveQuestionIndex(activeQuestionIndex + 1);
            }
          }}
          disabled={activeQuestionIndex === questions.length - 1}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            background: "#2196F3",
            color: "#fff",
            cursor:
              activeQuestionIndex === questions.length - 1
                ? "not-allowed"
                : "pointer",
            opacity: activeQuestionIndex === questions.length - 1 ? 0.5 : 1,
          }}
        >
          TIẾP THEO →
        </button>
      </div>
    </section>
  );
}

// Subcomponent: Question Content (Left)
function QuestionContent({ question }) {
  const { content, question_text, type } = question || {};

  // Nếu là email
  if (type === "respond-email" || content?.email) {
    const email = content?.email || {};
    return (
      <div
        style={{
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          lineHeight: 1.6,
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#333",
          }}
        >
          Respond to an email
        </h3>

        <div style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
          <div>
            <strong>From:</strong>{" "}
            {email.from || content?.from || "update@dailyjobseeker.com"}
          </div>
          <div>
            <strong>To:</strong> {email.to || content?.to || "Anna Billings"}
          </div>
          <div>
            <strong>Subject:</strong>{" "}
            {email.subject || content?.subject || "Daily Jobseeker update"}
          </div>
          <div>
            <strong>Sent:</strong>{" "}
            {email.sent || content?.sent || "March 14, 20-"}
          </div>
        </div>

        <div
          style={{
            fontSize: "15px",
            color: "#333",
            marginBottom: "16px",
            whiteSpace: "pre-line",
          }}
        >
          {email.body || content?.text || content?.body}
        </div>

        {content?.directions && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <strong>Directions:</strong> {content.directions}
          </div>
        )}
      </div>
    );
  }

  // Nếu là image
  if (type === "describe-picture" || content?.image_file) {
    return (
      <div
        style={{
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#333",
          }}
        >
          Write a sentence based on a picture
        </h3>

        {content?.image_file && (
          <div style={{ marginBottom: "16px" }}>
            <img
              src={content.image_file}
              alt="Question"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "6px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        {question_text && (
          <div style={{ fontSize: "15px", color: "#333" }}>{question_text}</div>
        )}
      </div>
    );
  }

  // Default: text content
  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        lineHeight: 1.6,
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "16px",
          color: "#333",
        }}
      >
        Write an essay
      </h3>

      {content?.text && (
        <div
          style={{
            fontSize: "15px",
            color: "#333",
            whiteSpace: "pre-line",
            marginBottom: "16px",
          }}
        >
          {content.text}
        </div>
      )}

      {question_text && (
        <div
          style={{ fontSize: "15px", color: "#333", whiteSpace: "pre-line" }}
        >
          {question_text}
        </div>
      )}
    </div>
  );
}

// Subcomponent: Notes & Essay (Right)
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Question Number */}
      <div style={{ fontSize: "18px", fontWeight: 600, color: "#333" }}>
        {questionNumber}
      </div>

      {/* Notes Button */}
      <button
        onClick={() => setShowNotes(!showNotes)}
        style={{
          padding: "8px 16px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          background: "#f9f9f9",
          cursor: "pointer",
          fontSize: "14px",
          color: "#666",
        }}
      >
        {showNotes ? "Ẩn ghi chú" : "Thêm ghi chú / dàn ý"}
      </button>

      {/* Notes Textarea */}
      {showNotes && (
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Thêm ghi chú tại đây..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      )}

      {/* Essay Textarea */}
      <div>
        <textarea
          value={essay}
          onChange={handleEssayChange}
          placeholder="Viết essay tại đây..."
          style={{
            width: "100%",
            minHeight: "300px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
        <div
          style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#666",
            textAlign: "right",
          }}
        >
          Word count: {getWordCount(essay)}
        </div>
      </div>
    </div>
  );
}
