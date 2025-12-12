// SpeakingResult.jsx - Hiển thị kết quả chấm điểm Speaking
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assessmentApi } from "../../../api/Assessment/assessmentApi";
import { useScoreSpeaking } from "../../../services/Assessment/assessmentMutations";
import "./SpeakingResult.css";

export default function SpeakingResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutateAsync: scoreSpeaking } = useScoreSpeaking();

  const {
    sessionId,
    testId,
    testTitle,
    submittedResponses = [], // Chưa chấm điểm
    questionsData = {},
    answers = {},
    allSpeakingQuestions = [], // Tổng số câu
  } = location.state || {};

  const [speakingResults, setSpeakingResults] = useState([]);
  const [scoringProgress, setScoringProgress] = useState({
    completed: 0,
    total: submittedResponses.length,
  });
  const [isScoring, setIsScoring] = useState(true);
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Chấm điểm từng câu khi component mount
  useEffect(() => {
    if (submittedResponses.length === 0) {
      setIsScoring(false);
      return;
    }

    const scoreAllQuestions = async () => {
      const results = [];
      let completedCount = 0;

      // Chấm điểm từng câu (có thể parallel nhưng để hiển thị progress thì tuần tự)
      for (let i = 0; i < submittedResponses.length; i++) {
        const response = submittedResponses[i];

        try {
          const scoreResult = await scoreSpeaking({
            response_id: response.response_id,
            type: "SPEAKING",
            audio_file_path: response.audio_file_path,
            language: "en",
          });

          if (scoreResult.EC === "0") {
            results.push({
              ...response,
              score_result: scoreResult.DT,
            });
          } else {
            // Nếu chấm điểm thất bại, vẫn thêm vào nhưng không có score_result
            results.push({
              ...response,
              score_result: null,
            });
          }
        } catch (error) {
          console.error(
            `❌ [Speaking] Error scoring question ${response.question_id}:`,
            error
          );
          results.push({
            ...response,
            score_result: null,
          });
        }

        completedCount++;
        setScoringProgress({
          completed: completedCount,
          total: submittedResponses.length,
        });
        setSpeakingResults([...results]); // Cập nhật ngay để hiển thị
      }

      setIsScoring(false);
      setSpeakingResults(results);

      // Sau khi chấm xong tất cả, cập nhật exam_session
      await updateExamSession(results);
    };

    scoreAllQuestions();
  }, []);

  // Cập nhật exam_session sau khi chấm xong
  const updateExamSession = async (results) => {
    if (!sessionId) return;

    setIsUpdatingSession(true);

    try {
      // Tính điểm: câu đúng = full điểm (>= 60), câu sai = 0 (< 60), câu bỏ qua = 0
      const totalQuestions = allSpeakingQuestions.length;
      let correctAnswers = 0;
      let wrongAnswers = 0;
      let totalScore = 0;

      results.forEach((result) => {
        const score = result.score_result?.score || 0;
        totalScore += score;
        if (score >= 60) {
          correctAnswers++;
        } else if (score > 0) {
          wrongAnswers++;
        }
        // Câu bỏ qua (score = 0) không tính vào wrongAnswers
      });

      // Tính điểm trung bình (0-100)
      const averageScore =
        results.length > 0 ? Math.round(totalScore / results.length) : 0;

      // Gọi API cập nhật session
      const updateData = {
        status: "COMPLETED",
        total_score: averageScore,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
      };

      await assessmentApi.updateExamSession(sessionId, updateData);
      console.log("✅ [Speaking] Session updated successfully");
    } catch (error) {
      console.error("❌ [Speaking] Error updating session:", error);
    } finally {
      setIsUpdatingSession(false);
    }
  };

  if (submittedResponses.length === 0) {
    return (
      <div className="speaking-result">
        <div className="speaking-result__container">
          <div className="speaking-result__error">
            <h2>Không có dữ liệu kết quả</h2>
            <button onClick={() => navigate("/exam")}>Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  const currentResult =
    speakingResults[activeQuestionIndex] ||
    submittedResponses[activeQuestionIndex];
  const scoreData = currentResult?.score_result || {};
  const isCurrentScoring = isScoring && !currentResult?.score_result;

  // Tính tổng điểm trung bình
  const completedResults = speakingResults.filter((r) => r.score_result);
  const averageScore =
    completedResults.length > 0
      ? completedResults.reduce(
          (sum, r) => sum + (r.score_result?.score || 0),
          0
        ) / completedResults.length
      : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return "#10B981"; // Green
    if (score >= 60) return "#F59E0B"; // Orange
    return "#EF4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Xuất sắc";
    if (score >= 80) return "Tốt";
    if (score >= 70) return "Khá";
    if (score >= 60) return "Trung bình";
    return "Cần cải thiện";
  };

  return (
    <div className="speaking-result">
      <div className="speaking-result__container">
        {/* Header */}
        <div className="speaking-result__header">
          <h1 className="speaking-result__title">Kết quả Speaking</h1>
          <p className="speaking-result__subtitle">
            {testTitle || "Speaking Test"}
          </p>
        </div>

        {/* Progress Bar */}
        {isScoring && (
          <div className="speaking-result__progress">
            <div className="speaking-result__progress-bar">
              <div
                className="speaking-result__progress-fill"
                style={{
                  width: `${
                    (scoringProgress.completed / scoringProgress.total) * 100
                  }%`,
                }}
              />
            </div>
            <div className="speaking-result__progress-text">
              Đang chấm điểm: {scoringProgress.completed}/
              {scoringProgress.total} câu
            </div>
          </div>
        )}

        {/* Overall Score */}
        {!isScoring && completedResults.length > 0 && (
          <div className="speaking-result__overall">
            <div className="speaking-result__overall-score">
              <div
                className="speaking-result__score-circle"
                style={{ borderColor: getScoreColor(averageScore) }}
              >
                <span className="speaking-result__score-value">
                  {averageScore.toFixed(1)}
                </span>
                <span className="speaking-result__score-label">/ 100</span>
              </div>
              <div className="speaking-result__score-info">
                <h3>{getScoreLabel(averageScore)}</h3>
                <p>Điểm trung bình của {completedResults.length} câu hỏi</p>
              </div>
            </div>
          </div>
        )}

        {/* Question Navigation */}
        {submittedResponses.length > 1 && (
          <div className="speaking-result__question-nav">
            {submittedResponses.map((response, index) => {
              const result = speakingResults[index];
              const hasScore = !!result?.score_result;
              const isCurrentlyScoring = !hasScore && isScoring;

              return (
                <button
                  key={response.question_id}
                  className={`speaking-result__question-tab ${
                    activeQuestionIndex === index ? "active" : ""
                  } ${isCurrentlyScoring ? "scoring" : ""}`}
                  onClick={() => setActiveQuestionIndex(index)}
                  disabled={isCurrentlyScoring}
                >
                  {isCurrentlyScoring ? (
                    <>
                      <span className="speaking-result__spinner"></span>
                      Câu {index + 1}
                    </>
                  ) : (
                    `Câu ${index + 1}${
                      hasScore
                        ? ` (${result.score_result.score.toFixed(1)})`
                        : ""
                    }`
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Detailed Result for Current Question */}
        {currentResult && (
          <div className="speaking-result__detail">
            {/* Question Info */}
            <div className="speaking-result__question-info">
              <h3>Câu hỏi {activeQuestionIndex + 1}</h3>
              <div className="speaking-result__question-text">
                {(() => {
                  let questionText = "";
                  Object.values(questionsData).forEach((partQuestions) => {
                    if (Array.isArray(partQuestions)) {
                      const q = partQuestions.find(
                        (q) => q.question_id === currentResult.question_id
                      );
                      if (q) {
                        questionText = q.question_text || q.content?.text || "";
                      }
                    }
                  });
                  return questionText || "Nội dung câu hỏi";
                })()}
              </div>
            </div>

            {/* Your Transcript */}
            <div className="speaking-result__your-answer">
              <h3>Bản ghi âm của bạn</h3>
              <div className="speaking-result__transcript">
                {currentResult.transcription || scoreData.transcript || "Chưa có bản ghi"}
              </div>
            </div>

            {/* Loading State */}
            {isCurrentScoring && (
              <div className="speaking-result__loading">
                <div className="speaking-result__spinner-large"></div>
                <p>Đang chấm điểm câu hỏi này...</p>
              </div>
            )}

            {/* Scores Breakdown - Chỉ hiển thị khi đã chấm xong */}
            {!isCurrentScoring && scoreData.score !== undefined && (
              <>
                <div className="speaking-result__scores">
                  <h3>Điểm chi tiết</h3>
                  <div className="speaking-result__scores-grid">
                    <div className="speaking-result__score-item">
                      <div className="speaking-result__score-label">
                        Tổng điểm
                      </div>
                      <div
                        className="speaking-result__score-value-large"
                        style={{ color: getScoreColor(scoreData.score || 0) }}
                      >
                        {scoreData.score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="speaking-result__score-item">
                      <div className="speaking-result__score-label">
                        Phát âm
                      </div>
                      <div className="speaking-result__score-value">
                        {scoreData.pronunciation_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="speaking-result__score-item">
                      <div className="speaking-result__score-label">
                        Độ trôi chảy
                      </div>
                      <div className="speaking-result__score-value">
                        {scoreData.fluency_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="speaking-result__score-item">
                      <div className="speaking-result__score-label">
                        Ngữ điệu
                      </div>
                      <div className="speaking-result__score-value">
                        {scoreData.prosody_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {scoreData.feedback && (
                  <div className="speaking-result__feedback">
                    <h3>Nhận xét tổng quan</h3>
                    <div className="speaking-result__feedback-text">
                      {scoreData.feedback}
                    </div>
                  </div>
                )}

                {/* Detailed Feedback */}
                {scoreData.detailed_feedback && (
                  <div className="speaking-result__detailed-feedback">
                    <h3>Nhận xét chi tiết</h3>

                    {scoreData.detailed_feedback.pronunciation && (
                      <div className="speaking-result__feedback-section">
                        <h4>
                          Phát âm (
                          {scoreData.detailed_feedback.pronunciation || "N/A"})
                        </h4>
                      </div>
                    )}

                    {scoreData.detailed_feedback.fluency && (
                      <div className="speaking-result__feedback-section">
                        <h4>
                          Độ trôi chảy (
                          {scoreData.detailed_feedback.fluency || "N/A"})
                        </h4>
                      </div>
                    )}

                    {scoreData.detailed_feedback.prosody && (
                      <div className="speaking-result__feedback-section">
                        <h4>
                          Ngữ điệu (
                          {scoreData.detailed_feedback.prosody || "N/A"})
                        </h4>
                      </div>
                    )}
                  </div>
                )}

                {/* Word Accuracy */}
                {scoreData.word_accuracy && Object.keys(scoreData.word_accuracy).length > 0 && (
                  <div className="speaking-result__word-accuracy">
                    <h3>Độ chính xác từng từ</h3>
                    <div className="speaking-result__word-list">
                      {Object.entries(scoreData.word_accuracy).map(
                        ([word, data]) => (
                          <div key={word} className="speaking-result__word-item">
                            <div className="speaking-result__word-header">
                              <span className="speaking-result__word-text">
                                {word}
                              </span>
                              <span
                                className="speaking-result__word-score"
                                style={{
                                  color: getScoreColor(data.score * 10),
                                }}
                              >
                                {data.score.toFixed(1)}/10
                              </span>
                            </div>
                            {data.issues && data.issues.length > 0 && (
                              <div className="speaking-result__word-issues">
                                <strong>Vấn đề:</strong>
                                <ul>
                                  {data.issues.map((issue, idx) => (
                                    <li key={idx}>{issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {data.tips && data.tips.length > 0 && (
                              <div className="speaking-result__word-tips">
                                <strong>Gợi ý:</strong>
                                <ul>
                                  {data.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Word Feedback (Words needing improvement) */}
                {scoreData.word_feedback &&
                  scoreData.word_feedback.length > 0 && (
                    <div className="speaking-result__word-feedback">
                      <h3>Từ cần cải thiện</h3>
                      <div className="speaking-result__word-feedback-list">
                        {scoreData.word_feedback.map((wordData, idx) => (
                          <div
                            key={idx}
                            className="speaking-result__word-feedback-item"
                          >
                            <div className="speaking-result__word-feedback-header">
                              <span className="speaking-result__word-feedback-text">
                                {wordData.word}
                              </span>
                              <span
                                className="speaking-result__word-feedback-score"
                                style={{
                                  color: getScoreColor(wordData.score * 10),
                                }}
                              >
                                {wordData.score.toFixed(1)}/10
                              </span>
                            </div>
                            {wordData.issues && wordData.issues.length > 0 && (
                              <div className="speaking-result__word-feedback-issues">
                                <strong>Vấn đề:</strong>
                                <ul>
                                  {wordData.issues.map((issue, issueIdx) => (
                                    <li key={issueIdx}>{issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {wordData.tips && wordData.tips.length > 0 && (
                              <div className="speaking-result__word-feedback-tips">
                                <strong>Gợi ý:</strong>
                                <ul>
                                  {wordData.tips.map((tip, tipIdx) => (
                                    <li key={tipIdx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        {!isScoring && (
          <div className="speaking-result__actions">
            <button
              className="speaking-result__btn speaking-result__btn--secondary"
              onClick={() => navigate("/exam")}
            >
              Quay lại danh sách
            </button>
            <button
              className="speaking-result__btn speaking-result__btn--primary"
              onClick={() => navigate(-1)}
            >
              Xem lại bài làm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

