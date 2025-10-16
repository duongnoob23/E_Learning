// Result.jsx
import React, { useMemo, useState } from "react";
import "../AssessmentCSS/Result.css";

/**
 * Single-file UI for Assessment Result (contains ResultSummary & ResultAnalysis as inner components)
 * - Font: Roboto
 * - Flexbox only
 * - BEM classnames
 *
 * Integration notes:
 * - Replace fakeNavigate with react-router's useNavigate when integrating to actual router.
 * - This file expects Result.css to be present in same folder.
 */

/* Mock data (use real prop or API call in real use) */
const MOCK_DATA = {
  testId: "T2025-NE01",
  testTitle: "New Economy TOEIC Full Test 1",
  mode: "Luyện đề đầy đủ",
  durationMin: 120,
  timeTakenSeconds: 6723,
  answeredCount: 185,
  totalQuestions: 200,
  correctCount: 142,
  wrongCount: 43,
  skippedCount: 15,
  accuracyPct: 71.0,
  parts: [
    {
      part: 1,
      questionsCount: 6,
      tags: [
        {
          tagId: "p1-photo-people",
          tagName: "[Part 1] Tranh tả người",
          total: 4,
          correct: 3,
          wrong: 1,
          skipped: 0,
          accuracyPct: 75.0,
          questionIds: [
            { id: 1, status: "correct" },
            { id: 2, status: "wrong" },
            { id: 3, status: "correct" },
            { id: 4, status: "correct" },
          ],
        },
        {
          tagId: "p1-photo-objects",
          tagName: "[Part 1] Tranh tả vật",
          total: 2,
          correct: 1,
          wrong: 1,
          skipped: 0,
          accuracyPct: 50.0,
          questionIds: [
            { id: 5, status: "wrong" },
            { id: 6, status: "correct" },
          ],
        },
      ],
    },
    {
      part: 2,
      questionsCount: 25,
      tags: [
        {
          tagId: "p2-response-wh",
          tagName: "[Part 2] Câu hỏi WH",
          total: 10,
          correct: 8,
          wrong: 2,
          skipped: 0,
          accuracyPct: 80.0,
          questionIds: Array.from({ length: 10 }, (_, i) => ({
            id: 7 + i,
            status: i < 8 ? "correct" : "wrong",
          })),
        },
        {
          tagId: "p2-response-yesno",
          tagName: "[Part 2] Câu hỏi Yes/No",
          total: 10,
          correct: 7,
          wrong: 2,
          skipped: 1,
          accuracyPct: 70.0,
          questionIds: Array.from({ length: 10 }, (_, i) => ({
            id: 17 + i,
            status: i < 7 ? "correct" : i === 9 ? "skipped" : "wrong",
          })),
        },
        {
          tagId: "p2-response-statement",
          tagName: "[Part 2] Câu khẳng định / mệnh lệnh",
          total: 5,
          correct: 3,
          wrong: 2,
          skipped: 0,
          accuracyPct: 60.0,
          questionIds: Array.from({ length: 5 }, (_, i) => ({
            id: 27 + i,
            status: i < 3 ? "correct" : "wrong",
          })),
        },
      ],
    },
    {
      part: 3,
      questionsCount: 39,
      tags: [
        {
          tagId: "p3-conversation-topic",
          tagName: "[Part 3] Chủ đề hội thoại",
          total: 20,
          correct: 15,
          wrong: 3,
          skipped: 2,
          accuracyPct: 75.0,
          questionIds: Array.from({ length: 20 }, (_, i) => ({
            id: 32 + i,
            status: i < 15 ? "correct" : i < 18 ? "wrong" : "skipped",
          })),
        },
        {
          tagId: "p3-inference",
          tagName: "[Part 3] Suy luận ngữ cảnh",
          total: 19,
          correct: 12,
          wrong: 5,
          skipped: 2,
          accuracyPct: 63.2,
          questionIds: Array.from({ length: 19 }, (_, i) => ({
            id: 52 + i,
            status: i < 12 ? "correct" : i < 17 ? "wrong" : "skipped",
          })),
        },
      ],
    },
    {
      part: 4,
      questionsCount: 30,
      tags: [
        {
          tagId: "p4-announcement",
          tagName: "[Part 4] Đoạn thông báo",
          total: 15,
          correct: 10,
          wrong: 4,
          skipped: 1,
          accuracyPct: 66.6,
          questionIds: Array.from({ length: 15 }, (_, i) => ({
            id: 71 + i,
            status: i < 10 ? "correct" : i < 14 ? "wrong" : "skipped",
          })),
        },
        {
          tagId: "p4-report",
          tagName: "[Part 4] Báo cáo / Thuyết trình",
          total: 15,
          correct: 9,
          wrong: 5,
          skipped: 1,
          accuracyPct: 60.0,
          questionIds: Array.from({ length: 15 }, (_, i) => ({
            id: 86 + i,
            status: i < 9 ? "correct" : i < 14 ? "wrong" : "skipped",
          })),
        },
      ],
    },
    {
      part: 5,
      questionsCount: 30,
      tags: [
        {
          tagId: "p5-vocab",
          tagName: "[Part 5] Từ vựng chọn từ",
          total: 10,
          correct: 6,
          wrong: 4,
          skipped: 0,
          accuracyPct: 60.0,
          questionIds: Array.from({ length: 10 }, (_, i) => ({
            id: 101 + i,
            status: i < 6 ? "correct" : "wrong",
          })),
        },
        {
          tagId: "p5-grammar",
          tagName: "[Part 5] Ngữ pháp trắc nghiệm",
          total: 20,
          correct: 12,
          wrong: 7,
          skipped: 1,
          accuracyPct: 60.0,
          questionIds: Array.from({ length: 20 }, (_, i) => ({
            id: 111 + i,
            status: i < 12 ? "correct" : i < 19 ? "wrong" : "skipped",
          })),
        },
      ],
    },
    {
      part: 6,
      questionsCount: 16,
      tags: [
        {
          tagId: "p6-text-completion",
          tagName: "[Part 6] Điền từ vào đoạn văn",
          total: 16,
          correct: 11,
          wrong: 3,
          skipped: 2,
          accuracyPct: 68.7,
          questionIds: Array.from({ length: 16 }, (_, i) => ({
            id: 131 + i,
            status: i < 11 ? "correct" : i < 14 ? "wrong" : "skipped",
          })),
        },
      ],
    },
    {
      part: 7,
      questionsCount: 54,
      tags: [
        {
          tagId: "p7-single-passage",
          tagName: "[Part 7] Đọc đoạn đơn",
          total: 29,
          correct: 20,
          wrong: 6,
          skipped: 3,
          accuracyPct: 69.0,
          questionIds: Array.from({ length: 29 }, (_, i) => ({
            id: 147 + i,
            status: i < 20 ? "correct" : i < 26 ? "wrong" : "skipped",
          })),
        },
        {
          tagId: "p7-double-passage",
          tagName: "[Part 7] Đọc đoạn đôi",
          total: 15,
          correct: 10,
          wrong: 4,
          skipped: 1,
          accuracyPct: 66.6,
          questionIds: Array.from({ length: 15 }, (_, i) => ({
            id: 176 + i,
            status: i < 10 ? "correct" : i < 14 ? "wrong" : "skipped",
          })),
        },
        {
          tagId: "p7-triple-passage",
          tagName: "[Part 7] Đọc đoạn ba",
          total: 10,
          correct: 7,
          wrong: 3,
          skipped: 0,
          accuracyPct: 70.0,
          questionIds: Array.from({ length: 10 }, (_, i) => ({
            id: 191 + i,
            status: i < 7 ? "correct" : "wrong",
          })),
        },
      ],
    },
  ],
  answers: {},
};

// const MOCK_DATA = {
//   testId: "T2025-NE01",
//   testTitle: "New Economy TOEIC Full Test 1",
//   mode: "Luyện đề đầy đủ",
//   durationMin: 120,
//   timeTakenSeconds: 6723,
//   answeredCount: 185,
//   totalQuestions: 200,
//   correctCount: 142,
//   wrongCount: 43,
//   skippedCount: 15,
//   accuracyPct: 71.0,
//   parts: [
//     // ======================
//     // 📘 PART 1
//     // ======================
//     {
//       part: 1,
//       questionsCount: 6,
//       tags: [
//         {
//           tagId: "p1-photo-people",
//           tagName: "[Part 1] Tranh tả người",
//           total: 3,
//           correct: 2,
//           wrong: 1,
//           skipped: 0,
//           accuracyPct: 66.7,
//           questionIds: [
//             { id: 1, status: "correct" },
//             { id: 2, status: "wrong" },
//             { id: 3, status: "correct" },
//           ],
//         },
//         {
//           tagId: "p1-photo-both",
//           tagName: "[Part 1] Tranh tả cả người và vật",
//           total: 3,
//           correct: 2,
//           wrong: 1,
//           skipped: 0,
//           accuracyPct: 66.7,
//           questionIds: [
//             { id: 4, status: "correct" },
//             { id: 5, status: "correct" },
//             { id: 6, status: "wrong" },
//           ],
//         },
//       ],
//     },

//     // ======================
//     // 📘 PART 2
//     // ======================
//     {
//       part: 2,
//       questionsCount: 25,
//       tags: [
//         ...[
//           "WHAT",
//           "WHO",
//           "WHERE",
//           "WHEN",
//           "HOW",
//           "WHY",
//           "YES/NO",
//           "Đuôi",
//           "Yêu cầu/Đề nghị",
//           "Trần thuật",
//         ].map((type, index) => {
//           const baseId = 7 + index * 2;
//           return {
//             tagId: `p2-${type.toLowerCase().replace(/[ /]/g, "-")}`,
//             tagName: `[Part 2] Câu hỏi ${type}`,
//             total: 2,
//             correct: index % 3 !== 0 ? 2 : 1,
//             wrong: index % 3 === 0 ? 1 : 0,
//             skipped: 0,
//             accuracyPct: index % 3 === 0 ? 50.0 : 100.0,
//             questionIds: [
//               { id: baseId, status: index % 3 === 0 ? "wrong" : "correct" },
//               { id: baseId + 1, status: "correct" },
//             ],
//           };
//         }),
//       ],
//     },

//     // ======================
//     // 📘 PART 3
//     // ======================
//     {
//       part: 3,
//       questionsCount: 39,
//       tags: [
//         "Chủ đề, mục đích",
//         "Danh tính người nói",
//         "Chi tiết hội thoại",
//         "Hành động tương lai",
//         "Kết hợp bảng biểu",
//         "Hàm ý câu nói",
//         "Company - General Office Work",
//         "Company - Business, Marketing",
//         "Company - Facility",
//         "Shopping, Service",
//         "Order, delivery",
//         "Transportation",
//         "Housing",
//         "Yêu cầu, gợi ý",
//       ].map((label, index) => {
//         const total = 3;
//         const baseId = 27 + index * total;
//         const correct = total - 1;
//         return {
//           tagId: `p3-${index + 1}`,
//           tagName: `[Part 3] ${label}`,
//           total,
//           correct,
//           wrong: 1,
//           skipped: 0,
//           accuracyPct: 66.7,
//           questionIds: [
//             { id: baseId, status: "correct" },
//             { id: baseId + 1, status: "correct" },
//             { id: baseId + 2, status: "wrong" },
//           ],
//         };
//       }),
//     },

//     // ======================
//     // 📘 PART 4
//     // ======================
//     {
//       part: 4,
//       questionsCount: 30,
//       tags: [
//         "Chủ đề, mục đích",
//         "Chi tiết",
//         "Hành động tương lai",
//         "Kết hợp bảng biểu",
//         "Hàm ý câu nói",
//         "Advertisement - Quảng cáo",
//         "Announcement - Thông báo",
//         "News report - Bản tin",
//         "Talk - Bài phát biểu",
//         "Meeting excerpt",
//         "Câu hỏi yêu cầu, gợi ý",
//       ].map((label, index) => {
//         const total = 3;
//         const baseId = 69 + index * total;
//         return {
//           tagId: `p4-${index + 1}`,
//           tagName: `[Part 4] ${label}`,
//           total,
//           correct: 2,
//           wrong: 1,
//           skipped: 0,
//           accuracyPct: 66.7,
//           questionIds: [
//             { id: baseId, status: "correct" },
//             { id: baseId + 1, status: "correct" },
//             { id: baseId + 2, status: "wrong" },
//           ],
//         };
//       }),
//     },

//     // ======================
//     // 📘 PART 5
//     // ======================
//     {
//       part: 5,
//       questionsCount: 30,
//       tags: [
//         "Từ loại",
//         "Ngữ pháp",
//         "Từ vựng",
//         "Danh từ",
//         "Đại từ",
//         "Tính từ",
//         "Thì",
//         "Thể",
//         "Trạng từ",
//         "Động từ nguyên mẫu",
//         "Phân từ và cấu trúc phân từ",
//         "Giới từ",
//         "Liên từ",
//       ].map((label, index) => {
//         const total = 2;
//         const baseId = 102 + index * total;
//         return {
//           tagId: `p5-${index + 1}`,
//           tagName: `[Part 5] ${label}`,
//           total,
//           correct: 1,
//           wrong: 1,
//           skipped: 0,
//           accuracyPct: 50.0,
//           questionIds: [
//             { id: baseId, status: "correct" },
//             { id: baseId + 1, status: "wrong" },
//           ],
//         };
//       }),
//     },

//     // ======================
//     // 📘 PART 6
//     // ======================
//     {
//       part: 6,
//       questionsCount: 16,
//       tags: [
//         "Từ loại",
//         "Ngữ pháp",
//         "Từ vựng",
//         "Điền câu vào đoạn văn",
//         "Email/Letter",
//         "Advertisement",
//         "Notice/Announcement",
//         "Động từ nguyên mẫu có to",
//         "Danh động từ",
//         "Câu điều kiện",
//       ].map((label, index) => {
//         const total = 1 + (index % 2);
//         const baseId = 128 + index * 2;
//         return {
//           tagId: `p6-${index + 1}`,
//           tagName: `[Part 6] ${label}`,
//           total,
//           correct: total - 0,
//           wrong: 0,
//           skipped: 0,
//           accuracyPct: 100.0,
//           questionIds: Array.from({ length: total }, (_, i) => ({
//             id: baseId + i,
//             status: "correct",
//           })),
//         };
//       }),
//     },

//     // ======================
//     // 📘 PART 7
//     // ======================
//     {
//       part: 7,
//       questionsCount: 54,
//       tags: [
//         "Tìm thông tin",
//         "Tìm chi tiết sai",
//         "Chủ đề, mục đích",
//         "Suy luận",
//         "Điền câu",
//         "Một đoạn",
//         "Nhiều đoạn",
//         "Email/Letter",
//         "Form",
//         "Article/Review",
//         "Advertisement",
//         "Text message chain",
//         "Schedule",
//         "Instructions",
//         "Hàm ý câu nói",
//       ].map((label, index) => {
//         const total = 3 + (index % 2);
//         const baseId = 150 + index * total;
//         return {
//           tagId: `p7-${index + 1}`,
//           tagName: `[Part 7] ${label}`,
//           total,
//           correct: total - 1,
//           wrong: 1,
//           skipped: 0,
//           accuracyPct: (((total - 1) / total) * 100).toFixed(1),
//           questionIds: Array.from({ length: total }, (_, i) => ({
//             id: baseId + i,
//             status: i < total - 1 ? "correct" : "wrong",
//           })),
//         };
//       }),
//     },
//   ],
//   answers: {},
// };

/* Helper + fake navigate */
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
function fakeNavigate(path, options) {
  console.log("navigate ->", path, options);
  alert(`Navigate: ${path}\n${JSON.stringify(options?.state || {}, null, 2)}`);
}

/* ResultSummary component */
function ResultSummary({ data, onViewAnswers, onBackToAssessment }) {
  return (
    <div
      className="assessment-result__summary result-summary"
      role="region"
      aria-label="Tổng quan kết quả"
    >
      <div className="result-banner result-banner--warning" role="alert">
        <span className="result-banner__icon" aria-hidden>
          ⚠️
        </span>
        <div className="result-banner__text">
          Bạn chưa tạo mục tiêu cho quá trình luyện thi của mình.{" "}
          <button
            className="result-banner__link"
            onClick={() => alert("Tạo mục tiêu (demo)")}
          >
            Tạo ngay.
          </button>
        </div>
      </div>

      <div className="result-banner result-banner--info" role="note">
        <span className="result-banner__icon" aria-hidden>
          💡
        </span>
        <div className="result-banner__text">
          Bạn có thể tạo flashcards từ highlights (bao gồm các highlights các
          bạn đã tạo trước đây) trong trang chi tiết kết quả bài thi.{" "}
          <button
            className="result-banner__link"
            onClick={() => alert("Xem hướng dẫn (demo)")}
          >
            Xem hướng dẫn.
          </button>
        </div>
      </div>

      <div className="result-header">
        <div className="result-header__left">
          <h2 className="result-header__title">
            Kết quả luyện tập: {data.testTitle}
          </h2>
          <div className="result-badges">
            <span className="result-badge">{data.mode}</span>
            <span className="result-badge result-badge--muted">
              Test ID: {data.testId}
            </span>
          </div>
        </div>

        <div className="result-header__actions">
          <button
            className="result-btn result-btn--primary"
            aria-label="Xem đáp án"
            onClick={onViewAnswers}
          >
            Xem đáp án
          </button>
          <button
            className="result-btn result-btn--outline"
            aria-label="Quay về trang đề thi"
            onClick={onBackToAssessment}
          >
            Quay về trang đề thi
          </button>
        </div>
      </div>

      <div className="result-summary__body">
        <div className="result-summary__left">
          <div className="result-overview">
            <div className="result-overview__row">
              <div className="result-overview__label">Kết quả làm</div>
              <div className="result-overview__value">
                {data.answeredCount}/{data.totalQuestions}
              </div>
            </div>
            <div className="result-overview__row">
              <div className="result-overview__label">Độ chính xác</div>
              <div className="result-overview__value">{data.accuracyPct}%</div>
            </div>
            <div className="result-overview__row">
              <div className="result-overview__label">Thời gian hoàn thành</div>
              <div className="result-overview__value">
                {formatTime(data.timeTakenSeconds)}
              </div>
            </div>
          </div>
        </div>

        <div className="result-summary__right">
          <div className="result-cards">
            <div className="result-card result-card--correct">
              <div className="result-card__label">Trả lời đúng</div>
              <div className="result-card__value">
                {data.correctCount}{" "}
                <span className="result-card__sub">câu hỏi</span>
              </div>
            </div>
            <div className="result-card result-card--wrong">
              <div className="result-card__label">Trả lời sai</div>
              <div className="result-card__value">
                {data.wrongCount}{" "}
                <span className="result-card__sub">câu hỏi</span>
              </div>
            </div>
            <div className="result-card result-card--skipped">
              <div className="result-card__label">Bỏ qua</div>
              <div className="result-card__value">
                {data.skippedCount}{" "}
                <span className="result-card__sub">câu hỏi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ResultAnalysis component */
function ResultAnalysis({ data, activePart, setActivePart, onQuestionClick }) {
  const parts = data.parts || [];

  /* Build aggregated 'Total' part */
  const totalAggregate = useMemo(() => {
    const agg = {
      tagName: "Total",
      total: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
      accuracyPct: 0,
      questionIds: [],
    };
    parts.forEach((p) => {
      p.tags.forEach((t) => {
        agg.total += t.total || 0;
        agg.correct += t.correct || 0;
        agg.wrong += t.wrong || 0;
        agg.skipped += t.skipped || 0;
        (t.questionIds || []).forEach((q) => agg.questionIds.push(q));
      });
    });
    agg.accuracyPct = agg.total
      ? Math.round((agg.correct / agg.total) * 10000) / 100
      : 0;
    return agg;
  }, [parts]);

  const tabs = [
    ...parts.map((p) => ({
      key: `part-${p.part}`,
      label: `Part ${p.part}`,
      part: p,
    })),
    { key: "total", label: "Tổng quát", part: totalAggregate },
  ];

  /* current tab data */
  const currentPart =
    tabs.find((t) => t.key === activePart) || tabs[tabs.length - 1];

  /* render tag rows - if current is aggregated total, create fake tags */
  const tagRows = (() => {
    if (currentPart.key === "total") {
      // display aggregated tags by merging tagName groups
      const map = new Map();
      parts.forEach((p) => {
        p.tags.forEach((t) => {
          const key = t.tagName;
          if (!map.has(key)) map.set(key, JSON.parse(JSON.stringify({ ...t })));
          else {
            const ex = map.get(key);
            ex.total += t.total;
            ex.correct += t.correct;
            ex.wrong += t.wrong;
            ex.skipped += t.skipped;
            ex.questionIds = ex.questionIds.concat(t.questionIds || []);
            ex.accuracyPct = ex.total
              ? Math.round((ex.correct / ex.total) * 10000) / 100
              : 0;
          }
        });
      });
      return Array.from(map.values());
    } else {
      return currentPart.part.tags || [];
    }
  })();

  return (
    <div
      className="assessment-result__analysis result-analysis"
      role="region"
      aria-label="Phân tích chi tiết"
    >
      <div className="result-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`result-tab ${
              tab.key === activePart ? "result-tab--active" : ""
            }`}
            onClick={() => setActivePart(tab.key)}
            aria-pressed={tab.key === activePart}
            aria-label={`Chọn ${tab.label}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="result-table" role="table" aria-label="Bảng phân tích">
        <div className="result-table__head result-table__row">
          <div className="result-table__cell result-table__cell--flex">
            Phân loại câu hỏi
          </div>
          <div className="result-table__cell">Số câu đúng</div>
          <div className="result-table__cell">Số câu sai</div>
          <div className="result-table__cell">Số câu bỏ qua</div>
          <div className="result-table__cell">Độ chính xác</div>
          <div className="result-table__cell">Danh sách câu hỏi</div>
        </div>

        <div className="result-table__body">
          {tagRows.length === 0 && (
            <div className="result-table__empty">
              Không có dữ liệu cho phần này.
            </div>
          )}
          {tagRows.map((tag) => (
            <div className="result-table__row" key={tag.tagId || tag.tagName}>
              <div className="result-table__cell result-table__cell--flex">
                {tag.tagName}
              </div>
              <div className="result-table__cell">{tag.correct}</div>
              <div className="result-table__cell">{tag.wrong}</div>
              <div className="result-table__cell">{tag.skipped}</div>
              <div className="result-table__cell">{tag.accuracyPct}%</div>
              <div className="result-table__cell">
                <div className="question-list">
                  {(tag.questionIds || []).map((q) => (
                    <button
                      key={q.id}
                      className={`question-circle question-circle--${q.status}`}
                      title={`Câu ${q.id}: ${q.status}`}
                      aria-label={`Câu ${q.id}: ${q.status}`}
                      onClick={() => onQuestionClick(q.id)}
                    >
                      {q.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button
          className="result-btn result-btn--outline"
          onClick={() => alert("Làm lại các câu sai (demo)")}
        >
          Làm lại các câu sai
        </button>
        <button
          className="result-btn result-btn--primary"
          onClick={() => alert("Xem chi tiết đáp án (demo)")}
        >
          Xem chi tiết đáp án
        </button>
      </div>
    </div>
  );
}

/* Main exported component */
export default function Result({ resultData = MOCK_DATA }) {
  const [activePart, setActivePart] = useState(() => {
    // default to first part if exists, else total
    return resultData.parts && resultData.parts.length
      ? `part-${resultData.parts[0].part}`
      : "total";
  });

  if (!resultData) {
    return <div className="assessment-result">Không có dữ liệu.</div>;
  }

  const handleViewAnswers = () => {
    fakeNavigate("/assessmentTest", {
      state: {
        mode: "review",
        fillAnswers: resultData.answers,
        showExplanation: true,
      },
    });
  };

  const handleBackToAssessment = () => {
    fakeNavigate(`/assessment/${resultData.testId}`, {});
  };

  const handleQuestionClick = (qid) => {
    fakeNavigate("/assessmentTest", {
      state: { mode: "review", fillAnswers: resultData.answers, jumpTo: qid },
    });
  };

  return (
    <div className="assessment-result">
      <div className="assessment-result__inner">
        <ResultSummary
          data={resultData}
          onViewAnswers={handleViewAnswers}
          onBackToAssessment={handleBackToAssessment}
        />

        <ResultAnalysis
          data={resultData}
          activePart={activePart}
          setActivePart={setActivePart}
          onQuestionClick={handleQuestionClick}
        />
      </div>
    </div>
  );
}
