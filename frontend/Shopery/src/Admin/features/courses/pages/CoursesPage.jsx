import React, { useState } from "react";
import ExamBuilderModal from "../components/ExamBuilderModal";
import {
  useAdminAddPartToTest,
  useAdminAddQuestionsToPart,
  useAdminCreateTest,
} from "../hooks/useExamAdminMutations";
import { useAdminTests } from "../hooks/useExamAdminQueries";
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

export default function CoursesPage() {
  const [open, setOpen] = useState(false);

  // Lấy danh sách đề thi
  const { data: testsRes, isLoading } = useAdminTests();
  const tests = testsRes?.DT || [];

  // Mutations cho pipeline submit
  const createTest = useAdminCreateTest();
  const addPart = useAdminAddPartToTest();
  const addQuestions = useAdminAddQuestionsToPart();

  // Pipeline: tạo test -> tạo các part có câu hỏi -> thêm nhiều câu hỏi
  async function handleSubmitExam({ info, parts }) {
    try {
      const createRes = await createTest.mutateAsync({
        title: info.title,
        duration: info.noTimeLimit ? 0 : info.duration,
        description: info.description || "",
      });
      if (createRes?.EC !== "0")
        throw new Error(createRes?.EM || "Create test failed");

      const testId =
        createRes?.DT?.test_id ?? createRes?.DT?.id ?? createRes?.DT?._id;
      if (!testId) throw new Error("Không tìm thấy test_id sau khi tạo đề");

      for (const p of parts) {
        const hasQuestions = (p.questions || []).length > 0;
        if (!hasQuestions) continue;

        const partRes = await addPart.mutateAsync({
          testId,
          payload: {
            part_name: p.title,
            part_type: p.type,
            part_number: p.number,
            question_count: p.questions.length,
            duration_minutes: 0,
            description: "",
            display_template: "",
          },
        });
        if (partRes?.EC !== "0")
          throw new Error(partRes?.EM || "Add part failed");

        const partId =
          partRes?.DT?.part_id ?? partRes?.DT?.id ?? partRes?.DT?._id;
        if (!partId) continue;

        const qs = (p.questions || []).map((q) => ({
          question_text: q.text,
          question_type: "single_choice",
          question_number: q.order,
          audio_file: undefined,
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

      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="courses-page-root">
      <div className="courses-header-row">
        <div className="courses-title">
          My Courses
          <div className="courses-breadcrumb">
            <span>
              Management / <b>Courses</b>
            </span>
          </div>
        </div>
        <button className="btn btn--primary" onClick={() => setOpen(true)}>
          Add New Exam
        </button>
      </div>

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
                <th style={{ width: "4%", textAlign: "right" }}></th>
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
                  <tr key={t.test_id ?? i}>
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
                      <span className="icon-ellipsis">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <circle cx="10" cy="4" r="1.3" fill="#9CA3AF" />
                          <circle cx="10" cy="10" r="1.3" fill="#9CA3AF" />
                          <circle cx="10" cy="16" r="1.3" fill="#9CA3AF" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ExamBuilderModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={({ info, parts }) => handleSubmitExam({ info, parts })}
      />
    </div>
  );
}

// import React, { useState } from "react";
// import ExamBuilderModal from "../components/ExamBuilderModal";
// import { useAdminTests } from "../hooks/useExamAdminQueries";
// import "./CoursesPage.scss";

// const stats = [
//   {
//     title: "Total Courses",
//     value: "12",
//     icon: (
//       <div className="stat-icon" style={{ background: "#E6EEFF" }}>
//         <svg width="20" height="20" fill="none">
//           <rect width="18" height="12" x="1" y="4" rx="2" fill="#2A5BD7" />
//         </svg>
//       </div>
//     ),
//   },
//   {
//     title: "Published Courses",
//     value: "8",
//     icon: (
//       <div className="stat-icon" style={{ background: "#E6EEFF" }}>
//         <svg width="20" height="20" fill="none">
//           <rect width="18" height="12" x="1" y="4" rx="2" fill="#29C6F6" />
//         </svg>
//       </div>
//     ),
//   },
//   {
//     title: "Draft Courses",
//     value: "3",
//     icon: (
//       <div className="stat-icon" style={{ background: "#E6EEFF" }}>
//         <svg width="20" height="20" fill="none">
//           <rect width="18" height="12" x="1" y="4" rx="2" fill="#A78BFA" />
//         </svg>
//       </div>
//     ),
//   },
//   {
//     title: "Total Enrollments",
//     value: "1,245",
//     icon: (
//       <div className="stat-icon" style={{ background: "#E6EEFF" }}>
//         <svg width="20" height="20" fill="none">
//           <circle cx="10" cy="10" r="8" fill="#2DD4BF" />
//         </svg>
//       </div>
//     ),
//   },
// ];

// function RatingStar() {
//   return (
//     <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
//       <path
//         d="M10 2l2.36 5.99h6.14l-4.95 3.74 1.9 6.02L10 13.75l-5.46 3.99 1.9-6.02-4.95-3.74h6.14L10 2z"
//         fill="#FBBF24"
//       />
//     </svg>
//   );
// }

// export default function CoursesPage() {
//   const [open, setOpen] = useState(false);

//   // Gọi hook lấy danh sách đề thi
//   const { data: testsRes, isLoading } = useAdminTests();
//   const tests = testsRes?.DT || [];

//   return (
//     <div className="courses-page-root">
//       {/* Header + Button */}
//       <div className="courses-header-row">
//         <div className="courses-title">
//           My Assessment
//           <div className="courses-breadcrumb">
//             <span>
//               Management / <b>Assessment</b>
//             </span>
//           </div>
//         </div>
//         <button className="btn btn--primary" onClick={() => setOpen(true)}>
//           Add New Exam
//         </button>
//       </div>

//       {/* Stats Row */}
//       <div className="courses-stats-row">
//         {stats.map((stat, i) => (
//           <div className="course-stat-card" key={i}>
//             {stat.icon}
//             <div className="stat-data">
//               <div className="stat-title">{stat.title}</div>
//               <div className="stat-value">{stat.value}</div>
//               <div className="stat-link">
//                 View details <span className="stat-link-arrow">{">"}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Courses Table */}
//       <div className="courses-table-wrapper">
//         <div className="table-header-row">
//           <div className="table-title">Exams Table</div>
//           <div className="table-tools">
//             <div className="table-search">
//               <input type="text" placeholder="Search" />
//               <span className="search-icon">
//                 <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
//                   <circle
//                     cx="9"
//                     cy="9"
//                     r="7.5"
//                     stroke="#9CA3AF"
//                     strokeWidth="2"
//                   />
//                   <path
//                     d="m16 16-3-3"
//                     stroke="#9CA3AF"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </span>
//             </div>
//             <button className="table-tool-btn">
//               <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
//                 <path
//                   d="M4 10h12M4 6h12M4 14h8"
//                   stroke="#9CA3AF"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                 />
//               </svg>{" "}
//               Filter
//             </button>
//             <button className="table-tool-btn">
//               <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
//                 <path
//                   d="M6 8l4 4 4-4"
//                   stroke="#9CA3AF"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>{" "}
//               Sort by
//             </button>
//           </div>
//         </div>
//         <div className="courses-table-scroll">
//           <table className="courses-table">
//             <thead>
//               <tr>
//                 <th style={{ width: "4%", textAlign: "center" }}>
//                   <input type="checkbox" />
//                 </th>
//                 <th style={{ width: "4%", textAlign: "center" }}>No</th>
//                 <th style={{ width: "4%", textAlign: "center" }}>ID</th>
//                 <th style={{ width: "16%", textAlign: "left" }}>Title</th>
//                 <th style={{ width: "22%", textAlign: "left" }}>Description</th>
//                 <th style={{ width: "4%", textAlign: "center" }}>Type</th>
//                 <th style={{ width: "4%", textAlign: "center" }}>
//                   Duration (min)
//                 </th>
//                 <th style={{ width: "4%", textAlign: "center" }}>Questions</th>
//                 <th style={{ width: "4%", textAlign: "center" }}>Parts</th>
//                 <th style={{ width: "8%", textAlign: "center" }}>Difficulty</th>
//                 <th style={{ width: "8%", textAlign: "center" }}>Created On</th>
//                 <th style={{ width: "4%", textAlign: "right" }}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={12} style={{ textAlign: "center", padding: 20 }}>
//                     Loading...
//                   </td>
//                 </tr>
//               ) : tests.length === 0 ? (
//                 <tr>
//                   <td colSpan={12} style={{ textAlign: "center", padding: 20 }}>
//                     No data
//                   </td>
//                 </tr>
//               ) : (
//                 tests.map((t, i) => (
//                   <tr key={t.test_id ?? i}>
//                     <td style={{ textAlign: "center" }}>
//                       <input type="checkbox" />
//                     </td>
//                     <td style={{ textAlign: "center" }}>{i + 1}</td>
//                     <td style={{ textAlign: "center" }}>{t.test_id}</td>
//                     <td
//                       style={{
//                         textAlign: "left",
//                         fontWeight: 600,
//                         color: "#111827",
//                       }}
//                     >
//                       {t.title || "-"}
//                     </td>
//                     <td style={{ textAlign: "left" }}>
//                       {t.description || "-"}
//                     </td>
//                     <td style={{ textAlign: "center" }}>
//                       {t.exam_type || "-"}
//                     </td>
//                     <td style={{ textAlign: "center" }}>
//                       {t.total_duration ?? "-"}
//                     </td>
//                     <td style={{ textAlign: "center" }}>
//                       {t.total_questions ?? "-"}
//                     </td>
//                     <td style={{ textAlign: "center" }}>
//                       {t.total_parts ?? "-"}
//                     </td>
//                     <td style={{ textAlign: "center" }}>
//                       {t.difficulty_level || "-"}
//                     </td>
//                     <td style={{ textAlign: "center" }}>
//                       <span className="created-date">
//                         {t.created_at
//                           ? new Date(t.created_at).toLocaleString()
//                           : "-"}
//                       </span>
//                     </td>
//                     <td style={{ textAlign: "right" }}>
//                       <span className="icon-ellipsis">
//                         <svg
//                           width="16"
//                           height="16"
//                           fill="none"
//                           viewBox="0 0 20 20"
//                         >
//                           <circle cx="10" cy="4" r="1.3" fill="#9CA3AF" />
//                           <circle cx="10" cy="10" r="1.3" fill="#9CA3AF" />
//                           <circle cx="10" cy="16" r="1.3" fill="#9CA3AF" />
//                         </svg>
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <ExamBuilderModal open={open} onClose={() => setOpen(false)} />
//     </div>
//   );
// }
