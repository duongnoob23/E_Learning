const {
  Test,
  Part,
  Question,
  Choice,
  ExamSession,
  UserAnswer,
  UserExamStatistics,
  PartStatistics,
  TestDiscussion,
  TestComment,
  User,
  SpeakingResponse,
  WritingResponse,
  ExamTag,
  QuestionTag,
} = require("../../models");
const { Op } = require("sequelize");

const { transcribeAudio } = require("./whisperService");
const { scoreResponse } = require("./multiPAService");

// Helper function để log lỗi một cách nhất quán
const logError = (functionName, error, context = {}) => {
  console.error(`[EXAM_SERVICE] ${functionName} | ${error.message}`);
  if (Object.keys(context).length > 0) {
    console.error(`  Context:`, context);
  }
  if (error.stack && process.env.NODE_ENV === "development") {
    console.error(`  Stack:`, error.stack.split("\n").slice(0, 3).join("\n"));
  }
};

// GET /api/tests - Lấy danh sách đề thi
exports.getTests = async (filters = {}) => {
  try {
    const { exam_type, difficulty_level, page = 1, limit = 20 } = filters;

    const whereClause = {};
    if (exam_type) whereClause.exam_type = exam_type;
    if (difficulty_level) whereClause.difficulty_level = difficulty_level;

    const offset = (page - 1) * limit;

    const { count, rows: tests } = await Test.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    if (!tests || tests.length === 0) {
      return {
        EM: "Không tìm thấy đề thi",
        EC: "2",
        DT: null,
      };
    }

    return {
      EM: "Lấy danh sách đề thi thành công",
      EC: "0",
      DT: {
        tests,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    logError("getTests", error, { filters });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách đề thi",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/tests/{test_id} - Lấy chi tiết đề thi
exports.getTestDetail = async (test_id) => {
  try {
    const test = await Test.findById(test_id);

    if (!test) {
      return {
        EM: "Không tìm thấy đề thi",
        EC: "2",
        DT: null,
      };
    }

    return {
      EM: "Lấy chi tiết đề thi thành công",
      EC: "0",
      DT: test,
    };
  } catch (error) {
    logError("getTestDetail", error, { test_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy chi tiết đề thi",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/tests/{test_id}/parts - Lấy danh sách parts của đề thi
exports.getTestParts = async (test_id) => {
  try {
    const parts = await Part.findByTestId(test_id);

    if (!parts || parts.length === 0) {
      return {
        EM: "Không tìm thấy phần thi nào",
        EC: "2",
        DT: null,
      };
    }

    return {
      EM: "Lấy danh sách phần thi thành công",
      EC: "0",
      DT: parts,
    };
  } catch (error) {
    logError("getTestParts", error, { test_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách phần thi",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/tests/{test_id}/result - Lấy kết quả thi của đề thi
exports.getPracticeTestResult = async (test_id, user_id) => {
  try {
    const examSessions = await ExamSession.findByUserIdAndTestId(
      user_id,
      test_id
    );
    if (!examSessions || examSessions.length === 0) {
      return {
        EM: "Bạn chưa thi đề này",
        EC: "2",
        DT: null,
      };
    }

    return {
      EM: "Lấy kết quả thi thành công",
      EC: "0",
      DT: examSessions,
    };
  } catch (error) {
    logError("getPracticeTestResult", error, { test_id, user_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy kết quả thi",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/parts/{part_id}/questions - Lấy danh sách câu hỏi của part
exports.getPartQuestions = async (part_id) => {
  try {
    const questions = await Question.findByPartIdWithChoices(part_id);

    if (!questions || questions.length === 0) {
      return {
        EM: "Không tìm thấy câu hỏi nào",
        EC: "2",
        DT: null,
      };
    }

    return {
      EM: "Lấy danh sách câu hỏi thành công",
      EC: "0",
      DT: questions,
    };
  } catch (error) {
    logError("getPartQuestions", error, { part_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách câu hỏi",
      EC: "-2",
      DT: null,
    };
  }
};

// POST /api/exam-sessions/start - Bắt đầu phiên thi
exports.startExamSession = async (sessionData) => {
  try {
    const {
      user_id,
      test_id,
      session_type,
      selected_parts,
      time_limit_minutes,
    } = sessionData;

    // Kiểm tra đề thi có tồn tại không
    const test = await Test.findById(test_id);
    if (!test) {
      return {
        EM: "Không tìm thấy đề thi",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra xem có phiên thi đang diễn ra không
    const activeSession = await ExamSession.findActiveSession(user_id, test_id);
    if (activeSession) {
      return {
        EM: "Bạn đang có phiên thi đang diễn ra",
        EC: "3",
        DT: activeSession,
      };
    }

    // Tạo phiên thi mới
    const examSession = await ExamSession.createSession({
      user_id,
      test_id,
      session_type: session_type || "FULL_TEST",
      start_time: new Date(),
      selected_parts: selected_parts ? JSON.stringify(selected_parts) : null,
      time_limit_minutes: time_limit_minutes || test.total_duration,
      status: "IN_PROGRESS",
    });

    return {
      EM: "Bắt đầu phiên thi thành công",
      EC: "0",
      DT: examSession,
    };
  } catch (error) {
    logError("startExamSession", error, { user_id, test_id, session_type });
    return {
      EM: "Có lỗi xảy ra trong quá trình bắt đầu phiên thi",
      EC: "-2",
      DT: null,
    };
  }
};
// POST /api/exam-sessions/{session_id}/submit - Nộp bài thi
// exports.submitExamSession = async (session_id, user_id, answers) => {
//   try {
//     // Kiểm tra phiên thi có tồn tại và thuộc về user không
//     const examSession = await ExamSession.findById(session_id);
//     if (!examSession || examSession.user_id !== user_id) {
//       return {
//         EM: "Không tìm thấy phiên thi hoặc bạn không có quyền truy cập",
//         EC: "2",
//         DT: null,
//       };
//     }

//     if (examSession.status !== "IN_PROGRESS") {
//       return {
//         EM: "Phiên thi đã kết thúc",
//         EC: "3",
//         DT: null,
//       };
//     }

//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     let skippedAnswers = 0;
//     const totalQuestions = answers.length;
//     const partStats = {}; // { part_id: { total: x, correct: y } }

//     // Xử lý từng câu trả lời
//     for (const ans of answers) {
//       const question = await Question.findById(ans.question_id);
//       if (!question) continue;

//       let isCorrect = null;
//       let selectedChoice = null;

//       if (ans.selected_choice_id) {
//         selectedChoice = await Choice.findById(ans.selected_choice_id);
//         isCorrect = selectedChoice ? selectedChoice.is_correct : false;

//         if (isCorrect) {
//           correctAnswers++;
//         } else {
//           wrongAnswers++;
//         }
//       } else {
//         skippedAnswers++;
//       }

//       // Lưu UserAnswer
//       await UserAnswer.createAnswer({
//         exam_session_id: session_id,
//         question_id: ans.question_id,
//         selected_choice_id: ans.selected_choice_id || null,
//         is_correct: isCorrect,
//         answer_time: new Date(),
//       });

//       // Thống kê theo Part
//       if (!partStats[question.part_id]) {
//         partStats[question.part_id] = { total: 0, correct: 0 };
//       }
//       partStats[question.part_id].total += 1;
//       if (isCorrect) partStats[question.part_id].correct += 1;
//     }

//     // Tính điểm tổng
//     const totalScore = Math.round((correctAnswers / totalQuestions) * 100);

//     // Cập nhật phiên thi
//     const endTime = new Date();
//     const durationSeconds = Math.floor(
//       (endTime - new Date(examSession.start_time)) / 1000
//     );

//     await ExamSession.updateSession(session_id, {
//       end_time: endTime,
//       duration_seconds: durationSeconds,
//       total_score: totalScore,
//       correct_answers: correctAnswers,
//       wrong_answers: wrongAnswers,
//       skipped_answers: skippedAnswers,
//       status: "COMPLETED",
//     });

//     // Cập nhật thống kê người dùng
//     await this.updateUserStatistics(
//       user_id,
//       totalScore,
//       totalQuestions,
//       correctAnswers
//     );

//     // Cập nhật thống kê từng part
//     for (const [part_id, stats] of Object.entries(partStats)) {
//       await PartStatistics.updatePartPerformance(
//         user_id,
//         parseInt(part_id),
//         stats.total,
//         stats.correct
//       );
//     }

//     const updatedSession = await ExamSession.findById(session_id);

//     return {
//       EM: "Nộp bài thi thành công",
//       EC: "0",
//       DT: updatedSession,
//     };
//   } catch (error) {
//     console.error("Error in submitExamSession service:", error);
//     return {
//       EM: "Có lỗi xảy ra trong quá trình nộp bài thi",
//       EC: "-2",
//       DT: null,
//     };
//   }
// };

// exports.submitExamSession = async (session_id, user_id, answers) => {
//   try {
//     // 1️⃣ Kiểm tra phiên thi có hợp lệ không
//     const examSession = await ExamSession.findById(session_id);
//     if (!examSession || examSession.user_id !== user_id) {
//       return {
//         EM: "Không tìm thấy phiên thi hoặc bạn không có quyền truy cập",
//         EC: "2",
//         DT: null,
//       };
//     }

//     if (examSession.status !== "IN_PROGRESS") {
//       return {
//         EM: "Phiên thi đã kết thúc",
//         EC: "3",
//         DT: null,
//       };
//     }

//     // 2️⃣ Lấy toàn bộ câu hỏi trong bài test
//     const test = await Test.findWithAll(examSession.test_id);
//     const allQuestions = test.parts.flatMap((p) => p.questions);

//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     let skippedAnswers = 0;
//     const partStats = {};

//     // Chuyển answers thành map để tra nhanh
//     const userAnswerMap = new Map(answers.map((a) => [a.question_id, a]));

//     // 3️⃣ Duyệt qua toàn bộ câu hỏi của test
//     for (const question of allQuestions) {
//       const ans = userAnswerMap.get(question.question_id);
//       let isCorrect = -1; // mặc định là chưa trả lời
//       let selectedChoiceId = null;

//       if (ans && ans.selected_choice_id) {
//         selectedChoiceId = ans.selected_choice_id;
//         const selectedChoice = await Choice.findById(selectedChoiceId);

//         if (selectedChoice) {
//           isCorrect = selectedChoice.is_correct ? 1 : 0;
//         } else {
//           isCorrect = 0;
//         }

//         if (isCorrect === 1) correctAnswers++;
//         else wrongAnswers++;
//       } else {
//         skippedAnswers++;
//       }

//       // 4️⃣ Lưu UserAnswer
//       await UserAnswer.createAnswer({
//         exam_session_id: session_id,
//         question_id: question.question_id,
//         selected_choice_id: selectedChoiceId,
//         is_correct: isCorrect,
//         answer_time: new Date(),
//       });

//       // 5️⃣ Thống kê theo Part
//       if (!partStats[question.part_id]) {
//         partStats[question.part_id] = { total: 0, correct: 0 };
//       }
//       partStats[question.part_id].total += 1;
//       if (isCorrect === 1) partStats[question.part_id].correct += 1;
//     }

//     // 6️⃣ Tính điểm
//     const totalQuestions = allQuestions.length;
//     const totalScore = Math.round((correctAnswers / totalQuestions) * 100);

//     // 7️⃣ Cập nhật phiên thi
//     const endTime = new Date();
//     const durationSeconds = Math.floor(
//       (endTime - new Date(examSession.start_time)) / 1000
//     );

//     await ExamSession.updateSession(session_id, {
//       end_time: endTime,
//       duration_seconds: durationSeconds,
//       total_score: totalScore,
//       correct_answers: correctAnswers,
//       wrong_answers: wrongAnswers,
//       skipped_answers: skippedAnswers,
//       status: "COMPLETED",
//     });

//     // 8️⃣ Cập nhật thống kê người dùng
//     await this.updateUserStatistics(
//       user_id,
//       totalScore,
//       totalQuestions,
//       correctAnswers
//     );

//     // 9️⃣ Cập nhật thống kê từng Part
//     for (const [part_id, stats] of Object.entries(partStats)) {
//       await PartStatistics.updatePartPerformance(
//         user_id,
//         parseInt(part_id),
//         stats.total,
//         stats.correct
//       );
//     }

//     const updatedSession = await ExamSession.findById(session_id);

//     return {
//       EM: "Nộp bài thi thành công",
//       EC: "0",
//       DT: updatedSession,
//     };
//   } catch (error) {
//     console.error("Error in submitExamSession service:", error);
//     return {
//       EM: "Có lỗi xảy ra trong quá trình nộp bài thi",
//       EC: "-2",
//       DT: null,
//     };
//   }
// };

exports.submitExamSession = async (session_id, user_id, answers) => {
  try {
    // 1) Validate session & ownership
    const examSession = await ExamSession.findById(session_id);
    if (!examSession || examSession.user_id !== user_id) {
      return {
        EM: "Không tìm thấy phiên thi hoặc bạn không có quyền truy cập",
        EC: "2",
        DT: null,
      };
    }
    if (examSession.status !== "IN_PROGRESS") {
      return { EM: "Phiên thi đã kết thúc", EC: "3", DT: null };
    }

    // answers: [{ question_id, selected_choice_id }, ...]
    // Normalize input (ensure array)
    answers = Array.isArray(answers) ? answers : [];

    // 2) Lấy toàn bộ cấu trúc Test -> parts -> questions (dùng hàm có sẵn)
    const test = await Test.findWithAll(examSession.test_id);
    if (!test || !test.parts) {
      return { EM: "Không tìm thấy câu hỏi trong bài thi", EC: "4", DT: null };
    }

    // 3) Gom mọi question từ tất cả các part
    const allQuestions = test.parts.flatMap((p) =>
      (p.questions || []).map((q) => {
        // ensure plain object shape, Sequelize instances may appear
        return q.toJSON ? q.toJSON() : q;
      })
    );

    if (!allQuestions.length) {
      return { EM: "Không tìm thấy câu hỏi trong bài thi", EC: "4", DT: null };
    }

    // 4) Tạo map cho answers user (để tra nhanh)
    const answerMap = new Map();
    for (const a of answers) {
      if (a && a.question_id != null) {
        // normalize numeric/string keys
        answerMap.set(String(a.question_id), {
          question_id: a.question_id,
          selected_choice_id: a.selected_choice_id ?? null,
        });
      }
    }

    // 5) Tính toán / bổ sung các câu thiếu: nếu question không có trong answerMap => treat as skipped
    // We'll iterate allQuestions and produce a normalized list `toProcess`
    const toProcess = allQuestions.map((q) => {
      const qid = String(q.question_id ?? q.id ?? q.questionId);
      const provided = answerMap.get(qid);
      return {
        question_id: Number(qid),
        part_id: q.part_id ?? q.partId ?? null,
        selected_choice_id: provided ? provided.selected_choice_id : null,
        originalQuestion: q,
      };
    });

    // 6) Init stats
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedAnswers = 0;
    const totalQuestions = toProcess.length;
    const partStats = {}; // { part_id: { total: x, correct: y } }

    // 7) Process each question: check choice correctness, upsert UserAnswer
    for (const item of toProcess) {
      const { question_id, selected_choice_id, part_id } = item;

      let isCorrect = null; // -1 = skipped / not answered
      if (selected_choice_id != null) {
        // if selected_choice_id provided, check correctness
        const selectedChoice = await Choice.findById(selected_choice_id);
        const correctFlag = selectedChoice
          ? !!selectedChoice.is_correct
          : false;
        isCorrect = correctFlag ? 1 : 0;
        if (isCorrect === 1) correctAnswers++;
        else wrongAnswers++;
      } else {
        skippedAnswers++;
        isCorrect = null;
      }

      // Upsert user answer: if exists (same session + question), update; else create.
      // We don't know exact helper signatures in your project; try generic approach:
      let existing = null;
      try {
        if (UserAnswer.findOne) {
          existing = await UserAnswer.findOne({
            where: { exam_session_id: session_id, question_id },
          });
        }
      } catch (e) {
        // ignore if model doesn't implement findOne
        existing = null;
      }

      if (existing) {
        // update
        try {
          if (existing.update) {
            await existing.update({
              selected_choice_id: selected_choice_id || null,
              is_correct: isCorrect,
              answer_time: new Date(),
            });
          } else if (UserAnswer.updateAnswer) {
            // fallback to custom helper if present
            await UserAnswer.updateAnswer(
              existing.id || { exam_session_id: session_id, question_id },
              {
                selected_choice_id: selected_choice_id || null,
                is_correct: isCorrect,
                answer_time: new Date(),
              }
            );
          } else {
            // last fallback: create new record (may duplicate if no unique constraint)
            await UserAnswer.createAnswer({
              exam_session_id: session_id,
              question_id,
              selected_choice_id: selected_choice_id || null,
              is_correct: isCorrect,
              answer_time: new Date(),
            });
          }
        } catch (err) {
          // If update fails, attempt create to avoid blocking entire flow
          await UserAnswer.createAnswer({
            exam_session_id: session_id,
            question_id,
            selected_choice_id: selected_choice_id || null,
            is_correct: isCorrect,
            answer_time: new Date(),
          });
        }
      } else {
        // create
        await UserAnswer.createAnswer({
          exam_session_id: session_id,
          question_id,
          selected_choice_id: selected_choice_id || null,
          is_correct: isCorrect,
          answer_time: new Date(),
        });
      }

      // 8) Update partStats
      const pid = part_id != null ? String(part_id) : "unknown";
      if (!partStats[pid]) partStats[pid] = { total: 0, correct: 0 };
      partStats[pid].total += 1;
      if (isCorrect === 1) partStats[pid].correct += 1;
    }

    // 9) Calculate total score
    const totalScore =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    // 10) Update exam session
    const endTime = new Date();
    const durationSeconds = Math.floor(
      (endTime - new Date(examSession.start_time)) / 1000
    );

    await ExamSession.updateSession(session_id, {
      end_time: endTime,
      duration_seconds: durationSeconds,
      total_score: totalScore,
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
      skipped_answers: skippedAnswers,
      status: "COMPLETED",
    });

    // 11) Update PartStatistics for each part
    for (const [pid, stats] of Object.entries(partStats)) {
      // skip unknown part if any
      if (pid === "unknown") continue;
      const partIdNum = parseInt(pid, 10);
      if (PartStatistics.updatePartPerformance) {
        await PartStatistics.updatePartPerformance(
          user_id,
          partIdNum,
          stats.total,
          stats.correct,
          session_id // ✅ Truyền exam_session_id vào hàm updatePartPerformance
        );
      }
    }

    // 12) Optional update user overall statistics if helper exists
    if (typeof this.updateUserStatistics === "function") {
      await this.updateUserStatistics(
        user_id,
        totalScore,
        totalQuestions,
        correctAnswers
      );
    }

    // 13) Return updated session
    const updatedSession = await ExamSession.findById(session_id);
    return { EM: "Nộp bài thi thành công", EC: "0", DT: updatedSession };
  } catch (error) {
    logError("submitExamSession", error, {
      session_id,
      user_id,
      answersCount: answers?.length,
    });
    return {
      EM: "Có lỗi xảy ra trong quá trình nộp bài thi",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/exam-sessions/{session_id}/result - Lấy kết quả thi
exports.getExamResult = async (session_id, user_id) => {
  try {
    const examSession = await ExamSession.findById(session_id);

    if (!examSession || examSession.user_id !== user_id) {
      return {
        EM: "Không tìm thấy phiên thi hoặc bạn không có quyền truy cập",
        EC: "2",
        DT: null,
      };
    }

    if (examSession.status !== "COMPLETED") {
      return {
        EM: "Phiên thi chưa hoàn thành",
        EC: "3",
        DT: null,
      };
    }

    // Lấy thống kê theo part
    const partStatistics = await PartStatistics.findByUserId(user_id);

    return {
      EM: "Lấy kết quả thi thành công",
      EC: "0",
      DT: {
        session: examSession,
        part_statistics: partStatistics,
      },
    };
  } catch (error) {
    logError("getExamResult", error, { session_id, user_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy kết quả thi",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/exam-sessions/{session_id}/review - Xem lại bài thi
exports.reviewExamSession = async (session_id, user_id) => {
  try {
    const examSession = await ExamSession.findWithAnswers(session_id);

    if (!examSession || examSession.user_id !== user_id) {
      return {
        EM: "Không tìm thấy phiên thi",
        EC: "2",
        DT: null,
      };
    }

    if (examSession.status !== "COMPLETED") {
      return {
        EM: "Phiên thi chưa hoàn thành",
        EC: "3",
        DT: null,
      };
    }

    // Lấy chi tiết câu hỏi và đáp án
    const userAnswers = await UserAnswer.findBySessionId(session_id);
    const detailedAnswers = [];

    for (const answer of userAnswers) {
      const question = await Question.findWithChoices(answer.question_id);
      const selectedChoice = answer.selected_choice_id
        ? await Choice.findById(answer.selected_choice_id)
        : null;

      detailedAnswers.push({
        ...answer.toJSON(),
        question,
        selected_choice: selectedChoice,
      });
    }

    return {
      EM: "Xem lại bài thi thành công",
      EC: "0",
      DT: {
        session: examSession,
        detailed_answers: detailedAnswers,
      },
    };
  } catch (error) {
    logError("reviewExamSession", error, { session_id, user_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình xem lại bài thi",
      EC: "-2",
      DT: null,
    };
  }
};

// POST /api/exam-sessions/{session_id}/retry-wrong - Làm lại câu sai
exports.retryWrongAnswers = async (session_id, user_id) => {
  try {
    const examSession = await ExamSession.findById(session_id);

    if (!examSession || examSession.user_id !== user_id) {
      return {
        EM: "Không tìm thấy phiên thi",
        EC: "2",
        DT: null,
      };
    }

    if (examSession.status !== "COMPLETED") {
      return {
        EM: "Phiên thi chưa hoàn thành",
        EC: "3",
        DT: null,
      };
    }

    // Lấy các câu trả lời sai
    const wrongAnswers = await UserAnswer.findWrongAnswers(session_id);

    if (!wrongAnswers || wrongAnswers.length === 0) {
      return {
        EM: "Không có câu trả lời sai nào để làm lại",
        EC: "4",
        DT: null,
      };
    }

    // Tạo phiên thi mới cho việc làm lại câu sai
    const retrySession = await ExamSession.createSession({
      user_id,
      test_id: examSession.test_id,
      session_type: "REVIEW",
      start_time: new Date(),
      selected_parts: null,
      time_limit_minutes: null,
      status: "IN_PROGRESS",
      parent_session_id: session_id,
    });

    // Lấy chi tiết câu hỏi sai
    const wrongQuestions = [];
    for (const answer of wrongAnswers) {
      const question = await Question.findWithChoices(answer.question_id);
      wrongQuestions.push(question);
    }

    return {
      EM: "Tạo phiên làm lại câu sai thành công",
      EC: "0",
      DT: {
        retry_session: retrySession,
        wrong_questions: wrongQuestions,
      },
    };
  } catch (error) {
    logError("retryWrongAnswers", error, { session_id, user_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình tạo phiên làm lại câu sai",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/user/statistics - Lấy thống kê người dùng
exports.getUserStatistics = async (user_id) => {
  try {
    // Lấy thống kê tổng quan
    const userStats = await UserExamStatistics.findByUserId(user_id);

    // Lấy thống kê theo part
    const partStats = await PartStatistics.findByUserId(user_id);

    // Lấy lịch sử thi gần đây
    const recentSessions = await ExamSession.findRecentSessions(user_id, 10);

    return {
      EM: "Lấy thống kê người dùng thành công",
      EC: "0",
      DT: {
        user_statistics: userStats,
        part_statistics: partStats,
        recent_sessions: recentSessions,
      },
    };
  } catch (error) {
    logError("getUserStatistics", error, { user_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy thống kê người dùng",
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/discussions/test/{test_id} - Lấy thảo luận của đề thi
exports.getTestDiscussions = async (test_id, options = {}) => {
  try {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows: discussions } = await TestDiscussion.findAndCountAll({
      where: { test_id },
      limit: parseInt(limit),
      offset: offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "full_name", "avatar_url"],
        },
        {
          model: TestComment,
          as: "comments",
          limit: 3,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["user_id", "username", "full_name", "avatar_url"],
            },
          ],
        },
      ],
    });

    return {
      EM: "Lấy thảo luận thành công",
      EC: "0",
      DT: {
        discussions,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    logError("getTestDiscussions", error, { test_id, options });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy thảo luận",
      EC: "-2",
      DT: null,
    };
  }
};

// POST /api/discussions - Tạo thảo luận mới
exports.createDiscussion = async (discussionData) => {
  try {
    const { test_id, user_id, title, content } = discussionData;

    // Kiểm tra đề thi có tồn tại không
    const test = await Test.findById(test_id);
    if (!test) {
      return {
        EM: "Không tìm thấy đề thi",
        EC: "2",
        DT: null,
      };
    }

    // Tạo thảo luận mới
    const discussion = await TestDiscussion.createDiscussion({
      test_id,
      user_id,
      title,
      content,
    });

    // Lấy thảo luận với thông tin user
    const discussionWithUser = await TestDiscussion.findOne({
      where: { test_discussion_id: discussion.test_discussion_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "full_name", "avatar_url"],
        },
      ],
    });

    return {
      EM: "Tạo thảo luận thành công",
      EC: "0",
      DT: discussionWithUser,
    };
  } catch (error) {
    logError("createDiscussion", error, { test_id, user_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình tạo thảo luận",
      EC: "-2",
      DT: null,
    };
  }
};

// POST /api/discussions/{discussion_id}/comments - Thêm bình luận
exports.addComment = async (commentData) => {
  try {
    const { test_discussion_id, user_id, content, parent_comment_id } =
      commentData;

    // Kiểm tra thảo luận có tồn tại không
    const discussion = await TestDiscussion.findById(test_discussion_id);
    if (!discussion) {
      return {
        EM: "Không tìm thấy thảo luận",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra parent comment nếu có
    if (parent_comment_id) {
      const parentComment = await TestComment.findById(parent_comment_id);
      if (!parentComment) {
        return {
          EM: "Không tìm thấy bình luận cha",
          EC: "3",
          DT: null,
        };
      }
    }

    // Tạo bình luận mới
    const comment = await TestComment.createComment({
      test_discussion_id,
      user_id,
      content,
      parent_comment_id: parent_comment_id || null,
    });

    // Lấy bình luận với thông tin user
    const commentWithUser = await TestComment.findOne({
      where: { test_comment_id: comment.test_comment_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "full_name", "avatar_url"],
        },
      ],
    });

    return {
      EM: "Thêm bình luận thành công",
      EC: "0",
      DT: commentWithUser,
    };
  } catch (error) {
    logError("addComment", error, { test_discussion_id, user_id });
    return {
      EM: "Có lỗi xảy ra trong quá trình thêm bình luận",
      EC: "-2",
      DT: null,
    };
  }
};

// Helper function - Cập nhật thống kê người dùng
exports.updateUserStatistics = async (
  user_id,
  score,
  total_questions,
  correct_answers
) => {
  try {
    let userStats = await UserExamStatistics.findByUserId(user_id);

    if (!userStats) {
      // Tạo mới nếu chưa có
      userStats = await UserExamStatistics.create({
        user_id,
        total_tests_taken: 1,
        total_questions_answered: total_questions,
        total_correct_answers: correct_answers,
        average_score: score,
        highest_score: score,
        lowest_score: score,
        total_study_time_minutes: 0,
      });
    } else {
      // Cập nhật thống kê
      const newTotalTests = userStats.total_tests_taken + 1;
      const newTotalQuestions =
        userStats.total_questions_answered + total_questions;
      const newTotalCorrect = userStats.total_correct_answers + correct_answers;
      const newAverageScore = Math.round(
        (userStats.average_score * userStats.total_tests_taken + score) /
          newTotalTests
      );

      await UserExamStatistics.update(
        {
          total_tests_taken: newTotalTests,
          total_questions_answered: newTotalQuestions,
          total_correct_answers: newTotalCorrect,
          average_score: newAverageScore,
          highest_score: Math.max(userStats.highest_score, score),
          lowest_score: Math.min(userStats.lowest_score, score),
        },
        {
          where: { user_id },
        }
      );
    }
  } catch (error) {
    logError("updateUserStatistics", error, {
      user_id,
      score,
      total_questions,
      correct_answers,
    });
  }
};

// GET /api/exam-sessions/{session_id}/result-by-tags - Lấy kết quả phân tích theo tag
exports.getResultByTags = async (session_id, user_id) => {
  try {
    // Kiểm tra session có tồn tại và thuộc về user không
    const session = await ExamSession.findOne({
      where: {
        exam_session_id: session_id,
        user_id: user_id,
        status: "COMPLETED",
      },
    });

    if (!session) {
      return {
        EM: "Không tìm thấy phiên thi hoặc phiên thi chưa hoàn thành",
        EC: "2",
        DT: null,
      };
    }

    // Lấy tất cả câu trả lời của user trong session này
    const userAnswers = await UserAnswer.findAll({
      where: { exam_session_id: session_id },
      include: [
        {
          model: Question,
          as: "question",
          include: [
            {
              model: QuestionTag,
              as: "questionTags",
              include: [
                {
                  model: ExamTag,
                  as: "examTag",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!userAnswers || userAnswers.length === 0) {
      return {
        EM: "Không tìm thấy câu trả lời",
        EC: "2",
        DT: null,
      };
    }

    // Tạo map để lưu thống kê theo tag
    const tagStats = new Map();

    // Duyệt qua tất cả câu trả lời
    userAnswers.forEach((answer) => {
      const question = answer.question;
      if (!question || !question.questionTags) return;

      // Duyệt qua tất cả tag của câu hỏi
      question.questionTags.forEach((questionTag) => {
        const tag = questionTag.examTag;
        if (!tag) return;

        const tagName = tag.name;

        // Khởi tạo thống kê cho tag nếu chưa có
        if (!tagStats.has(tagName)) {
          tagStats.set(tagName, {
            tag_name: tagName,
            tag_description: tag.description,
            total_questions: 0,
            correct_answers: 0,
            wrong_answers: 0,
            skipped_answers: 0,
            accuracy_rate: 0,
            question_list: [],
          });
        }

        const stats = tagStats.get(tagName);
        stats.total_questions++;

        // Thêm thông tin câu hỏi vào danh sách
        stats.question_list.push({
          question_id: question.question_id,
          question_number: question.question_number,
          question_text: question.question_text.substring(0, 100) + "...", // Cắt ngắn text
          is_correct: answer.is_correct,
          selected_choice_id: answer.selected_choice_id,
        });

        // Cập nhật thống kê
        if (answer.is_correct === true) {
          stats.correct_answers++;
        } else if (answer.is_correct === false) {
          stats.wrong_answers++;
        } else {
          stats.skipped_answers++;
        }

        // Tính tỷ lệ chính xác
        if (stats.total_questions > 0) {
          stats.accuracy_rate = (
            (stats.correct_answers / stats.total_questions) *
            100
          ).toFixed(2);
        }
      });
    });

    // Chuyển Map thành Array và sắp xếp theo tên tag
    const tagAnalysis = Array.from(tagStats.values()).sort((a, b) =>
      a.tag_name.localeCompare(b.tag_name)
    );

    // Tính tổng thống kê
    const totalStats = {
      total_questions: userAnswers.length,
      total_correct: userAnswers.filter((a) => a.is_correct === true).length,
      total_wrong: userAnswers.filter((a) => a.is_correct === false).length,
      total_skipped: userAnswers.filter((a) => a.is_correct === null).length,
      overall_accuracy: (
        (userAnswers.filter((a) => a.is_correct === true).length /
          userAnswers.length) *
        100
      ).toFixed(2),
    };

    return {
      EM: "Lấy kết quả phân tích theo tag thành công",
      EC: "0",
      DT: {
        session_info: {
          session_id: session.exam_session_id,
          test_id: session.test_id,
          total_score: session.total_score,
          start_time: session.start_time,
          end_time: session.end_time,
          duration_seconds: session.duration_seconds,
        },
        overall_statistics: totalStats,
        tag_analysis: tagAnalysis,
      },
    };
  } catch (error) {
    logError("getResultByTags", error, { session_id, user_id });
    return {
      EM: "Lỗi server khi lấy kết quả phân tích theo tag",
      EC: "1",
      DT: null,
    };
  }
};

// --------- Speaking and Writing Routes --------- //

// POST /api/speaking/upload - Tải lên tệp âm thanh speaking
exports.uploadSpeakingAudio = async (audioData) => {
  try {
    const { user_id, session_id, question_id, audio_file_path, language } =
      audioData;

    // Kiểm tra phiên thi có tồn tại không
    const examSession = await ExamSession.findById(session_id);
    if (!examSession) {
      return {
        EM: "Không tìm thấy phiên thi",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra câu hỏi speaking có tồn tại không
    const speakingQuestion = await Question.findById(question_id);
    if (!speakingQuestion || speakingQuestion.question_type !== "SPEAKING") {
      return {
        EM: "Không tìm thấy câu hỏi speaking",
        EC: "3",
        DT: null,
      };
    }

    // Transcribe audio
    let transcription = "";
    try {
      transcription = await transcribeAudio(audio_file_path, language);
    } catch (transcribeError) {
      logError("uploadSpeakingAudio.transcribe", transcribeError, {
        audio_file_path,
        language,
      });
      return {
        EM: `Lỗi xử lý âm thanh: ${transcribeError.message}`,
        EC: "-3",
        DT: null,
      };
    }

    // Tạo phản hồi speaking mới
    const speakingResponse = await SpeakingResponse.create({
      session_id,
      question_id,
      user_id,
      audio_file_path,
      transcription,
      language,
      processing_status: "COMPLETED",
    });

    return {
      EM: "Tải lên tệp âm thanh thành công",
      EC: "0",
      DT: speakingResponse,
    };
  } catch (error) {
    logError("uploadSpeakingAudio", error, {
      user_id,
      session_id,
      question_id,
    });
    return {
      EM: `Có lỗi xảy ra: ${error.message}`,
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/speaking/session/{session_id}/responses - Lấy danh sách phản hồi speaking của phiên thi
exports.getSessionSpeakingResponses = async (session_id, options = {}) => {
  try {
    const { status, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const whereClause = { session_id };
    if (status) whereClause.processing_status = status;

    const { count, rows: responses } = await SpeakingResponse.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    return {
      EM: "Lấy danh sách phản hồi speaking thành công",
      EC: "0",
      DT: {
        responses,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    logError("getSessionSpeakingResponses", error, { session_id, options });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách phản hồi speaking",
      EC: "-2",
      DT: null,
    };
  }
};

// Chấm điểm speaking response using MultiPA (Multi-task Pronunciation Assessment)
exports.gradeSpeaking = async ({
  response_id,
  user_id,
  audio_file_path,
  language,
  question_text = null,  // Thêm để đánh giá content relevance
  reference_answer = null,  // Đáp án mẫu (optional)
}) => {
  try {
    if (!audio_file_path) {
      console.log("❌ Missing audio_file_path for Speaking assessment");
      return {
        EM: "Thiếu audio_file_path",
        EC: "-1",
        DT: null,
      };
    }
    const startTime = Date.now();
    const result = await scoreResponse(audio_file_path, "SPEAKING", language, question_text, reference_answer);

    
    const wordsToImprove = (result.words_to_improve || []).map((w) => ({
      word: w.word,
      score: w.score,
      issues: w.issues || [],
      tips: w.tips || [],
    }));

    
    const improvementSummary =
      wordsToImprove.length > 0
        ? `Các từ cần cải thiện: ${wordsToImprove.map((w) => w.word).join(", ")}`
        : "Phát âm tốt! Không có từ nào cần cải thiện.";

    const detailedFeedback = {
      summary: improvementSummary,
      words_to_improve: wordsToImprove,
      scores: {
        pronunciation: result.pronunciation_score,
        fluency: result.fluency_score,
        prosody: result.prosody_score,
        relevance: result.relevance_score || 0,  
      },
      content_feedback: result.content_feedback || [],  
    };

    const updateResult = await SpeakingResponse.update(
      {
        score: result.score,
        pronunciation_score: result.pronunciation_score,
        fluency_score: result.fluency_score,
        prosody_score: result.prosody_score,
        transcript: result.transcript,
        feedback: result.feedback,
        detailed_feedback: detailedFeedback,
        processing_status: "COMPLETED",
      },
      {
        where: { response_id, user_id },
      }
    );

    // Trả về kết quả đã được lọc
    return {
      EM: "Chấm bài Speaking thành công",
      EC: "0",
      DT: {
        score: result.score,
        pronunciation_score: result.pronunciation_score,
        fluency_score: result.fluency_score,
        prosody_score: result.prosody_score,
        relevance_score: result.relevance_score || 0,  // Điểm liên quan nội dung
        transcript: result.transcript,
        feedback: result.feedback,
        words_to_improve: wordsToImprove,
        improvement_summary: improvementSummary,
        content_feedback: result.content_feedback || [],  // Feedback về nội dung
      },
    };
  } catch (error) {
    console.error("❌ Error in gradeSpeaking service:", error);
    logError("gradeSpeaking", error, { response_id, user_id });
    return {
      EM: `Có lỗi xảy ra khi chấm Speaking: ${error.message}`,
      EC: "-2",
      DT: null,
    };
  }
};

// Chấm điểm writing response
exports.gradeWriting = async ({
  response_id,
  user_id,
  text,
  language,
  question_text = null,  
  reference_answer = null,  
}) => {
  try {
    console.log("=== gradeWriting Service ===");
    console.log("Input:", {
      response_id,
      user_id,
      text_length: text?.length,
      language,
      question_text: question_text ? "provided" : "not provided",
    });

    if (!text) {
      console.log("❌ Missing text for Writing assessment");
      return {
        EM: "Thiếu text cho Writing assessment",
        EC: "-1",
        DT: null,
      };
    }

    // Score writing using multiPAService (với question_text để đánh giá content relevance)
    console.log("🔄 Calling Python MultiPA service for WRITING...");
    const startTime = Date.now();
    const result = await scoreResponse(text, "WRITING", language, question_text, reference_answer);

    // Xử lý sentence feedback - chỉ giữ các câu cần cải thiện
    // Bao gồm: issues, suggestions, vocabulary_tips (gợi ý từ vựng), meaning_tips (gợi ý về ý nghĩa)
    const sentenceFeedback = (result.sentence_feedback || []).map((s) => ({
      index: s.index,
      sentence: s.sentence,
      score: s.score,
      issues: s.issues || [],
      suggestions: s.suggestions || [],
      vocabulary_tips: s.vocabulary_tips || [],  // Gợi ý từ vựng nâng cao
      meaning_tips: s.meaning_tips || [],  // Gợi ý về cấu trúc và ý nghĩa
    }));

    // Tạo detailed feedback với cấu trúc mới (bao gồm content relevance)
    const detailedFeedback = {
      sentence_feedback: sentenceFeedback,
      overall_advice: result.overall_advice || [],
      content_feedback: result.content_feedback || [],  // Feedback về nội dung so với câu hỏi
      scores: {
        grammar: result.grammar_score,
        vocabulary: result.vocabulary_score,
        coherence: result.coherence_score,
        task_completion: result.task_completion_score,
        spelling: result.spelling_score,
        relevance: result.relevance_score || 0,  // Điểm liên quan nội dung
      },
      text_stats: result.text_stats || {},
    };

    // Update WritingResponse in database
    console.log("💾 Updating WritingResponse in database...");
    const updateResult = await WritingResponse.update(
      {
        score: result.score,
        grammar_score: result.grammar_score,
        vocabulary_score: result.vocabulary_score,
        coherence_score: result.coherence_score,
        task_completion_score: result.task_completion_score,
        spelling_score: result.spelling_score,
        feedback: result.feedback,
        detailed_feedback: detailedFeedback,
        processing_status: "COMPLETED",
      },
      { where: { response_id, user_id } }
    );
    console.log("✅ Database updated:", {
      response_id,
      user_id,
      rows_affected: updateResult[0],
    });

    // Trả về kết quả với cấu trúc rõ ràng (bao gồm relevance score)
    return {
      EM: "Chấm bài Writing thành công",
      EC: "0",
      DT: {
        score: result.score,
        grammar_score: result.grammar_score,
        vocabulary_score: result.vocabulary_score,
        coherence_score: result.coherence_score,
        task_completion_score: result.task_completion_score,
        spelling_score: result.spelling_score,
        relevance_score: result.relevance_score || 0,  // Điểm liên quan nội dung
        feedback: result.feedback,
        sentence_feedback: sentenceFeedback,
        overall_advice: result.overall_advice || [],
        content_feedback: result.content_feedback || [],  // Feedback về nội dung
        text_stats: result.text_stats || {},
      },
    };
  } catch (error) {
    console.error("❌ Error in gradeWriting service:", error);
    logError("gradeWriting", error, { response_id, user_id });
    return {
      EM: `Có lỗi xảy ra khi chấm Writing: ${error.message}`,
      EC: "-2",
      DT: null,
    };
  }
};

// POST /api/writing/submit - Lưu bài viết writing
exports.submitWritingText = async (writingData) => {
  try {
    const {
      user_id,
      session_id,
      question_id,
      written_text,
      language = "en",
    } = writingData;

    // Kiểm tra phiên thi có tồn tại không
    const examSession = await ExamSession.findById(session_id);
    console.log("ExamSession lookup:", { session_id, found: !!examSession });
    if (!examSession) {
      console.log("❌ ExamSession not found for session_id:", session_id);
      return {
        EM: "Không tìm thấy phiên thi",
        EC: "2",
        DT: null,
      };
    }

    const writingQuestion = await Question.findById(question_id);
    console.log("Question found:", {
      found: !!writingQuestion,
      question_id: writingQuestion?.question_id,
      question_type: writingQuestion?.question_type,
      question_type_expected: "WRITING",
      question_type_match: writingQuestion?.question_type === "WRITING",
      part_id: writingQuestion?.part_id,
    });

    if (!writingQuestion) {
      console.log("❌ Question not found for question_id:", question_id);
      return {
        EM: "Không tìm thấy câu hỏi writing",
        EC: "3",
        DT: null,
      };
    }

    if (writingQuestion.question_type !== "WRITING") {
      console.log("❌ Question type mismatch:", {
        question_id,
        expected: "WRITING",
        actual: writingQuestion.question_type,
        part_id: writingQuestion.part_id,
      });
      try {
        const allQuestionsInPart = await Question.findAll({
          where: { part_id: writingQuestion.part_id },
          attributes: ["question_id", "question_number", "question_type"],
          order: [["question_number", "ASC"]],
        });
        allQuestionsInPart.forEach((q) => {
          const marker = q.question_id === question_id ? " ⬅️ (this one)" : "";
          console.log(
            `  - Question ${q.question_number}: ID=${q.question_id}, Type=${q.question_type}${marker}`
          );
        });
        const writingQuestions = allQuestionsInPart.filter(
          (q) => q.question_type === "WRITING"
        );
        if (writingQuestions.length > 0) {
          console.log(
            `✅ Found ${writingQuestions.length} WRITING question(s) in part ${writingQuestion.part_id}:`,
            writingQuestions.map((q) => ({
              question_id: q.question_id,
              question_number: q.question_number,
            }))
          );
          console.log(
            `💡 Suggestion: Use question_id ${writingQuestions[0].question_id} instead of ${question_id}`
          );
        } else {
          console.log(
            `⚠️ No WRITING questions found in part ${writingQuestion.part_id}`
          );
        }
      } catch (debugError) {
        console.log(
          "⚠️ Could not fetch questions for debugging:",
          debugError.message
        );
      }

      return {
        EM: "Không tìm thấy câu hỏi writing",
        EC: "3",
        DT: null,
      };
    }

    // Tính số từ
    const wordCount = written_text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Tạo phản hồi writing mới
    const writingResponse = await WritingResponse.create({
      session_id,
      question_id,
      user_id,
      written_text,
      word_count: wordCount,
      language,
      processing_status: "PENDING",
    });

    return {
      EM: "Lưu bài viết thành công",
      EC: "0",
      DT: writingResponse,
    };
  } catch (error) {
    logError("submitWritingText", error, {
      user_id,
      session_id,
      question_id,
    });
    return {
      EM: `Có lỗi xảy ra: ${error.message}`,
      EC: "-2",
      DT: null,
    };
  }
};

// GET /api/writing/session/{session_id}/responses - Lấy danh sách phản hồi writing của phiên thi
exports.getSessionWritingResponses = async (session_id, options = {}) => {
  try {
    const { status, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const whereClause = { session_id };
    if (status) whereClause.processing_status = status;

    const { count, rows: responses } = await WritingResponse.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    return {
      EM: "Lấy danh sách phản hồi writing thành công",
      EC: "0",
      DT: {
        responses,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    logError("getSessionWritingResponses", error, { session_id, options });
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách phản hồi writing",
      EC: "-2",
      DT: null,
    };
  }
};

// Update exam session (for writing completion)
exports.updateExamSession = async ({
  session_id,
  user_id,
  status,
  total_score,
  correct_answers,
  wrong_answers,
}) => {
  try {
    console.log("=== updateExamSession Service ===");
    console.log("Session ID:", session_id);
    console.log("User ID:", user_id);
    console.log("Update data:", {
      status,
      total_score,
      correct_answers,
      wrong_answers,
    });

    // Tìm session
    const examSession = await ExamSession.findById(session_id);
    if (!examSession) {
      return {
        EM: "Không tìm thấy phiên thi",
        EC: "-1",
        DT: null,
      };
    }

    // Kiểm tra quyền sở hữu
    if (examSession.user_id !== user_id) {
      return {
        EM: "Bạn không có quyền cập nhật phiên thi này",
        EC: "-2",
        DT: null,
      };
    }

    // Tính toán thời gian
    const endTime = new Date();
    const durationSeconds = Math.floor(
      (endTime - new Date(examSession.start_time)) / 1000
    );

    // Cập nhật session
    await ExamSession.updateSession(session_id, {
      end_time: endTime,
      duration_seconds: durationSeconds,
      total_score: total_score || 0,
      correct_answers: correct_answers || 0,
      wrong_answers: wrong_answers || 0,
      status: status || "COMPLETED",
    });

    // Lấy session đã cập nhật
    const updatedSession = await ExamSession.findById(session_id);

    console.log("✅ Session updated successfully");
    return {
      EM: "Cập nhật phiên thi thành công",
      EC: "0",
      DT: updatedSession,
    };
  } catch (error) {
    logError("updateExamSession", error, { session_id, user_id });
    return {
      EM: "Có lỗi xảy ra khi cập nhật phiên thi",
      EC: "-3",
      DT: null,
    };
  }
};
