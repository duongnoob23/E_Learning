// components/AssessmentTest/AssessmentTestJSX/AssessmentTest.jsx

import React, { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useExamLeaveBlocker } from "../../../hooks/Assessment/useExamLeaveBlocker";
import { useSubmitExamSession } from "../../../services/Assessment/assessmentMutations";
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

  // ✅ THÊM: Xác định examType và skill từ sessionData
  // Giả sử sessionData có các field: exam_type, skill_type
  // Hoặc có thể parse từ test_id, test_title, etc.
  const examType = useMemo(() => {
    // Logic xác định exam type (toeic, ielts, ...)
    // Có thể từ sessionData.test_type hoặc parse từ test_title
    return sessionData?.exam_type || "toeic"; // Default là toeic
  }, [sessionData]);

  const skill = useMemo(() => {
    // Logic xác định skill (listening_reading, speaking_writing, ...)
    // Có thể từ sessionData.skill_type hoặc parse từ test_title
    return sessionData?.skill_type || "listening_reading"; // Default
  }, [sessionData]);

  const [answers, setAnswers] = useState({});
  const questionRefs = useRef({});
  const leftContainerRef = useRef(null);
  const [activePart, setActivePart] = useState(1);
  const [questionsData, setQuestionsData] = useState({});

  // Parse selected_parts từ sessionData
  const selectedParts = useMemo(() => {
    if (!sessionData?.selected_parts) return [];
    try {
      return JSON.parse(sessionData.selected_parts);
    } catch {
      return [];
    }
  }, [sessionData]);

  // Hook để nộp bài
  const { mutateAsync: submitExam, isPending: isSubmitting } =
    useSubmitExamSession();

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
      const questions = questionsData[partId] || [];
      if (questions.some((q) => q.question_id === qid)) {
        return partId;
      }
    }
    return null;
  }

  function handleAnswer(qid, choiceId) {
    setAnswers((prev) => ({ ...prev, [qid]: choiceId }));
  }

  // Build parts summary cho navigator
  const partsSummary = useMemo(() => {
    return selectedParts.map((partId) => ({
      part: partId,
      questionIds: (questionsData[partId] || []).map((q) => q.question_id),
    }));
  }, [selectedParts, questionsData]);

  // ✅ XỬ LÝ NỘP BÀI
  const handleSubmit = async () => {
    try {
      const totalQuestions = Object.values(questionsData).reduce(
        (sum, partQuestions) => sum + partQuestions.length,
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
        (partQuestions) => partQuestions.map((q) => q.question_id)
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
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  const { customNavigate } = useExamLeaveBlocker(
    true,
    "⚠️ Bài kiểm tra chưa được nộp. Bạn có chắc muốn rời khỏi trang không?",
    handleSubmit
  );

  // ✅ SỬA: Tạo generic handler cho tất cả parts
  const handlePartDataLoaded = useCallback((partId, data) => {
    setQuestionsData((prev) => ({ ...prev, [partId]: data }));
  }, []);

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

    return (
      <Suspense fallback={<div>Đang tải Part {partId}...</div>}>
        <PartComponent
          partData={currentPartData}
          partNumber={partId} // ✅ Truyền partNumber để component biết part nào đang active
          onAnswer={handleAnswer}
          registerRef={registerRef}
          answers={answers}
          onDataLoaded={(data) => handlePartDataLoaded(partId, data)}
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
            isSubmitting={isSubmitting}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      <div className="toeic__footer">&nbsp;</div>
    </div>
  );
}

// /* File: src/components/AssessmentTest.jsx */
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useExamLeaveBlocker } from "../../../hooks/Assessment/useExamLeaveBlocker";
// import { useSubmitExamSession } from "../../../services/Assessment/assessmentMutations";
// import "../AssessmentTestCSS/AssessmentTest.css";
// import Part1 from "./Part1";
// import Part2 from "./Part2";
// import Part3 from "./Part3";
// import Part4 from "./Part4";
// import Part5 from "./Part5";
// import Part6 from "./Part6";
// import Part7 from "./Part7";
// import QuestionNavigator from "./QuestionNavigator";
// import TestHeader from "./TestHeader";

// export default function AssessmentTest() {
//   useEffect(() => {
//     console.log("MOUNT");
//     return () => {
//       console.log("UN MOUNT");
//     };
//   }, []);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const prevPath = useRef(location.pathname);
//   // console.log(prevPath);
//   const sessionData = location.state?.sessionData;
//   const partData = location.state?.partData;

//   // console.log("sessionData", sessionData);
//   // console.log("LOG", sessionData.test_id);
//   const [answers, setAnswers] = useState({});
//   const questionRefs = useRef({});
//   const leftContainerRef = useRef(null);
//   const [activePart, setActivePart] = useState(1);
//   const [questionsData, setQuestionsData] = useState({});

//   // Parse selected_parts từ sessionData
//   const selectedParts = useMemo(() => {
//     if (!sessionData?.selected_parts) return [];
//     try {
//       return JSON.parse(sessionData.selected_parts);
//     } catch {
//       return [];
//     }
//   }, [sessionData]);

//   // Hook để nộp bài
//   const { mutateAsync: submitExam, isPending: isSubmitting } =
//     useSubmitExamSession();
//   function registerRef(qid, el) {
//     if (el) questionRefs.current[qid] = el;
//   }

//   function handleJump(qid) {
//     const el = questionRefs.current[qid];
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "center" });
//       const part = getPartFromQid(qid);
//       if (part) setActivePart(part);
//     }
//   }

//   const handleNavigate = () => {
//     // navigate("/assessmentResult");
//     customNavigate("/assessmentResult", {
//       state: {
//         sessionId: 21,
//         testId: "T2025-NE01",
//         testTitle: "New Economy TOEIC Full Test 1",
//       },
//     });
//   };

//   function getPartFromQid(qid) {
//     for (const partId of selectedParts) {
//       const questions = questionsData[partId] || [];
//       if (questions.some((q) => q.question_id === qid)) {
//         return partId;
//       }
//     }
//     return null;
//   }

//   function handleAnswer(qid, choiceId) {
//     setAnswers((prev) => ({ ...prev, [qid]: choiceId }));
//   }

//   // Build parts summary cho navigator
//   const partsSummary = useMemo(() => {
//     return selectedParts.map((partId) => ({
//       part: partId,
//       questionIds: (questionsData[partId] || []).map((q) => q.question_id),
//     }));
//   }, [selectedParts, questionsData]);

//   // ✅ XỬ LÝ NỘP BÀI
//   // ✅ XỬ LÝ NỘP BÀI
//   const handleSubmit = async () => {
//     try {
//       // Tổng số câu hỏi của toàn bài (dựa trên dữ liệu đã load)
//       const totalQuestions = Object.values(questionsData).reduce(
//         (sum, partQuestions) => sum + partQuestions.length,
//         0
//       );

//       const answeredCount = Object.keys(answers).length;
//       const unansweredCount = totalQuestions - answeredCount;

//       // ⚠️ Kiểm tra xem còn câu chưa làm không
//       if (unansweredCount > 0) {
//         const confirmSubmit = window.confirm(
//           `Bạn còn ${unansweredCount} câu chưa làm. Bạn có chắc muốn nộp bài sớm không?`
//         );
//         if (!confirmSubmit) return; // Người dùng chọn "Không" → dừng lại
//       }

//       // Gom tất cả câu trả lời thành mảng
//       // const answersArray = Object.entries(answers).map(
//       //   ([questionId, choiceId]) => ({
//       //     question_id: parseInt(questionId),
//       //     selected_choice_id: choiceId,
//       //   })
//       // );

//       // Lấy toàn bộ danh sách câu hỏi từ tất cả các part
//       const allQuestions = Object.values(questionsData).flatMap(
//         (partQuestions) => partQuestions.map((q) => q.question_id)
//       );

//       // Gom tất cả câu hỏi, kể cả chưa trả lời
//       const answersArray = allQuestions.map((questionId) => ({
//         question_id: questionId,
//         selected_choice_id: answers[questionId] ?? null, // nếu chưa làm -> null
//       }));

//       console.log(
//         "🚀 ~ handleSubmit ~ answersArray:",
//         JSON.stringify(answersArray, null, 2)
//       );

//       // Gọi API nộp bài
//       const result = await submitExam({
//         sessionId: sessionData.exam_session_id,
//         answers: answersArray,
//         examId: sessionData.test_id,
//       });

//       if (result && +result.EC === 0) {
//         navigate("/assessmentResult", {
//           state: {
//             sessionId: sessionData.exam_session_id,
//             testId: "2",
//             testTitle: "New Economy TOEIC Full Test 1",
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting exam:", error);
//     }
//   };

//   const { customNavigate } = useExamLeaveBlocker(
//     true,
//     "⚠️ Bài kiểm tra chưa được nộp. Bạn có chắc muốn rời khỏi trang không?",
//     handleSubmit
//   );

//   // ✅ SỬA: Sử dụng useCallback để tạo stable functions
//   const handlePart1DataLoaded = useCallback((data) => {
//     setQuestionsData((prev) => ({ ...prev, 1: data }));
//   }, []);

//   const handlePart2DataLoaded = useCallback((data) => {
//     setQuestionsData((prev) => ({ ...prev, 2: data }));
//   }, []);

//   const handlePart3DataLoaded = useCallback((data) => {
//     setQuestionsData((prev) => ({ ...prev, 3: data }));
//   }, []);

//   const handlePart4DataLoaded = useCallback((data) => {
//     setQuestionsData((prev) => ({ ...prev, 4: data }));
//   }, []);

//   const handlePart5DataLoaded = useCallback((data) => {
//     setQuestionsData((prev) => ({ ...prev, 5: data }));
//   }, []);

//   const handlePart6DataLoaded = useCallback((data) => {
//     setQuestionsData((prev) => ({ ...prev, 6: data }));
//   }, []);

//   const handlePart7DataLoaded = useCallback((data) => {
//     setQuestionsData((prev) => ({ ...prev, 7: data }));
//   }, []);

//   return (
//     <div className="toeic">
//       <div className="toeic__container">
//         <div className="toeic__left" ref={leftContainerRef}>
//           <TestHeader
//             title={`TOEIC Test - Session ${sessionData?.exam_session_id}`}
//             onExit={() => alert("Thoát khỏi bài kiểm tra")}
//           />
//           <div className="toeic__tabs">
//             {selectedParts.map((partId) => (
//               <button
//                 key={partId}
//                 className={`toeic__tab ${
//                   activePart === partId ? "toeic__tab--active" : ""
//                 }`}
//                 onClick={() => setActivePart(partId)}
//               >
//                 Part {partId}
//               </button>
//             ))}
//           </div>

//           <div className="toeic__content">
//             {activePart === 1 && selectedParts.includes(1) && (
//               <Part1
//                 partData={partData}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//                 onDataLoaded={handlePart1DataLoaded}
//               />
//             )}
//             {activePart === 2 && selectedParts.includes(2) && (
//               <Part2
//                 partData={partData}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//                 onDataLoaded={handlePart2DataLoaded}
//               />
//             )}
//             {activePart === 3 && selectedParts.includes(3) && (
//               <Part3
//                 partData={partData}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//                 onDataLoaded={handlePart3DataLoaded}
//               />
//             )}
//             {activePart === 4 && selectedParts.includes(4) && (
//               <Part4
//                 partData={partData}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//                 onDataLoaded={handlePart4DataLoaded}
//               />
//             )}
//             {activePart === 5 && selectedParts.includes(5) && (
//               <Part5
//                 partData={partData}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//                 onDataLoaded={handlePart5DataLoaded}
//               />
//             )}
//             {activePart === 6 && selectedParts.includes(6) && (
//               <Part6
//                 partData={partData}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//                 onDataLoaded={handlePart6DataLoaded}
//               />
//             )}
//             {activePart === 7 && selectedParts.includes(7) && (
//               <Part7
//                 partData={partData}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//                 onDataLoaded={handlePart7DataLoaded}
//               />
//             )}
//           </div>
//         </div>

//         <div className="toeic__right">
//           <QuestionNavigator
//             partsSummary={partsSummary}
//             answers={answers}
//             onJump={handleJump}
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             onNavigate={handleNavigate}
//           />
//         </div>
//       </div>

//       <div className="toeic__footer">&nbsp;</div>
//     </div>
//   );
// }
