import React, { useState } from "react";
import ExamBuilderModal from "../components/ExamBuilderModal";
import ExamPreviewModal from "../components/ExamPreviewModal";
import {
  useAdminAddPartToTest,
  useAdminAddQuestionsToPart,
  useAdminCreateTest,
  useAdminDeleteTest,
} from "../hooks/useExamAdminMutations";
import {
  useAdminTests,
  useAdminTestStatistics,
} from "../hooks/useExamAdminQueries";
import "./CoursesPage.scss";

function RatingStar() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <path
        d="M10 2l2.36 5.99h6.14l-4.95 3.74 1.9 6.02L10 13.75l-5.46 3.99 1.9-6.02-4.95-3.74h6.14L10 2z"
        fill="#FBBF24"
      />
    </svg>
  );
}

const stats = [
  {
    title: "Total Assessment",
    value: "12",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <rect width="18" height="12" x="1" y="4" rx="2" fill="#2A5BD7" />
        </svg>
      </div>
    ),
  },
  {
    title: "Published Assessment",
    value: "8",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <rect width="18" height="12" x="1" y="4" rx="2" fill="#29C6F6" />
        </svg>
      </div>
    ),
  },
  {
    title: "Draft Assessment",
    value: "3",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <rect width="18" height="12" x="1" y="4" rx="2" fill="#A78BFA" />
        </svg>
      </div>
    ),
  },
  {
    title: "Total Enrollments",
    value: "1,245",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <circle cx="10" cy="10" r="8" fill="#2DD4BF" />
        </svg>
      </div>
    ),
  },
];

export default function CoursesPage() {
  const [open, setOpen] = useState(false);
  const [previewTestId, setPreviewTestId] = useState(null);
  const [hoveredTestId, setHoveredTestId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Lấy danh sách đề thi
  const { data: testsRes, isLoading } = useAdminTests();
  const tests = testsRes?.DT || [];

  const { data: statsRes } = useAdminTestStatistics(
    hoveredTestId,
    !!hoveredTestId
  );
  const stats = statsRes?.DT || null;

  // Mutations cho pipeline submit
  const createTest = useAdminCreateTest();
  const addPart = useAdminAddPartToTest();
  const addQuestions = useAdminAddQuestionsToPart();
  const deleteTest = useAdminDeleteTest();

  // Pipeline: tạo test -> tạo các part có câu hỏi -> thêm nhiều câu hỏi
  async function handleSubmitExam({ info, parts }) {
    try {
      // Tính tổng theo dữ liệu hiện có trong modal
      const includedParts = (parts || []).filter(
        (p) => (p.questions || []).length > 0
      );
      const total_questions = includedParts.reduce(
        (sum, p) => sum + (p.questions?.length || 0),
        0
      );
      const total_parts = includedParts.length;
      const difficulty_level = info?.difficulty?.toUpperCase?.() || undefined; // "EASY" | "MEDIUM" | " HARD"
      // const category_ids = undefined; // nếu sau này có chọn category, truyền mảng/số/string đều OK

      // 1) Tạo test
      const createRes = await createTest.mutateAsync({
        title: info.title,
        duration: info.noTimeLimit ? 0 : info.duration,
        description: info.description || "",
        total_questions,
        total_parts,
        difficulty_level,
        // category_ids,
      });
      if (createRes?.EC !== "0")
        throw new Error(createRes?.EM || "Create test failed");

      const testId =
        createRes?.DT?.test_id ?? createRes?.DT?.id ?? createRes?.DT?._id;
      if (!testId) throw new Error("Không tìm thấy test_id sau khi tạo đề");

      // 2) Tạo part cho những part có câu hỏi
      for (const p of includedParts) {
        const partRes = await addPart.mutateAsync({
          testId,
          payload: {
            part_name: p.title,
            part_type: p.type, // "listening" | "reading"
            part_number: p.number,
            question_count: p.questions.length, // số câu thực tế
            duration_minutes: 0, // tạm mặc định
            description: "",
            display_template: "",
          },
        });
        if (partRes?.EC !== "0")
          throw new Error(partRes?.EM || "Add part failed");

        const partId =
          partRes?.DT?.part_id ?? partRes?.DT?.id ?? partRes?.DT?._id;
        if (!partId) continue;

        // 3) Bulk câu hỏi
        const qs = (p.questions || []).map((q) => ({
          question_text: q.text,
          question_type: "MULTIPLE_CHOICE", // tạm cố định
          question_number: q.order,
          audio_file: undefined, // chưa upload file
          image_file: undefined,
          transcript: q.media?.passage || q.transcript || undefined,
          explanation: q.explanation || undefined,
          grammar_notes: undefined,
          choices: (q.choices || []).map((c) => ({
            choice_text: c.text,
            is_correct: q.correctKey === c.key,
            choice_label: c.key,
          })),
        }));

        if (qs.length) {
          const addQRes = await addQuestions.mutateAsync({
            partId,
            questions: qs,
          });
          if (addQRes?.EC !== "0")
            throw new Error(addQRes?.EM || "Add questions failed");
        }
      }

      // Đóng modal sau khi xong
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(testId) {
    if (!window.confirm("Bạn có chắc muốn xóa đề thi này?")) return;
    try {
      await deleteTest.mutateAsync(testId);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="courses-page-root">
      <div className="courses-header-row">
        <div className="courses-title">
          My Assessment
          <div className="courses-breadcrumb">
            <span>
              Management / <b>Assessment</b>
            </span>
          </div>
        </div>
        <button className="btn btn--primary" onClick={() => setOpen(true)}>
          Add New Exam
        </button>
      </div>

      {/* Stats Row */}
      {/* <div className="courses-stats-row">
        {stats.map((stat, i) => (
          <div className="course-stat-card" key={i}>
            {stat.icon}
            <div className="stat-data">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-link">
                View details <span className="stat-link-arrow">{">"}</span>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      <div className="courses-table-wrapper">
        <div className="table-header-row">
          <div className="table-title">Exams Table</div>
          <div className="table-tools">
            <div className="table-search">
              <input type="text" placeholder="Search" />
              <span className="search-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <circle
                    cx="9"
                    cy="9"
                    r="7.5"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <path
                    d="m16 16-3-3"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
            <button className="table-tool-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                <path
                  d="M4 10h12M4 6h12M4 14h8"
                  stroke="#9CA3AF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>{" "}
              Filter
            </button>
            <button className="table-tool-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                <path
                  d="M6 8l4 4 4-4"
                  stroke="#9CA3AF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              Sort by
            </button>
          </div>
        </div>
        <div className="courses-table-scroll">
          <table className="courses-table">
            <thead>
              <tr>
                <th style={{ width: "4%", textAlign: "center" }}>
                  <input type="checkbox" />
                </th>
                <th style={{ width: "4%", textAlign: "center" }}>No</th>
                <th style={{ width: "8%", textAlign: "center" }}>ID</th>
                <th style={{ width: "16%", textAlign: "left" }}>Title</th>
                <th style={{ width: "22%", textAlign: "left" }}>Description</th>
                <th style={{ width: "8%", textAlign: "center" }}>Type</th>
                <th style={{ width: "8%", textAlign: "center" }}>
                  Duration (min)
                </th>
                <th style={{ width: "8%", textAlign: "center" }}>Questions</th>
                <th style={{ width: "6%", textAlign: "center" }}>Parts</th>
                <th style={{ width: "8%", textAlign: "center" }}>Difficulty</th>
                <th style={{ width: "8%", textAlign: "center" }}>Created On</th>
                <th style={{ width: "8%", textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: "center", padding: 20 }}>
                    Loading...
                  </td>
                </tr>
              ) : (tests || []).length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: "center", padding: 20 }}>
                    No data
                  </td>
                </tr>
              ) : (
                tests.map((t, i) => (
                  <tr
                    key={t.test_id ?? i}
                    onMouseMove={(e) => {
                      if (!hoveredTestId || hoveredTestId !== t.test_id) {
                        setHoveredTestId(t.test_id);
                      }
                      setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                      setHoveredTestId(null);
                    }}
                    style={{ position: "relative" }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" />
                    </td>
                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                    <td style={{ textAlign: "center" }}>{t.test_id}</td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {t.title || "-"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {t.description || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {t.exam_type || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {t.total_duration ?? "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {t.total_questions ?? "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {t.total_parts ?? "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {t.difficulty_level || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="created-date">
                        {t.created_at
                          ? new Date(t.created_at).toLocaleString()
                          : "-"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        {/* Preview icon */}
                        <button
                          onClick={() => setPreviewTestId(t.test_id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                          }}
                          title="Preview"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              stroke="#6b7280"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                        {/* Edit icon */}
                        <button
                          onClick={() => {
                            /* TODO: mở edit modal */
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                          }}
                          title="Edit"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {/* Delete icon */}
                        <button
                          onClick={() => handleDelete(t.test_id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                          }}
                          title="Delete"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                              stroke="#ef4444"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {hoveredTestId && stats && (
            <div
              className="statistics-tooltip"
              style={{
                position: "fixed",
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y - 10}px`,
                transform: "translate(-50%, -100%)",
                zIndex: 9999,
                pointerEvents: "none",
              }}
            >
              <div className="statistics-tooltip__content">
                <div className="statistics-tooltip__header">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>Statistics</span>
                </div>
                <div className="statistics-tooltip__body">
                  <div className="statistics-tooltip__item">
                    <span className="statistics-tooltip__label">
                      Total Sessions:
                    </span>
                    <span className="statistics-tooltip__value">
                      {stats.totalSessions || 0}
                    </span>
                  </div>
                  <div className="statistics-tooltip__item">
                    <span className="statistics-tooltip__label">
                      Average Score:
                    </span>
                    <span className="statistics-tooltip__value">
                      {stats.averageScore?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="statistics-tooltip__arrow"></div>
            </div>
          )}
        </div>
      </div>

      <ExamBuilderModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={({ info, parts }) => handleSubmitExam({ info, parts })}
      />

      <ExamPreviewModal
        open={!!previewTestId}
        onClose={() => setPreviewTestId(null)}
        testId={previewTestId}
      />
    </div>
  );
}
