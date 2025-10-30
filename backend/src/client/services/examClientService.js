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
} = require("../../models");
const { Op } = require("sequelize");
const { transcribeAudio } = require("./whisperService");
const llmService = require("./llmService");
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
    console.error("Error in getTests service:", error);
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
    console.error("Error in getTestDetail service:", error);
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
    console.error("Error in getTestParts service:", error);
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
    console.error("Error in getPracticeTestResult service:", error);
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
    console.error("Error in getPartQuestions service:", error);
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
    console.error("Error in startExamSession service:", error);
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

      let isCorrect = -1; // -1 = skipped / not answered
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
        isCorrect = -1;
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
          stats.correct
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
    console.error("Error in submitExamSession service:", error);
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
    console.error("Error in getExamResult service:", error);
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
    console.error("Error in reviewExamSession service:", error);
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
    console.error("Error in retryWrongAnswers service:", error);
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
    console.error("Error in getUserStatistics service:", error);
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
    console.error("Error in getTestDiscussions service:", error);
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
    console.error("Error in createDiscussion service:", error);
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
    console.error("Error in addComment service:", error);
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
    console.error("Error updating user statistics:", error);
  }
};


// --------- Speaking and Writing Routes --------- //

// POST /api/speaking/upload - Tải lên tệp âm thanh speaking
exports.uploadSpeakingAudio = async (audioData) => {
    try {
        const { user_id, session_id, question_id, audio_file_path, language } = audioData;

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
        if (!speakingQuestion || speakingQuestion.question_type !== 'SPEAKING') {
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
            console.error("Transcription error:", transcribeError.message);
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
            processing_status: 'COMPLETED'
        });

        return {
            EM: "Tải lên tệp âm thanh thành công",
            EC: "0",
            DT: speakingResponse,
        };
    } catch (error) {
        console.error("Error in uploadSpeakingAudio service:", error);
        return {
            EM: `Có lỗi xảy ra: ${error.message}`,
            EC: "-2",
            DT: null,
        };
    }
}

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
            order: [['created_at', 'DESC']]
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
                    items_per_page: parseInt(limit)
                }

                
            },
        };
    } catch (error) {
        console.error("Error in getSessionSpeakingResponses service:", error);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy danh sách phản hồi speaking",
            EC: "-2",
            DT: null,
        };
    }
}


// Chấm điểm speaking response
exports.gradeSpeaking = async ({response_id, user_id, text, language }) => {
     try {
        const result = await llmService.gradeByLLM({
            text,
            type: "SPEAKING",
            language
        });

        // Cập nhật điểm và feedback cho response
        await SpeakingResponse.update({
            score: result.score,
            feedback: result.feedback
        }, {
            where: { response_id, user_id }
        });
        return {
            EM: "Chấm bài Speaking thành công",
            EC: "0",
            DT: result
        };
    } catch (error) {
        console.error("Error in gradeSpeaking:", error);
        return {
            EM: "Có lỗi xảy ra khi chấm Speaking",
            EC: "-2",
            DT: null
        };
    }
}

// Chấm điểm writing response
exports.gradeWriting = async ({ user_id, text, language }) => {
    try {
        const result = await llmService.gradeByLLM({
            text,
            type: "WRITING",
            language
        });
        // Cập nhật điểm và feedback cho response
        await WritingResponse.update({
            score: result.score,
            feedback: result.feedback
        }, {
            where: { response_id }
        });
        return {
            EM: "Chấm bài Writing thành công",
            EC: "0",
            DT: result
        };
    }
    catch (error) {
        console.error("Error in gradeWriting:", error);
        return {
            EM: "Có lỗi xảy ra khi chấm Writing",
            EC: "-2",
            DT: null
        };
    }
}