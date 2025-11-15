import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";
import NotesAndRecorder from "./components/NotesAndRecorder";
import QuestionCard from "./components/QuestionCard";

/**
 * Component chính cho TOEIC Speaking Part
 * Layout: Question content (left) + Notes & Recorder (right)
 */
export default function SpeakingPart({
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
  const [recordings, setRecordings] = useState({}); // { questionId: { blob, url, duration } }

  // ✅ Sử dụng partNumber từ props, fallback về partData[0] nếu không có
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

  // ✅ Fetch tất cả questions (vì API có thể trả về tất cả questions của speaking)
  // Hoặc fetch riêng theo part_id nếu API hỗ trợ
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
      console.error("Error loading Speaking questions:", error);
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

  const handleRecordStart = (questionId) => {
    // Có thể thêm logic nếu cần
  };

  const handleRecordStop = (questionId, blob, duration) => {
    const url = URL.createObjectURL(blob);
    setRecordings((prev) => ({
      ...prev,
      [questionId]: { blob, url, duration },
    }));
    if (onAnswer) {
      onAnswer(questionId, {
        recording: { blob, url, duration },
        type: "recording",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <section className="part part--speaking">
        <h3 className="part__title">TOEIC Speaking</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--speaking">
        <h3 className="part__title">TOEIC Speaking</h3>
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
    <section className="part part--speaking" style={{ padding: "16px 0" }}>
      <h3
        className="part__title"
        style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}
      >
        Part {currentPartNumber} - TOEIC Speaking
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

      {/* Main Content: Question (Left) + Notes & Recorder (Right) */}
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
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestion.question_number}
            />
          </div>

          {/* Right: Notes & Recorder */}
          <div>
            <NotesAndRecorder
              questionId={currentQuestion.question_id}
              questionNumber={currentQuestion.question_number}
              initialNotes={notes[currentQuestion.question_id] || ""}
              initialRecordingUrl={recordings[currentQuestion.question_id]?.url}
              onNotesChange={handleNotesChange}
              onRecordStart={handleRecordStart}
              onRecordStop={handleRecordStop}
              maxDuration={currentQuestion.max_record_seconds || 45}
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
