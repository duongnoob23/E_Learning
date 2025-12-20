import React, { useEffect, useMemo, useState } from "react";
import { usePartQuestions } from "../../../../../services/Assessment/assessmentQueries";
import NotesAndRecorder from "./components/NotesAndRecorder";
import QuestionCard from "./components/QuestionCard";
import "./Part1.scss";

/**
 * TOEIC Speaking Part 1
 * Layout: Question content (left) + Notes & Recorder (right)
 */
export default function Part1({
  onAnswer,
  registerRef,
  answers,
  onDataLoaded,
  partData,
  partNumber = 1,
  activeQuestionId, // ✅ FIX: Nhận activeQuestionId từ parent
}) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [recordings, setRecordings] = useState({});

  // ✅ Debug: Log props khi component render
  console.log("🎬 [Part1] Component render:", {
    partNumber,
    hasOnAnswer: !!onAnswer,
    hasRegisterRef: !!registerRef,
    answersKeys: answers ? Object.keys(answers) : [],
    answersCount: answers ? Object.keys(answers).length : 0,
    recordingsStateKeys: Object.keys(recordings),
    notesStateKeys: Object.keys(notes),
  });

  // ✅ FIX: Load recordings/notes từ answers khi component mount hoặc answers thay đổi
  useEffect(() => {
    console.log("🔄 [Part1] useEffect answers triggered:", {
      hasAnswers: !!answers,
      answersKeys: answers ? Object.keys(answers) : [],
      answers,
    });

    if (answers && Object.keys(answers).length > 0) {
      const loadedRecordings = {};
      const loadedNotes = {};

      Object.keys(answers).forEach((qid) => {
        const answer = answers[qid];
        console.log(`🔍 [Part1] Checking answer for qid ${qid}:`, {
          answer,
          isObject: typeof answer === "object",
          hasRecording: !!answer?.recording,
          hasNotes: !!answer?.notes,
        });

        if (typeof answer === "object" && answer !== null) {
          if (answer.recording) {
            // ✅ Load từ answers (chỉ có url và duration, không có blob)
            loadedRecordings[qid] = {
              url: answer.recording.url,
              duration: answer.recording.duration,
              // ✅ Blob không có trong answers (không thể serialize)
              // ✅ URL vẫn có thể dùng để play audio
            };
            console.log(`✅ [Part1] Loaded recording for qid ${qid}:`, {
              url: answer.recording.url,
              duration: answer.recording.duration,
              note: "Blob not in answers (not serializable), using URL only",
            });
          }
          if (answer.notes) {
            loadedNotes[qid] = answer.notes;
          }
        }
      });

      console.log("📦 [Part1] Loaded data:", {
        recordingsCount: Object.keys(loadedRecordings).length,
        notesCount: Object.keys(loadedNotes).length,
        loadedRecordings,
        loadedNotes,
      });

      // ✅ Chỉ setState nếu có dữ liệu mới khác với hiện tại
      if (Object.keys(loadedRecordings).length > 0) {
        setRecordings((prev) => {
          // ✅ Luôn update nếu có recording mới từ answers (khi quay lại part)
          const hasChanges = Object.keys(loadedRecordings).some((qid) => {
            const prevUrl = prev[qid]?.url;
            const newUrl = loadedRecordings[qid]?.url;
            const changed = !prevUrl || prevUrl !== newUrl;
            console.log(`🔍 [Part1] Recording check for qid ${qid}:`, {
              prevUrl,
              newUrl,
              changed,
            });
            return changed;
          });

          if (hasChanges) {
            console.log(
              "✅ [Part1] Updating recordings state:",
              loadedRecordings
            );
            // ✅ Merge với existing để giữ lại blob nếu có (từ lần record trước)
            const merged = { ...prev };
            Object.keys(loadedRecordings).forEach((qid) => {
              merged[qid] = {
                ...loadedRecordings[qid],
                // ✅ Giữ lại blob từ prev nếu có (từ lần record trong session hiện tại)
                // ✅ Nếu không có thì chỉ dùng URL (từ answers khi quay lại part)
                blob: prev[qid]?.blob || null,
              };
            });
            return merged;
          } else {
            console.log("⏭️ [Part1] No changes, skipping recordings update");
            return prev;
          }
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
    } else {
      console.log("⚠️ [Part1] No answers to load");
    }
  }, [answers]); // ✅ Theo dõi answers để persist khi quay lại

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
        console.log("📤 [Part1] Calling onDataLoaded:", {
          partId,
          partNumber,
          questionsCount: data.DT.length,
        });
        onDataLoaded(partId || partNumber, data.DT);
      }
    } else if (error) {
      setLoading(false);
      console.error("Error loading Part 1 questions:", error);
    }
    // ✅ BỎ onDataLoaded khỏi deps để tránh infinite loop
  }, [data, error, partNumber, partId]);

  // ✅ API đã filter theo partId rồi, dùng trực tiếp
  const questions = allQuestions;

  console.log("🔍 [Part1] Render state:", {
    loading,
    isLoading,
    questionsLength: questions.length,
    allQuestionsLength: allQuestions.length,
    hasError: !!error,
  });

  const handleNotesChange = (questionId, notesText) => {
    setNotes((prev) => ({ ...prev, [questionId]: notesText }));
    if (onAnswer) {
      onAnswer(questionId, { notes: notesText });
    }
  };

  const handleRecordStart = (questionId) => {};

  const handleRecordStop = (questionId, blob, duration) => {
    const url = URL.createObjectURL(blob);
    console.log("🎤 [Part1] handleRecordStop:", {
      questionId,
      url,
      duration,
      hasBlob: !!blob,
      currentNotes: notes[questionId],
    });

    // ✅ FIX: Lưu vào local state
    setRecordings((prev) => {
      const updated = {
        ...prev,
        [questionId]: { blob, url, duration },
      };
      console.log("💾 [Part1] Updated local recordings state:", updated);
      return updated;
    });

    // ✅ FIX: Lưu vào answers state ngay lập tức để persist khi chuyển tab
    // ✅ LƯU Ý: Không lưu blob vào answers vì blob không thể serialize
    // ✅ Chỉ lưu url và duration, URL đã được tạo từ blob và có thể dùng để play
    if (onAnswer) {
      const currentNotes = notes[questionId] || "";
      const answerData = {
        recording: {
          // ✅ KHÔNG lưu blob (không thể serialize), chỉ lưu url và duration
          url,
          duration,
        },
        ...(currentNotes ? { notes: currentNotes } : {}), // Giữ lại notes nếu có
      };
      console.log("📤 [Part1] Calling onAnswer with:", {
        questionId,
        answerData,
        note: "Blob not saved (not serializable), only url and duration",
      });
      onAnswer(questionId, answerData);
    } else {
      console.error("❌ [Part1] onAnswer is not defined!");
    }
  };

  if (loading || isLoading) {
    return (
      <section className="part part--speaking part--speaking-1">
        <h3 className="part__title">Part 1 - TOEIC Speaking</h3>
        <div className="part__loading">
          <p>Đang tải câu hỏi...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="part part--speaking part--speaking-1">
        <h3 className="part__title">Part 1 - TOEIC Speaking</h3>
        <div className="part__error">
          <p>Có lỗi xảy ra khi tải câu hỏi</p>
        </div>
      </section>
    );
  }

  return (
    <section className="part part--speaking part--speaking-1">
      <h3 className="part__title">Part 1 - TOEIC Speaking</h3>

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
                  initialDuration={
                    // ✅ Pass duration từ answers để hiển thị chính xác
                    answers[question.question_id]?.recording?.duration ||
                    recordings[question.question_id]?.duration ||
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
