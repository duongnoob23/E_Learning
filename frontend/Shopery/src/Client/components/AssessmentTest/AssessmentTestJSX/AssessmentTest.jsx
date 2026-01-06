// components/AssessmentTest/AssessmentTestJSX/AssessmentTest.jsx

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useExamLeaveBlocker } from "../../../hooks/Assessment/useExamLeaveBlocker";
import {
  useScoreSpeaking,
  useScoreWriting,
  useSubmitExamSession,
  useSubmitSpeakingAudio,
  useSubmitWritingText,
} from "../../../services/Assessment/assessmentMutations";
import "../AssessmentTestCSS/AssessmentTest.css";
import { getQuestionComponent } from "./QuestionComponentMapper";
import QuestionNavigator from "./QuestionNavigator";
import TestHeader from "./TestHeader";

export default function AssessmentTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevPath = useRef(location.pathname);

  const sessionData = location.state?.sessionData;
  const partData = location.state?.partData;

  console.log("sessionData", JSON.stringify(sessionData, null, 2));
  console.log("partData", JSON.stringify(partData, null, 2));

  // ✅ THÊM: Xác định examType và skill từ sessionData hoặc test data
  const examType = useMemo(() => {
    // 1. Từ sessionData nếu có
    if (sessionData?.exam_type) return sessionData.exam_type.toLowerCase();

    // 2. Parse từ test title nếu có
    const testTitle =
      sessionData?.test?.title || location.state?.testTitle || "";
    if (testTitle.toLowerCase().includes("ielts")) return "ielts";
    if (testTitle.toLowerCase().includes("toeic")) return "toeic";

    // 3. Default
    return "toeic";
  }, [sessionData, location.state]);

  const skill = useMemo(() => {
    // ✅ 1. ƯU TIÊN CAO NHẤT: Lấy từ partData.part_type
    if (partData && Array.isArray(partData) && partData.length > 0) {
      // Lấy tất cả unique part_types
      const partTypes = [...new Set(partData.map((p) => p.part_type))];

      // Nếu tất cả parts là SPEAKING → skill = "speaking"
      if (partTypes.length === 1 && partTypes[0] === "SPEAKING") {
        return "speaking";
      }

      // Nếu tất cả parts là WRITING → skill = "writing"
      if (partTypes.length === 1 && partTypes[0] === "WRITING") {
        return "writing";
      }

      // Nếu tất cả parts là LISTENING → skill = "listening"
      if (partTypes.length === 1 && partTypes[0] === "LISTENING") {
        return "listening";
      }

      // Nếu tất cả parts là READING → skill = "reading"
      if (partTypes.length === 1 && partTypes[0] === "READING") {
        return "reading";
      }

      // Nếu có cả LISTENING và READING → skill = "listening_reading"
      if (partTypes.includes("LISTENING") && partTypes.includes("READING")) {
        return "listening_reading";
      }

      // Nếu có SPEAKING và WRITING → speaking_writing
      if (partTypes.includes("SPEAKING") && partTypes.includes("WRITING")) {
        return "speaking_writing";
      }
    }

    // 2. Default fallback
    return "listening_reading";
  }, [partData]);

  // Debug: Log examType và skill
  // console.log("🔍 Detected examType:", examType, "skill:", skill);

  const [answers, setAnswers] = useState({});
  const questionRefs = useRef({});
  const leftContainerRef = useRef(null);
  const [questionsData, setQuestionsData] = useState({});

  // ✅ Debug: Log answers state changes
  useEffect(() => {
    console.log("📊 [AssessmentTest] answers state changed:", {
      answersKeys: Object.keys(answers),
      answersCount: Object.keys(answers).length,
      answers,
    });
  }, [answers]);

  // Parse selected_parts từ sessionData, fallback về partData nếu không có
  const selectedParts = useMemo(() => {
    // 1. Thử parse từ sessionData.selected_parts
    if (sessionData?.selected_parts) {
      try {
        const parsed = JSON.parse(sessionData.selected_parts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Nếu parse lỗi, tiếp tục fallback
      }
    }

    // 2. Fallback: Lấy từ partData (sắp xếp theo part_number)
    if (partData && Array.isArray(partData) && partData.length > 0) {
      const parts = partData
        .map((p) => p.part_number)
        .filter((p) => p != null)
        .sort((a, b) => a - b);
      if (parts.length > 0) {
        // console.log("📋 Using partData for selectedParts:", parts);
        return parts;
      }
    }

    // 3. Default fallback (không nên xảy ra)
    console.warn("⚠️ No selectedParts found, using default [1]");
    return [1];
  }, [sessionData, partData]);

  // ✅ Set activePart = phần tử đầu tiên của selectedParts
  const [activePart, setActivePart] = useState(1);

  // ✅ Cập nhật activePart khi selectedParts thay đổi
  useEffect(() => {
    if (selectedParts.length > 0) {
      // Nếu activePart hiện tại không có trong selectedParts, set về phần tử đầu tiên
      if (!selectedParts.includes(activePart)) {
        // console.log("🔄 Updating activePart from", activePart, "to", selectedParts[0]);
        setActivePart(selectedParts[0]);
      }
    }
  }, [selectedParts, activePart]);

  // Debug: Log selectedParts
  // console.log("📋 selectedParts:", selectedParts, "activePart:", activePart);

  // Hook để nộp bài
  const { mutateAsync: submitExam, isPending: isSubmitting } =
    useSubmitExamSession();

  // Hook để nộp bài writing
  const { mutateAsync: submitWritingText, isPending: isSubmittingWriting } =
    useSubmitWritingText();

  // Hook để chấm điểm writing
  const { mutateAsync: scoreWriting, isPending: isScoringWriting } =
    useScoreWriting();

  // Hook để nộp bài speaking
  const { mutateAsync: submitSpeakingAudio, isPending: isSubmittingSpeaking } =
    useSubmitSpeakingAudio();

  // Hook để chấm điểm speaking
  const { mutateAsync: scoreSpeaking, isPending: isScoringSpeaking } =
    useScoreSpeaking();

  function registerRef(qid, el) {
    if (el) questionRefs.current[qid] = el;
  }

  function handleJump(qid) {
    const el = questionRefs.current[qid];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const part = getPartFromQid(qid);
      if (part) setActivePart(part);
    }
  }

  const handleNavigate = () => {
    customNavigate("/assessmentResult", {
      state: {
        sessionId: 21,
        testId: "T2025-NE01",
        testTitle: "New Economy TOEIC Full Test 1",
      },
    });
  };

  function getPartFromQid(qid) {
    for (const partId of selectedParts) {
      const questions = questionsData[partId];
      // ✅ Đảm bảo questions là array trước khi .some()
      if (
        Array.isArray(questions) &&
        questions.some((q) => q.question_id === qid)
      ) {
        return partId;
      }
    }
    return null;
  }

  function handleAnswer(qid, answerData) {
    console.log("📥 [AssessmentTest] handleAnswer called:", {
      qid,
      answerData,
      hasRecording: !!answerData?.recording,
      hasNotes: !!answerData?.notes,
    });

    setAnswers((prev) => {
      console.log("📋 [AssessmentTest] Current answers state:", {
        prevKeys: Object.keys(prev),
        existingAnswer: prev[qid],
      });

      // ✅ Support cả object (Speaking/Writing) và primitive (Listening/Reading)
      if (typeof answerData === "object" && answerData !== null) {
        // Speaking/Writing: merge với existing data (giữ lại notes khi có recording mới)
        const existing = prev[qid] || {};
        const merged = { ...existing, ...answerData };

        // ✅ Nếu có recording mới nhưng không có notes trong answerData → giữ lại notes cũ
        if (answerData.recording && !answerData.notes && existing.notes) {
          merged.notes = existing.notes;
          console.log(
            "✅ [AssessmentTest] Preserved existing notes:",
            existing.notes
          );
        }

        // ✅ Nếu có notes mới nhưng không có recording trong answerData → giữ lại recording cũ
        if (answerData.notes && !answerData.recording && existing.recording) {
          merged.recording = existing.recording;
          console.log(
            "✅ [AssessmentTest] Preserved existing recording:",
            existing.recording
          );
        }

        console.log("💾 [AssessmentTest] Saving answer:", {
          qid,
          merged,
          recordingUrl: merged.recording?.url,
          hasNotes: !!merged.notes,
        });

        const updated = { ...prev, [qid]: merged };
        console.log("✅ [AssessmentTest] Updated answers state:", {
          allKeys: Object.keys(updated),
          savedAnswer: updated[qid],
        });
        return updated;
      }
      // Listening/Reading: replace với choiceId
      return { ...prev, [qid]: answerData };
    });
  }

  // Build parts summary cho navigator
  const partsSummary = useMemo(() => {
    console.log("🔍 [Navigator] Building partsSummary:", {
      selectedParts,
      questionsDataKeys: Object.keys(questionsData),
      questionsData,
    });

    return selectedParts.map((partId) => {
      const partQuestions = questionsData[partId];
      // ✅ Đảm bảo partQuestions là array trước khi map
      const questionIds = Array.isArray(partQuestions)
        ? partQuestions.map((q) => q.question_id)
        : [];

      console.log(`📊 Part ${partId}:`, {
        hasQuestions: !!partQuestions,
        questionCount: questionIds.length,
        questionIds,
      });

      return {
        part: partId,
        questionIds,
      };
    });
  }, [selectedParts, questionsData]);

  // ✅ XỬ LÝ NỘP BÀI
  const handleSubmit = async () => {
    try {
      // ✅ PHÂN BIỆT WRITING, SPEAKING vs LISTENING/READING
      const isWriting = skill === "writing" || skill === "speaking_writing";
      const isSpeaking = skill === "speaking" || skill === "speaking_writing";

      if (isSpeaking && !isWriting) {
        // ========== XỬ LÝ SPEAKING (CHỈ SPEAKING) ==========
        console.log("🎤 [Speaking] Starting submit process...");

        // Lấy tất cả questions để tìm SPEAKING questions
        const allQuestions = Object.values(questionsData).flatMap(
          (partQuestions) => {
            return Array.isArray(partQuestions)
              ? partQuestions.map((q) => ({
                  question_id: q.question_id,
                  question_type: q.question_type,
                }))
              : [];
          }
        );

        // Filter chỉ SPEAKING questions
        const speakingQuestions = allQuestions.filter(
          (q) => q.question_type === "SPEAKING"
        );

        console.log(
          "🎤 [Speaking] Found speaking questions:",
          speakingQuestions
        );

        if (speakingQuestions.length === 0) {
          alert("Không tìm thấy câu hỏi Speaking để nộp bài");
          return;
        }

        // Kiểm tra xem có câu nào chưa làm không
        const unansweredSpeaking = speakingQuestions.filter(
          (q) => !answers[q.question_id] || !answers[q.question_id].recording
        );

        if (unansweredSpeaking.length > 0) {
          const confirmSubmit = window.confirm(
            `Bạn còn ${unansweredSpeaking.length} câu Speaking chưa làm. Bạn có chắc muốn nộp bài sớm không?`
          );
          if (!confirmSubmit) return;
        }

        // ✅ Helper function để convert blob URL thành File
        const blobUrlToFile = async (blobUrl, filename) => {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          return new File([blob], filename, { type: blob.type });
        };

        // ✅ Gửi tất cả submitSpeakingAudio cùng lúc (parallel)
        const submitPromises = speakingQuestions
          .filter((q) => {
            const answerData = answers[q.question_id];
            return answerData?.recording?.url || answerData?.recording?.blob;
          })
          .map(async (question) => {
            const answerData = answers[question.question_id];
            const recording = answerData?.recording;

            if (!recording) {
              console.warn(
                `⚠️ [Speaking] No recording for question ${question.question_id}`
              );
              return null;
            }

            try {
              // Convert blob URL thành File
              const audioFile = await blobUrlToFile(
                recording.url || recording.blob,
                `speaking_${question.question_id}.${recording.type || "webm"}`
              );

              // Tạo FormData
              const formData = new FormData();
              formData.append("session_id", sessionData.exam_session_id);
              formData.append("question_id", question.question_id);
              formData.append("language", "en");
              formData.append("audio_file", audioFile);

              const submitResult = await submitSpeakingAudio(formData);

              if (submitResult.EC !== "0") {
                console.error(
                  `❌ [Speaking] Submit failed for question ${question.question_id}:`,
                  submitResult
                );
                return null;
              }

              const responseId = submitResult.DT?.response_id;
              const audioFilePath = submitResult.DT?.audio_file_path;
              if (!responseId || !audioFilePath) {
                console.error(
                  `❌ [Speaking] No response_id or audio_file_path returned for question ${question.question_id}`
                );
                return null;
              }

              return {
                question_id: question.question_id,
                response_id: responseId,
                audio_file_path: audioFilePath,
                transcription: submitResult.DT?.transcription || "",
              };
            } catch (error) {
              console.error(
                `❌ [Speaking] Error submitting question ${question.question_id}:`,
                error
              );
              return null;
            }
          });

        // Chờ tất cả submit hoàn thành
        const submittedResponses = (await Promise.all(submitPromises)).filter(
          (r) => r !== null
        );

        console.log(
          `✅ [Speaking] Submitted ${submittedResponses.length}/${speakingQuestions.length} questions`
        );

        // Navigate ngay đến SpeakingResult với submitted responses (chưa chấm điểm)
        navigate("/speakingResult", {
          state: {
            sessionId: sessionData.exam_session_id,
            testId: sessionData.test_id,
            testTitle: sessionData.test?.title || "Speaking Test",
            submittedResponses: submittedResponses, // Chưa chấm điểm
            questionsData: questionsData,
            answers: answers,
            allSpeakingQuestions: speakingQuestions, // Để biết tổng số câu
          },
        });
      } else if (isWriting) {
        // ========== XỬ LÝ WRITING ==========
        console.log("📝 [Writing] Starting submit process...");

        // Lấy tất cả questions để tìm WRITING questions
        const allQuestions = Object.values(questionsData).flatMap(
          (partQuestions) => {
            return Array.isArray(partQuestions)
              ? partQuestions.map((q) => ({
                  question_id: q.question_id,
                  question_type: q.question_type,
                }))
              : [];
          }
        );

        // Filter chỉ WRITING questions
        const writingQuestions = allQuestions.filter(
          (q) => q.question_type === "WRITING"
        );

        console.log("📝 [Writing] Found writing questions:", writingQuestions);

        if (writingQuestions.length === 0) {
          alert("Không tìm thấy câu hỏi Writing để nộp bài");
          return;
        }

        // Kiểm tra xem có câu nào chưa làm không
        const unansweredWriting = writingQuestions.filter(
          (q) => !answers[q.question_id] || !answers[q.question_id].essay
        );

        if (unansweredWriting.length > 0) {
          const confirmSubmit = window.confirm(
            `Bạn còn ${unansweredWriting.length} câu Writing chưa làm. Bạn có chắc muốn nộp bài sớm không?`
          );
          if (!confirmSubmit) return;
        }

        // ✅ Gửi tất cả submitWritingText cùng lúc (parallel)
        const submitPromises = writingQuestions
          .filter((q) => {
            const answerData = answers[q.question_id];
            const writtenText = answerData?.essay || "";
            return writtenText.trim().length > 0;
          })
          .map(async (question) => {
            const answerData = answers[question.question_id];
            const writtenText = answerData?.essay || "";

            try {
              const submitResult = await submitWritingText({
                session_id: sessionData.exam_session_id,
                question_id: question.question_id,
                written_text: writtenText,
                language: "en",
              });

              if (submitResult.EC !== "0") {
                console.error(
                  `❌ [Writing] Submit failed for question ${question.question_id}:`,
                  submitResult
                );
                return null;
              }

              const responseId = submitResult.DT?.response_id;
              if (!responseId) {
                console.error(
                  `❌ [Writing] No response_id returned for question ${question.question_id}`
                );
                return null;
              }

              return {
                question_id: question.question_id,
                response_id: responseId,
                written_text: writtenText,
              };
            } catch (error) {
              console.error(
                `❌ [Writing] Error submitting question ${question.question_id}:`,
                error
              );
              return null;
            }
          });

        // Chờ tất cả submit hoàn thành
        const submittedResponses = (await Promise.all(submitPromises)).filter(
          (r) => r !== null
        );

        console.log(
          `✅ [Writing] Submitted ${submittedResponses.length}/${writingQuestions.length} questions`
        );

        // Navigate ngay đến WritingResult với submitted responses (chưa chấm điểm)
        navigate("/writingResult", {
          state: {
            sessionId: sessionData.exam_session_id,
            testId: sessionData.test_id,
            testTitle: sessionData.test?.title || "Writing Test",
            submittedResponses: submittedResponses, // Chưa chấm điểm
            questionsData: questionsData,
            answers: answers,
            allWritingQuestions: writingQuestions, // Để biết tổng số câu
          },
        });
      } else {
        // ========== XỬ LÝ LISTENING/READING (LOGIC CŨ) ==========
        const totalQuestions = Object.values(questionsData).reduce(
          (sum, partQuestions) => {
            return (
              sum + (Array.isArray(partQuestions) ? partQuestions.length : 0)
            );
          },
          0
        );

        const answeredCount = Object.keys(answers).length;
        const unansweredCount = totalQuestions - answeredCount;

        if (unansweredCount > 0) {
          const confirmSubmit = window.confirm(
            `Bạn còn ${unansweredCount} câu chưa làm. Bạn có chắc muốn nộp bài sớm không?`
          );
          if (!confirmSubmit) return;
        }

        const allQuestions = Object.values(questionsData).flatMap(
          (partQuestions) => {
            return Array.isArray(partQuestions)
              ? partQuestions.map((q) => q.question_id)
              : [];
          }
        );

        const answersArray = allQuestions.map((questionId) => ({
          question_id: questionId,
          selected_choice_id: answers[questionId] ?? null,
        }));

        const result = await submitExam({
          sessionId: sessionData.exam_session_id,
          answers: answersArray,
          examId: sessionData.test_id,
        });

        if (result && +result.EC === 0) {
          navigate("/assessmentResult", {
            state: {
              sessionId: sessionData.exam_session_id,
              testId: "2",
              testTitle: "New Economy TOEIC Full Test 1",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Có lỗi xảy ra khi nộp bài: " + (error.message || "Unknown error"));
    }
  };

  const { customNavigate } = useExamLeaveBlocker(
    true,
    "⚠️ Bài kiểm tra chưa được nộp. Bạn có chắc muốn rời khỏi trang không?",
    handleSubmit
  );

  // ✅ SỬA: Tạo generic handler cho tất cả parts
  const handlePartDataLoaded = useCallback(
    (partId, data) => {
      console.log("📥 [AssessmentTest] handlePartDataLoaded:", {
        partId,
        dataLength: data?.length,
        data,
      });

      // ✅ FIX: Map part_id → part_number để match với selectedParts
      let partNumber = partId;
      if (partData && Array.isArray(partData)) {
        const part = partData.find(
          (p) => p.part_id == partId || p.part_number == partId
        );
        if (part) {
          partNumber = part.part_number; // ✅ Dùng part_number làm key
        }
      }

      setQuestionsData((prev) => {
        const updated = { ...prev, [partNumber]: data };
        console.log(
          "✅ [AssessmentTest] Updated questionsData:",
          Object.keys(updated),
          `(part_id: ${partId} → part_number: ${partNumber})`
        );
        return updated;
      });
    },
    [partData]
  );

  // ✅ MỚI: Render component động dựa trên activePart
  const renderPartComponent = (partId) => {
    const PartComponent = getQuestionComponent(examType, skill, partId);

    if (!PartComponent) {
      return (
        <div className="part__error">
          <p>Không tìm thấy component cho Part {partId}</p>
        </div>
      );
    }

    // ✅ Filter partData để chỉ lấy part đang active (cho Speaking/Writing có nhiều parts)
    let currentPartData = partData;
    if (partData && Array.isArray(partData)) {
      // Tìm part có part_number = partId
      const part = partData.find((p) => p.part_number == partId);
      currentPartData = part ? [part] : partData; // Trả về array với 1 part hoặc toàn bộ nếu không tìm thấy
    }

    console.log(`🎨 [AssessmentTest] Rendering Part ${partId}:`, {
      answersKeys: answers ? Object.keys(answers) : [],
      answersCount: answers ? Object.keys(answers).length : 0,
      hasOnAnswer: !!handleAnswer,
    });

    return (
      <Suspense fallback={<div>Đang tải Part {partId}...</div>}>
        <PartComponent
          partData={currentPartData}
          partNumber={partId} // ✅ Truyền partNumber để component biết part nào đang active
          onAnswer={handleAnswer}
          registerRef={registerRef}
          answers={answers}
          onDataLoaded={(loadedPartId, loadedData) => {
            // ✅ onDataLoaded được gọi với (partId, data) từ Part components
            console.log("📤 [AssessmentTest] onDataLoaded called:", {
              loadedPartId,
              loadedDataLength: loadedData?.length,
              partId,
            });
            if (loadedData && Array.isArray(loadedData)) {
              // Có 2 params: (partId, data)
              handlePartDataLoaded(loadedPartId || partId, loadedData);
            } else if (Array.isArray(loadedPartId)) {
              // Chỉ có 1 param: (data)
              handlePartDataLoaded(partId, loadedPartId);
            }
          }}
        />
      </Suspense>
    );
  };

  return (
    <div className="toeic">
      <div className="toeic__container">
        <div className="toeic__left" ref={leftContainerRef}>
          <TestHeader
            title={`TOEIC Test - Session ${sessionData?.exam_session_id}`}
            onExit={() => alert("Thoát khỏi bài kiểm tra")}
          />

          <div className="toeic__tabs">
            {selectedParts.map((partId) => (
              <button
                key={partId}
                className={`toeic__tab ${
                  activePart === partId ? "toeic__tab--active" : ""
                }`}
                onClick={() => setActivePart(partId)}
              >
                Part {partId}
              </button>
            ))}
          </div>

          <div className="toeic__content">
            {/* ✅ THAY ĐỔI: Render component động thay vì if/else */}
            {selectedParts.includes(activePart) &&
              renderPartComponent(activePart)}
          </div>
        </div>

        <div className="toeic__right">
          <QuestionNavigator
            partsSummary={partsSummary}
            answers={answers}
            onJump={handleJump}
            onSubmit={handleSubmit}
            isSubmitting={
              isSubmitting ||
              isSubmittingWriting ||
              isScoringWriting ||
              isSubmittingSpeaking ||
              isScoringSpeaking
            }
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      <div className="toeic__footer">&nbsp;</div>
    </div>
  );
}
