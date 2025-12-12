// WritingResult.jsx - Hiển thị kết quả chấm điểm Writing
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assessmentApi } from "../../../api/Assessment/assessmentApi";
import { useScoreWriting } from "../../../services/Assessment/assessmentMutations";
import "./WritingResult.css";

export default function WritingResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutateAsync: scoreWriting } = useScoreWriting();

  const {
    sessionId,
    testId,
    testTitle,
    submittedResponses = [], // Chưa chấm điểm
    questionsData = {},
    answers = {},
    allWritingQuestions = [], // Tổng số câu
  } = location.state || {};

  const [writingResults, setWritingResults] = useState([]);
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
          const scoreResult = await scoreWriting({
            response_id: response.response_id,
            type: "WRITING",
            text: response.written_text,
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
            `❌ [Writing] Error scoring question ${response.question_id}:`,
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
        setWritingResults([...results]); // Cập nhật ngay để hiển thị
      }

      setIsScoring(false);
      setWritingResults(results);

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
      const totalQuestions = allWritingQuestions.length;
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
      console.log("✅ [Writing] Session updated successfully");
    } catch (error) {
      console.error("❌ [Writing] Error updating session:", error);
    } finally {
      setIsUpdatingSession(false);
    }
  };

  if (submittedResponses.length === 0) {
    return (
      <div className="writing-result">
        <div className="writing-result__container">
          <div className="writing-result__error">
            <h2>Không có dữ liệu kết quả</h2>
            <button onClick={() => navigate("/exam")}>Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  const currentResult =
    writingResults[activeQuestionIndex] ||
    submittedResponses[activeQuestionIndex];
  const scoreData = currentResult?.score_result || {};
  const isCurrentScoring = isScoring && !currentResult?.score_result;

  // Tính tổng điểm trung bình
  const completedResults = writingResults.filter((r) => r.score_result);
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
    <div className="writing-result">
      <div className="writing-result__container">
        {/* Header */}
        <div className="writing-result__header">
          <h1 className="writing-result__title">Kết quả Writing</h1>
          <p className="writing-result__subtitle">
            {testTitle || "Writing Test"}
          </p>
        </div>

        {/* Progress Bar */}
        {isScoring && (
          <div className="writing-result__progress">
            <div className="writing-result__progress-bar">
              <div
                className="writing-result__progress-fill"
                style={{
                  width: `${
                    (scoringProgress.completed / scoringProgress.total) * 100
                  }%`,
                }}
              />
            </div>
            <div className="writing-result__progress-text">
              Đang chấm điểm: {scoringProgress.completed}/
              {scoringProgress.total} câu
            </div>
          </div>
        )}

        {/* Overall Score */}
        {!isScoring && completedResults.length > 0 && (
          <div className="writing-result__overall">
            <div className="writing-result__overall-score">
              <div
                className="writing-result__score-circle"
                style={{ borderColor: getScoreColor(averageScore) }}
              >
                <span className="writing-result__score-value">
                  {averageScore.toFixed(1)}
                </span>
                <span className="writing-result__score-label">/ 100</span>
              </div>
              <div className="writing-result__score-info">
                <h3>{getScoreLabel(averageScore)}</h3>
                <p>Điểm trung bình của {completedResults.length} câu hỏi</p>
              </div>
            </div>
          </div>
        )}

        {/* Question Navigation */}
        {submittedResponses.length > 1 && (
          <div className="writing-result__question-nav">
            {submittedResponses.map((response, index) => {
              const result = writingResults[index];
              const hasScore = !!result?.score_result;
              const isCurrentlyScoring = !hasScore && isScoring;

              return (
                <button
                  key={response.question_id}
                  className={`writing-result__question-tab ${
                    activeQuestionIndex === index ? "active" : ""
                  } ${isCurrentlyScoring ? "scoring" : ""}`}
                  onClick={() => setActiveQuestionIndex(index)}
                  disabled={isCurrentlyScoring}
                >
                  {isCurrentlyScoring ? (
                    <>
                      <span className="writing-result__spinner"></span>
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
          <div className="writing-result__detail">
            {/* Question Info */}
            <div className="writing-result__question-info">
              <h3>Câu hỏi {activeQuestionIndex + 1}</h3>
              <div className="writing-result__question-text">
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

            {/* Your Answer */}
            <div className="writing-result__your-answer">
              <h3>Bài viết của bạn</h3>
              <div className="writing-result__answer-text">
                {currentResult.written_text}
              </div>
              <div className="writing-result__word-count">
                Số từ:{" "}
                {
                  currentResult.written_text
                    .split(/\s+/)
                    .filter((w) => w.length > 0).length
                }
              </div>
            </div>

            {/* Loading State */}
            {isCurrentScoring && (
              <div className="writing-result__loading">
                <div className="writing-result__spinner-large"></div>
                <p>Đang chấm điểm câu hỏi này...</p>
              </div>
            )}

            {/* Scores Breakdown - Chỉ hiển thị khi đã chấm xong */}
            {!isCurrentScoring && scoreData.score !== undefined && (
              <>
                <div className="writing-result__scores">
                  <h3>Điểm chi tiết</h3>
                  <div className="writing-result__scores-grid">
                    <div className="writing-result__score-item">
                      <div className="writing-result__score-label">
                        Tổng điểm
                      </div>
                      <div
                        className="writing-result__score-value-large"
                        style={{ color: getScoreColor(scoreData.score || 0) }}
                      >
                        {scoreData.score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="writing-result__score-item">
                      <div className="writing-result__score-label">
                        Ngữ pháp
                      </div>
                      <div className="writing-result__score-value">
                        {scoreData.grammar_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="writing-result__score-item">
                      <div className="writing-result__score-label">Từ vựng</div>
                      <div className="writing-result__score-value">
                        {scoreData.vocabulary_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="writing-result__score-item">
                      <div className="writing-result__score-label">
                        Mạch lạc
                      </div>
                      <div className="writing-result__score-value">
                        {scoreData.coherence_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="writing-result__score-item">
                      <div className="writing-result__score-label">
                        Hoàn thành nhiệm vụ
                      </div>
                      <div className="writing-result__score-value">
                        {scoreData.task_completion_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="writing-result__score-item">
                      <div className="writing-result__score-label">
                        Chính tả
                      </div>
                      <div className="writing-result__score-value">
                        {scoreData.spelling_score?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {scoreData.feedback && (
                  <div className="writing-result__feedback">
                    <h3>Nhận xét tổng quan</h3>
                    <div className="writing-result__feedback-text">
                      {scoreData.feedback}
                    </div>
                  </div>
                )}

                {/* Detailed Feedback */}
                {scoreData.detailed_feedback && (
                  <div className="writing-result__detailed-feedback">
                    <h3>Nhận xét chi tiết</h3>

                    {scoreData.detailed_feedback.grammar && (
                      <div className="writing-result__feedback-section">
                        <h4>
                          Ngữ pháp (
                          {scoreData.detailed_feedback.grammar.score || "N/A"})
                        </h4>
                        {scoreData.detailed_feedback.grammar.issues?.length >
                          0 && (
                          <ul>
                            {scoreData.detailed_feedback.grammar.issues.map(
                              (issue, idx) => (
                                <li key={idx}>{issue}</li>
                              )
                            )}
                          </ul>
                        )}
                        {scoreData.detailed_feedback.grammar.suggestions
                          ?.length > 0 && (
                          <div className="writing-result__suggestions">
                            <strong>Gợi ý:</strong>
                            <ul>
                              {scoreData.detailed_feedback.grammar.suggestions.map(
                                (suggestion, idx) => (
                                  <li key={idx}>{suggestion}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {scoreData.detailed_feedback.vocabulary && (
                      <div className="writing-result__feedback-section">
                        <h4>
                          Từ vựng (
                          {scoreData.detailed_feedback.vocabulary.score ||
                            "N/A"}
                          )
                        </h4>
                        {scoreData.detailed_feedback.vocabulary.suggestions && (
                          <p>
                            {scoreData.detailed_feedback.vocabulary.suggestions}
                          </p>
                        )}
                        {scoreData.detailed_feedback.vocabulary
                          .diversity_ratio && (
                          <p>
                            Độ đa dạng từ vựng:{" "}
                            {(
                              scoreData.detailed_feedback.vocabulary
                                .diversity_ratio * 100
                            ).toFixed(1)}
                            %
                          </p>
                        )}
                      </div>
                    )}

                    {scoreData.detailed_feedback.coherence && (
                      <div className="writing-result__feedback-section">
                        <h4>
                          Mạch lạc (
                          {scoreData.detailed_feedback.coherence.score || "N/A"}
                          )
                        </h4>
                        {scoreData.detailed_feedback.coherence.issues?.length >
                          0 && (
                          <ul>
                            {scoreData.detailed_feedback.coherence.issues.map(
                              (issue, idx) => (
                                <li key={idx}>{issue}</li>
                              )
                            )}
                          </ul>
                        )}
                        {scoreData.detailed_feedback.coherence.suggestions
                          ?.length > 0 && (
                          <div className="writing-result__suggestions">
                            <strong>Gợi ý:</strong>
                            <ul>
                              {scoreData.detailed_feedback.coherence.suggestions.map(
                                (suggestion, idx) => (
                                  <li key={idx}>{suggestion}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {scoreData.detailed_feedback.task_completion && (
                      <div className="writing-result__feedback-section">
                        <h4>
                          Hoàn thành nhiệm vụ (
                          {scoreData.detailed_feedback.task_completion.score ||
                            "N/A"}
                          )
                        </h4>
                        {scoreData.detailed_feedback.task_completion
                          .word_count && (
                          <p>
                            Số từ:{" "}
                            {
                              scoreData.detailed_feedback.task_completion
                                .word_count
                            }
                          </p>
                        )}
                        {scoreData.detailed_feedback.task_completion.issues
                          ?.length > 0 && (
                          <ul>
                            {scoreData.detailed_feedback.task_completion.issues.map(
                              (issue, idx) => (
                                <li key={idx}>{issue}</li>
                              )
                            )}
                          </ul>
                        )}
                        {scoreData.detailed_feedback.task_completion
                          .suggestions && (
                          <p>
                            <strong>Gợi ý:</strong>{" "}
                            {
                              scoreData.detailed_feedback.task_completion
                                .suggestions
                            }
                          </p>
                        )}
                      </div>
                    )}

                    {scoreData.detailed_feedback.spelling && (
                      <div className="writing-result__feedback-section">
                        <h4>
                          Chính tả (
                          {scoreData.detailed_feedback.spelling.score || "N/A"})
                        </h4>
                        {scoreData.detailed_feedback.spelling.errors?.length >
                          0 && (
                          <ul>
                            {scoreData.detailed_feedback.spelling.errors.map(
                              (error, idx) => (
                                <li key={idx}>{error}</li>
                              )
                            )}
                          </ul>
                        )}
                        {scoreData.detailed_feedback.spelling.suggestions && (
                          <p>
                            <strong>Gợi ý:</strong>{" "}
                            {scoreData.detailed_feedback.spelling.suggestions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Text Statistics */}
                {scoreData.text_stats && (
                  <div className="writing-result__stats">
                    <h3>Thống kê bài viết</h3>
                    <div className="writing-result__stats-grid">
                      <div className="writing-result__stat-item">
                        <span className="writing-result__stat-label">
                          Số từ:
                        </span>
                        <span className="writing-result__stat-value">
                          {scoreData.text_stats.word_count || 0}
                        </span>
                      </div>
                      <div className="writing-result__stat-item">
                        <span className="writing-result__stat-label">
                          Số câu:
                        </span>
                        <span className="writing-result__stat-value">
                          {scoreData.text_stats.sentence_count || 0}
                        </span>
                      </div>
                      <div className="writing-result__stat-item">
                        <span className="writing-result__stat-label">
                          Từ duy nhất:
                        </span>
                        <span className="writing-result__stat-value">
                          {scoreData.text_stats.unique_words || 0}
                        </span>
                      </div>
                      <div className="writing-result__stat-item">
                        <span className="writing-result__stat-label">
                          Độ đa dạng:
                        </span>
                        <span className="writing-result__stat-value">
                          {scoreData.text_stats.diversity_ratio
                            ? (
                                scoreData.text_stats.diversity_ratio * 100
                              ).toFixed(1) + "%"
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        {!isScoring && (
          <div className="writing-result__actions">
            <button
              className="writing-result__btn writing-result__btn--secondary"
              onClick={() => navigate("/exam")}
            >
              Quay lại danh sách
            </button>
            <button
              className="writing-result__btn writing-result__btn--primary"
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
