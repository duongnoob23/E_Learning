import React, { useState, useEffect } from "react";
import {
  mockSpeakingQuestions,
  mockWritingQuestions,
} from "./TOEIC/mockTestData";
import { assessmentApi } from "../../../api/Assessment/assessmentApi";

/**
 * Component để preview Speaking và Writing
 * Chỉ hiển thị content, không có header/navigator
 */
export default function SpeakingWritingPreview() {
  const [previewType, setPreviewType] = useState(null); // "speaking" | "writing" | null
  const [useMockData, setUseMockData] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data từ API khi không dùng mock
  useEffect(() => {
    if (previewType && !useMockData) {
      setLoading(true);
      const testId = previewType === "speaking" ? "1215" : "1216";

      // Gọi API để lấy parts và questions
      assessmentApi
        .getTestParts(testId)
        .then((partsResponse) => {
          console.log("📦 Parts Response:", partsResponse);

          if (partsResponse?.EC === "0" && partsResponse?.DT?.length > 0) {
            // Lấy tất cả questions từ các parts
            const partPromises = partsResponse.DT.map((part) =>
              assessmentApi.getPartQuestions(part.part_id)
            );

            return Promise.all(partPromises);
          }
          return [];
        })
        .then((questionsResponses) => {
          console.log("📦 Questions Responses:", questionsResponses);

          // Combine tất cả questions
          const allQuestions = [];
          questionsResponses.forEach((response) => {
            if (response?.EC === "0" && response?.DT) {
              allQuestions.push(...response.DT);
            }
          });

          setApiData(allQuestions);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [previewType, useMockData]);

  const handleOpenPreview = (type) => {
    setPreviewType(type);
    setApiData(null);
  };

  const handleClose = () => {
    setPreviewType(null);
    setApiData(null);
  };

  // Lấy data để hiển thị
  const getDisplayData = () => {
    if (useMockData) {
      return previewType === "speaking"
        ? mockSpeakingQuestions.DT
        : mockWritingQuestions.DT;
    }
    return apiData || [];
  };

  const questions = getDisplayData();

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Preview Speaking & Writing</h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => handleOpenPreview("speaking")}
          style={{
            padding: "10px 20px",
            border: "1px solid #2196F3",
            borderRadius: "6px",
            background: "#fff",
            color: "#2196F3",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          👁️ Preview Speaking (1215)
        </button>

        <button
          onClick={() => handleOpenPreview("writing")}
          style={{
            padding: "10px 20px",
            border: "1px solid #4CAF50",
            borderRadius: "6px",
            background: "#fff",
            color: "#4CAF50",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          👁️ Preview Writing (1216)
        </button>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>
          <input
            type="checkbox"
            checked={useMockData}
            onChange={(e) => setUseMockData(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Use Mock Data
        </label>
      </div>

      {/* Preview Modal */}
      {previewType && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={handleClose}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "1400px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>
                Preview: TOEIC{" "}
                {previewType === "speaking" ? "Speaking" : "Writing"}
              </h3>
              <button
                onClick={handleClose}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "24px" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : (
                <PreviewContent
                  questions={questions}
                  previewType={previewType}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Component hiển thị content preview
 */
function PreviewContent({ questions, previewType }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [notes, setNotes] = useState({});
  const [essays, setEssays] = useState({});
  const [showNotes, setShowNotes] = useState({});
  const [isRecording, setIsRecording] = useState({});

  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>Không có dữ liệu</p>
      </div>
    );
  }

  const currentQuestion = questions[activeQuestionIndex];

  // Group questions by part
  const questionsByPart = {};
  questions.forEach((q) => {
    const partNum = q.part_number || 1;
    if (!questionsByPart[partNum]) {
      questionsByPart[partNum] = [];
    }
    questionsByPart[partNum].push(q);
  });

  const parts = Object.keys(questionsByPart)
    .map(Number)
    .sort((a, b) => a - b);
  const [activePart, setActivePart] = useState(parts[0] || 1);
  const partQuestions = questionsByPart[activePart] || [];

  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [activePart]);

  const currentPartQuestion = partQuestions[activeQuestionIndex];

  return (
    <div>
      {/* Part Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {parts.map((partNum) => (
          <button
            key={partNum}
            onClick={() => setActivePart(partNum)}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: activePart === partNum ? "#2196F3" : "#fff",
              color: activePart === partNum ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            Part {partNum}
          </button>
        ))}
      </div>

      {/* Question Navigation */}
      {partQuestions.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {partQuestions.map((q, index) => (
            <button
              key={q.question_id}
              onClick={() => setActiveQuestionIndex(index)}
              style={{
                padding: "6px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: activeQuestionIndex === index ? "#2196F3" : "#fff",
                color: activeQuestionIndex === index ? "#fff" : "#333",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Q{q.question_number}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      {currentPartQuestion && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "65% 35%",
            gap: "24px",
          }}
        >
          {/* LEFT: Question */}
          <div>
            <QuestionDisplay question={currentPartQuestion} />
          </div>

          {/* RIGHT: Answer Section */}
          <div>
            {previewType === "speaking" ? (
              <SpeakingAnswerSection
                question={currentPartQuestion}
                notes={notes[currentPartQuestion.question_id] || ""}
                setNotes={(text) =>
                  setNotes((prev) => ({
                    ...prev,
                    [currentPartQuestion.question_id]: text,
                  }))
                }
                showNotes={showNotes[currentPartQuestion.question_id] || false}
                setShowNotes={(show) =>
                  setShowNotes((prev) => ({
                    ...prev,
                    [currentPartQuestion.question_id]: show,
                  }))
                }
                isRecording={
                  isRecording[currentPartQuestion.question_id] || false
                }
                setIsRecording={(recording) =>
                  setIsRecording((prev) => ({
                    ...prev,
                    [currentPartQuestion.question_id]: recording,
                  }))
                }
              />
            ) : (
              <WritingAnswerSection
                question={currentPartQuestion}
                notes={notes[currentPartQuestion.question_id] || ""}
                setNotes={(text) =>
                  setNotes((prev) => ({
                    ...prev,
                    [currentPartQuestion.question_id]: text,
                  }))
                }
                essay={essays[currentPartQuestion.question_id] || ""}
                setEssay={(text) =>
                  setEssays((prev) => ({
                    ...prev,
                    [currentPartQuestion.question_id]: text,
                  }))
                }
                showNotes={showNotes[currentPartQuestion.question_id] || false}
                setShowNotes={(show) =>
                  setShowNotes((prev) => ({
                    ...prev,
                    [currentPartQuestion.question_id]: show,
                  }))
                }
              />
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      {partQuestions.length > 1 && (
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
              padding: "8px 16px",
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
              if (activeQuestionIndex < partQuestions.length - 1) {
                setActiveQuestionIndex(activeQuestionIndex + 1);
              }
            }}
            disabled={activeQuestionIndex === partQuestions.length - 1}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              background: "#2196F3",
              color: "#fff",
              cursor:
                activeQuestionIndex === partQuestions.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Tiếp theo →
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Hiển thị câu hỏi (text, image, email)
 */
function QuestionDisplay({ question }) {
  const { content, question_text, type } = question || {};

  // Read aloud - Text
  if (type === "read-aloud" && content?.text) {
    return (
      <div
        style={{
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          Read a text aloud
        </h3>
        <div
          style={{ fontSize: "15px", lineHeight: 1.6, whiteSpace: "pre-line" }}
        >
          {content.text}
        </div>
      </div>
    );
  }

  // Describe picture
  if (
    (type === "describe-picture" || question_text?.includes("picture")) &&
    content?.image_file
  ) {
    return (
      <div
        style={{
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          Describe a picture
        </h3>
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
    );
  }

  // Email
  if (type === "respond-email" || content?.email) {
    const email = content?.email || {};
    return (
      <div
        style={{
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          Respond to an email
        </h3>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
          <div>
            <strong>From:</strong> {email.from}
          </div>
          <div>
            <strong>To:</strong> {email.to}
          </div>
          <div>
            <strong>Subject:</strong> {email.subject}
          </div>
        </div>
        <div style={{ fontSize: "15px", whiteSpace: "pre-line" }}>
          {email.body || content?.text}
        </div>
      </div>
    );
  }

  // Default
  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      }}
    >
      <p>Type: {type || "unknown"}</p>
      {content?.text && <div>{content.text}</div>}
    </div>
  );
}

/**
 * Speaking Answer Section (Notes + Record)
 */
function SpeakingAnswerSection({
  question,
  notes,
  setNotes,
  showNotes,
  setShowNotes,
  isRecording,
  setIsRecording,
}) {
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
      <div style={{ fontSize: "18px", fontWeight: 600 }}>
        {question.question_number}
      </div>

      <button
        onClick={() => setShowNotes(!showNotes)}
        style={{
          padding: "8px 16px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          background: "#f9f9f9",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {showNotes ? "Ẩn ghi chú" : "Viết ghi chú / dàn ý"}
      </button>

      {showNotes && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Thêm ghi chú tại đây..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
      )}

      <button
        onClick={() => setIsRecording(!isRecording)}
        style={{
          padding: "12px 24px",
          border: "none",
          borderRadius: "6px",
          background: isRecording ? "#666" : "#f44336",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {isRecording ? "⏹ DỪNG LẠI" : "🎤 THU ÂM"}
      </button>

      {isRecording && (
        <div style={{ textAlign: "center", color: "#f44336", fontWeight: 600 }}>
          Đang ghi âm...
        </div>
      )}
    </div>
  );
}

/**
 * Writing Answer Section (Notes + Essay)
 */
function WritingAnswerSection({
  question,
  notes,
  setNotes,
  essay,
  setEssay,
  showNotes,
  setShowNotes,
}) {
  const getWordCount = (text) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
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
      <div style={{ fontSize: "18px", fontWeight: 600 }}>
        {question.question_number}
      </div>

      <button
        onClick={() => setShowNotes(!showNotes)}
        style={{
          padding: "8px 16px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          background: "#f9f9f9",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {showNotes ? "Ẩn ghi chú" : "Thêm ghi chú / dàn ý"}
      </button>

      {showNotes && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Thêm ghi chú tại đây..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
      )}

      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        placeholder="Viết essay tại đây..."
        style={{
          width: "100%",
          minHeight: "300px",
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          fontSize: "14px",
          resize: "vertical",
        }}
      />
      <div style={{ fontSize: "12px", color: "#666", textAlign: "right" }}>
        Word count: {getWordCount(essay)}
      </div>
    </div>
  );
}
