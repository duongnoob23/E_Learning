import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";
import NotesAndRecorder from "./components/NotesAndRecorder";
import QuestionCard from "./components/QuestionCard";
import "./Part5.scss";

export default function Part5({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
  partNumber = 5,
}) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [recordings, setRecordings] = useState({});

  // ✅ FIX: Load recordings/notes từ answers khi answers thay đổi
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      const loadedRecordings = {};
      const loadedNotes = {};
      
      Object.keys(answers).forEach((qid) => {
        const answer = answers[qid];
        if (typeof answer === "object" && answer !== null) {
          if (answer.recording) {
            // ✅ Load từ answers (chỉ có url và duration, không có blob)
            loadedRecordings[qid] = {
              url: answer.recording.url,
              duration: answer.recording.duration,
            };
          }
          if (answer.notes) loadedNotes[qid] = answer.notes;
        }
      });
      
      if (Object.keys(loadedRecordings).length > 0) {
        setRecordings((prev) => {
          const hasChanges = Object.keys(loadedRecordings).some(
            (qid) => !prev[qid] || prev[qid].url !== loadedRecordings[qid].url
          );
          if (hasChanges) {
            // ✅ Merge với existing để giữ lại blob nếu có (từ lần record trong session hiện tại)
            const merged = { ...prev };
            Object.keys(loadedRecordings).forEach((qid) => {
              merged[qid] = {
                ...loadedRecordings[qid],
                blob: prev[qid]?.blob || null, // Giữ lại blob nếu có
              };
            });
            return merged;
          }
          return prev;
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
      console.error("Error loading Part 5 questions:", error);
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

  const handleRecordStart = (questionId) => {};

  const handleRecordStop = (questionId, blob, duration) => {
    const url = URL.createObjectURL(blob);
    // ✅ FIX: Lưu vào local state
    setRecordings((prev) => ({
      ...prev,
      [questionId]: { blob, url, duration },
    }));
    // ✅ FIX: Lưu vào answers state ngay lập tức để persist khi chuyển tab
    // ✅ Merge với notes hiện tại nếu có
    if (onAnswer) {
      const currentNotes = notes[questionId] || "";
      onAnswer(questionId, {
        recording: {
          // ✅ KHÔNG lưu blob (không thể serialize), chỉ lưu url và duration
          url,
          duration,
        },
        ...(currentNotes ? { notes: currentNotes } : {}), // Giữ lại notes nếu có
      });
    }
  };

  if (loading || isLoading) {
    return (
      <section className="part part--speaking part--speaking-5">
        <h3 className="part__title">Part 5 - TOEIC Speaking</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--speaking part--speaking-5">
        <h3 className="part__title">Part 5 - TOEIC Speaking</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi</p>
        </div>
      </section>
    );
  }

  return (
    <section className="part part--speaking part--speaking-5">
      <h3 className="part__title">Part 5 - TOEIC Speaking</h3>

      {/* ✅ Hiển thị TOÀN BỘ câu hỏi - không dùng activeQuestionIndex */}
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
                <QuestionCard
                  question={question}
                  questionNumber={question.question_number}
                />
              </div>

              <div className="part__answer">
                <NotesAndRecorder
                  questionId={question.question_id}
                  questionNumber={question.question_number}
                  initialNotes={
                    // ✅ Ưu tiên: answers prop → local state
                    answers[question.question_id]?.notes ||
                    notes[question.question_id] ||
                    ""
                  }
                  initialRecordingUrl={
                    // ✅ Ưu tiên: answers prop → local state
                    answers[question.question_id]?.recording?.url ||
                    recordings[question.question_id]?.url ||
                    null
                  }
                  onNotesChange={handleNotesChange}
                  onRecordStart={handleRecordStart}
                  onRecordStop={handleRecordStop}
                  maxDuration={question.max_record_seconds || 45}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
