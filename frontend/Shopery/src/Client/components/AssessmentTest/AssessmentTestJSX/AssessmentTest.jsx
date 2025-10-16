/* File: src/components/AssessmentTest.jsx */
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubmitExamSession } from "../../../services/Assessment/assessmentMutations";
import "../AssessmentTestCSS/AssessmentTest.css";
import Part1 from "./Part1";
import Part2 from "./Part2";
import Part3 from "./Part3";
import Part4 from "./Part4";
import Part5 from "./Part5";
import Part6 from "./Part6";
import Part7 from "./Part7";
import QuestionNavigator from "./QuestionNavigator";
import TestHeader from "./TestHeader";

export default function AssessmentTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionData = location.state?.sessionData;

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
    navigate("/assessmentResult");
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

  // ✅ SỬA: Sử dụng useCallback để tạo stable functions
  const handlePart1DataLoaded = useCallback((data) => {
    setQuestionsData((prev) => ({ ...prev, 1: data }));
  }, []);

  const handlePart2DataLoaded = useCallback((data) => {
    setQuestionsData((prev) => ({ ...prev, 2: data }));
  }, []);

  const handlePart3DataLoaded = useCallback((data) => {
    setQuestionsData((prev) => ({ ...prev, 3: data }));
  }, []);

  const handlePart4DataLoaded = useCallback((data) => {
    setQuestionsData((prev) => ({ ...prev, 4: data }));
  }, []);

  const handlePart5DataLoaded = useCallback((data) => {
    setQuestionsData((prev) => ({ ...prev, 5: data }));
  }, []);

  const handlePart6DataLoaded = useCallback((data) => {
    setQuestionsData((prev) => ({ ...prev, 6: data }));
  }, []);

  const handlePart7DataLoaded = useCallback((data) => {
    setQuestionsData((prev) => ({ ...prev, 7: data }));
  }, []);

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
      // Gom tất cả câu trả lời thành mảng
      const answersArray = Object.entries(answers).map(
        ([questionId, choiceId]) => ({
          question_id: parseInt(questionId),
          selected_choice_id: choiceId,
        })
      );

      console.log("Submitting answers:", answersArray);

      // Gọi API nộp bài
      const result = await submitExam({
        sessionId: sessionData.exam_session_id,
        answers: answersArray,
      });

      console.log("Submit result:", result);

      if (result && +result.EC === 0) {
        // Chuyển đến trang kết quả
        navigate("/assessmentResult", {
          state: {
            sessionId: sessionData.exam_session_id,
            result: result.DT,
          },
        });
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  return (
    <div className="toeic">
      <div className="toeic__container">
        <div className="toeic__left" ref={leftContainerRef}>
          <TestHeader
            title={`TOEIC Test - Session ${sessionData?.exam_session_id}`}
            onExit={() => alert("Thoát khỏi bài kiểm tra")}
          />

          <div className="toeic__audio">
            <div className="audio__controls">
              🔊 <input type="range" min="0" max="100" defaultValue="0" />
            </div>
            <div className="audio__settings">00:00</div>
          </div>

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
            {activePart === 1 && selectedParts.includes(1) && (
              <Part1
                onAnswer={handleAnswer}
                registerRef={registerRef}
                answers={answers}
                onDataLoaded={handlePart1DataLoaded}
              />
            )}
            {activePart === 2 && selectedParts.includes(2) && (
              <Part2
                onAnswer={handleAnswer}
                registerRef={registerRef}
                answers={answers}
                onDataLoaded={handlePart2DataLoaded}
              />
            )}
            {activePart === 3 && selectedParts.includes(3) && (
              <Part3
                onAnswer={handleAnswer}
                registerRef={registerRef}
                answers={answers}
                onDataLoaded={handlePart3DataLoaded}
              />
            )}
            {activePart === 4 && selectedParts.includes(4) && (
              <Part4
                onAnswer={handleAnswer}
                registerRef={registerRef}
                answers={answers}
                onDataLoaded={handlePart4DataLoaded}
              />
            )}
            {activePart === 5 && selectedParts.includes(5) && (
              <Part5
                onAnswer={handleAnswer}
                registerRef={registerRef}
                answers={answers}
                onDataLoaded={handlePart5DataLoaded}
              />
            )}
            {activePart === 6 && selectedParts.includes(6) && (
              <Part6
                onAnswer={handleAnswer}
                registerRef={registerRef}
                answers={answers}
                onDataLoaded={handlePart6DataLoaded}
              />
            )}
            {activePart === 7 && selectedParts.includes(7) && (
              <Part7
                onAnswer={handleAnswer}
                registerRef={registerRef}
                answers={answers}
                onDataLoaded={handlePart7DataLoaded}
              />
            )}
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
// /* File: src/components/ToeicTestPage.jsx */
// import React, { useMemo, useRef, useState } from "react";
// import TestHeader from "./TestHeader";
// import QuestionNavigator from "./QuestionNavigator";
// import Part1 from "./Part1";
// import Part2 from "./Part2";
// import Part3 from "./Part3";
// import Part4 from "./Part4";
// import Part5 from "./Part5";
// import Part6 from "./Part6";
// import Part7 from "./Part7";

// import "../AssessmentTestCSS/AssessmentTest.css";

// export function generateToeicMockData() {
//   let qnum = 1;

//   const part1 = [];
//   for (let i = 0; i < 6; i++) {
//     part1.push({
//       id: qnum++,
//       part: 1,
//       type: "photo",
//       image: `https://via.placeholder.com/320x180?text=Photo+${i + 1}`,
//       prompt: `Look at the photograph. What is happening in picture ${i + 1}?`,
//       options: [
//         "A. Something is being repaired.",
//         "B. People are having a meeting.",
//         "C. A group is celebrating.",
//         "D. Someone is taking a picture.",
//       ],
//     });
//   }

//   const part2 = [];
//   for (let i = 0; i < 25; i++) {
//     part2.push({
//       id: qnum++,
//       part: 2,
//       type: "qresp",
//       audioCue: `audio-part2-${i + 1}`,
//       prompt: `Listen to the question ${i + 1}`,
//       options: [
//         "A. I will check that for you.",
//         "B. Because of the delay.",
//         "C. At ten o'clock.",
//       ],
//     });
//   }

//   // Part 3: Conversations - 39 questions (typically groups of 3)
//   const part3Groups = [];
//   const totalPart3 = 39;
//   let remaining = totalPart3;
//   while (remaining > 0) {
//     const groupSize = Math.min(3, remaining);
//     const questions = [];
//     for (let i = 0; i < groupSize; i++) {
//       questions.push({
//         id: qnum,
//         prompt: `Question ${qnum}: What are the speakers mainly discussing?`,
//         options: [
//           "A. A training seminar.",
//           "B. The installation of a television.",
//           "C. The date of a presentation.",
//           "D. A software upgrade.",
//         ],
//       });
//       qnum++;
//     }
//     part3Groups.push({
//       groupId: `p3g-${part3Groups.length + 1}`,
//       type: "conversation",
//       audioCue: `audio-p3-${part3Groups.length + 1}`,
//       script: `Short conversation ${part3Groups.length + 1}...`,
//       questions,
//     });
//     remaining -= groupSize;
//   }

//   // Part 4: Talks - 30 questions, groups of 3
//   const part4Groups = [];
//   const totalPart4 = 30;
//   remaining = totalPart4;
//   while (remaining > 0) {
//     const groupSize = Math.min(3, remaining);
//     const questions = [];
//     for (let i = 0; i < groupSize; i++) {
//       questions.push({
//         id: qnum,
//         prompt: `Question ${qnum}: What is the problem?`,
//         options: [
//           "A. The necessary tools are unavailable.",
//           "B. The office is closed.",
//           "C. The wall is too weak.",
//           "D. The phone number was wrong.",
//         ],
//       });
//       qnum++;
//     }
//     part4Groups.push({
//       groupId: `p4g-${part4Groups.length + 1}`,
//       type: "talk",
//       audioCue: `audio-p4-${part4Groups.length + 1}`,
//       script: `Short announcement ${part4Groups.length + 1}...`,
//       questions,
//     });
//     remaining -= groupSize;
//   }

//   // Part 5: 30 incomplete sentences
//   const part5 = [];
//   for (let i = 0; i < 30; i++) {
//     part5.push({
//       id: qnum++,
//       part: 5,
//       type: "incomplete",
//       prompt: `Question ${
//         qnum - 1
//       }: Choose the best word to complete the sentence.`,
//       options: ["A. however", "B. therefore", "C. despite", "D. although"],
//     });
//   }

//   // Part 6: 16 text completions organized into passages (4 passages x4)
//   const part6Passages = [];
//   const totalPart6 = 16;
//   let perPassage = 4;
//   let passCount = Math.ceil(totalPart6 / perPassage);
//   for (let p = 0; p < passCount; p++) {
//     const questions = [];
//     for (let i = 0; i < perPassage; i++) {
//       if (qnum > 146) break; // part6 ends at 146
//       questions.push({
//         id: qnum,
//         prompt: `Question ${qnum}: Which word best fits blank (___) ?`,
//         options: ["A. the", "B. a", "C. an", "D. to"],
//       });
//       qnum++;
//     }
//     part6Passages.push({
//       passageId: `p6-${p + 1}`,
//       title: `Public memo ${p + 1}`,
//       text: `This is a short memo with blanks for passage ${
//         p + 1
//       }. ___ (1) ___ (2) ___ (3) and ___ (4).`,
//       questions,
//     });
//   }

//   // Part 7: 54 questions - multiple passages of varying length
//   const part7Passages = [];
//   const totalPart7 = 54;
//   remaining = totalPart7;
//   while (remaining > 0) {
//     // make groups of 3-6 questions
//     const groupSize = Math.min(remaining, 3 + (part7Passages.length % 4));
//     const questions = [];
//     for (let i = 0; i < groupSize; i++) {
//       questions.push({
//         id: qnum,
//         prompt: `Question ${qnum}: According to the passage, what should the reader do?`,
//         options: [
//           "A. Contact the office",
//           "B. Read the manual",
//           "C. Schedule an appointment",
//           "D. Ignore the message",
//         ],
//       });
//       qnum++;
//     }
//     part7Passages.push({
//       passageId: `p7-${part7Passages.length + 1}`,
//       title: `Email/notice ${part7Passages.length + 1}`,
//       text: `Sample passage ${
//         part7Passages.length + 1
//       } with supporting details...`,
//       questions,
//     });
//     remaining -= groupSize;
//   }

//   return {
//     part1,
//     part2,
//     part3Groups,
//     part4Groups,
//     part5,
//     part6Passages,
//     part7Passages,
//   };
// }

// export default function AssessmentTest() {
//   const data = useMemo(() => generateToeicMockData(), []);
//   const [answers, setAnswers] = useState({});
//   const questionRefs = useRef({});
//   const leftContainerRef = useRef(null);
//   const [activePart, setActivePart] = useState(3); // default Part 3 for demo

//   function registerRef(qid, el) {
//     if (el) questionRefs.current[qid] = el;
//   }

//   function handleJump(qid) {
//     const el = questionRefs.current[qid];
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "center" });
//       // set active part according to qid
//       const part = getPartFromQid(qid);
//       if (part) setActivePart(part);
//     }
//   }

//   function getPartFromQid(qid) {
//     const id = Number(qid);
//     if (id >= 1 && id <= 6) return 1;
//     if (id >= 7 && id <= 31) return 2;
//     if (id >= 32 && id <= 70) return 3;
//     if (id >= 71 && id <= 100) return 4;
//     if (id >= 101 && id <= 130) return 5;
//     if (id >= 131 && id <= 146) return 6;
//     if (id >= 147 && id <= 200) return 7;
//     return null;
//   }

//   function handleAnswer(qid, optionIndex) {
//     setAnswers((prev) => ({ ...prev, [qid]: optionIndex }));
//   }

//   // build parts summary for navigator
//   const partsSummary = useMemo(() => {
//     return [
//       { part: 1, questionIds: data.part1.map((q) => q.id) },
//       { part: 2, questionIds: data.part2.map((q) => q.id) },
//       {
//         part: 3,
//         questionIds: data.part3Groups.flatMap((g) =>
//           g.questions.map((q) => q.id)
//         ),
//       },
//       {
//         part: 4,
//         questionIds: data.part4Groups.flatMap((g) =>
//           g.questions.map((q) => q.id)
//         ),
//       },
//       { part: 5, questionIds: data.part5.map((q) => q.id) },
//       {
//         part: 6,
//         questionIds: data.part6Passages.flatMap((p) =>
//           p.questions.map((q) => q.id)
//         ),
//       },
//       {
//         part: 7,
//         questionIds: data.part7Passages.flatMap((p) =>
//           p.questions.map((q) => q.id)
//         ),
//       },
//     ];
//   }, [data]);

//   function handleSubmit() {
//     const totalAnswered = Object.keys(answers).length;
//     alert(`Bạn đã trả lời ${totalAnswered} trên 200 câu.`);
//   }

//   return (
//     <div className="toeic">
//       <div className="toeic__container">
//         <div className="toeic__left" ref={leftContainerRef}>
//           <TestHeader
//             title="New Economy TOEIC Test 1"
//             onExit={() => alert("Thoát khỏi bài kiểm tra")}
//           />

//           <div className="toeic__audio">
//             <div className="audio__controls">
//               🔊 <input type="range" min="0" max="100" defaultValue="0" />
//             </div>
//             <div className="audio__settings">00:00</div>
//           </div>

//           <div className="toeic__tabs">
//             {[1, 2, 3, 4, 5, 6, 7].map((p) => (
//               <button
//                 key={p}
//                 className={`toeic__tab ${
//                   activePart === p ? "toeic__tab--active" : ""
//                 }`}
//                 onClick={() => setActivePart(p)}
//               >
//                 Part {p}
//               </button>
//             ))}
//           </div>

//           <div className="toeic__content">
//             {activePart === 1 && (
//               <Part1
//                 items={data.part1}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//               />
//             )}
//             {activePart === 2 && (
//               <Part2
//                 items={data.part2}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//               />
//             )}
//             {activePart === 3 && (
//               <Part3
//                 groups={data.part3Groups}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//               />
//             )}
//             {activePart === 4 && (
//               <Part4
//                 groups={data.part4Groups}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//               />
//             )}
//             {activePart === 5 && (
//               <Part5
//                 items={data.part5}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//               />
//             )}
//             {activePart === 6 && (
//               <Part6
//                 passages={data.part6Passages}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//               />
//             )}
//             {activePart === 7 && (
//               <Part7
//                 passages={data.part7Passages}
//                 onAnswer={handleAnswer}
//                 registerRef={registerRef}
//                 answers={answers}
//               />
//             )}
//           </div>
//         </div>

//         <div className="toeic__right">
//           <QuestionNavigator
//             partsSummary={partsSummary}
//             answers={answers}
//             onJump={handleJump}
//           />
//         </div>
//       </div>

//       <div className="toeic__footer">&nbsp;</div>
//     </div>
//   );
// }
