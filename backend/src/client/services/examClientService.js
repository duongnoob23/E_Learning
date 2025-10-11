const { Test, Part, Passages, Questions, Results, UserAnswers, ResultPart  } = require("../../models");
const { Op } = require("sequelize");

// Lấy danh sách bài thi
exports.getExams = async () => {
    try {
        const tests = await Test.findForAll();
        if(!tests){
            return {
                EM: "Không tìm thấy bài thi",
                EC: "2",
                DT: null,
            };
        }
        return {
            EM: "Lấy danh sách bài thi thành công",
            EC: "0",
            DT: tests,
        };
    } catch (error) {
        console.error("Error in getExams service:", error);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy danh sách bài thi",
            EC: "-2",
            DT: null,
        };
    }
}

// Lấy chi tiết bài thi
exports.getTestDetail = async (testId) => {
    try {
        console.log("Getting test detail for testId:", testId);

        // Thử method đơn giản trước
        const test = await Test.findById(testId);
        console.log("Test found:", test);

        if(!test){
            return {
                EM: "Không tìm thấy bài thi",
                EC: "2",
                DT: null,
            };
        }
        return {
            EM: "Lấy chi tiết bài thi thành công",
            EC: "0",
            DT: test,
        };
    }
    catch (error) {
        console.error("Error in getTestDetail service:", error);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy chi tiết bài thi",
            EC: "-2",
            DT: null,
        };
    }
}

// Làm bài luyện tập
exports.getPracticeTests = async (testId, userId, parts) => {
    try {
        const parts = await Part.findAllAndPQ(testId, parts);
        if(!parts){
            return {
                EM: "Không tìm thấy bài thi",
                EC: "2",
                DT: null,
            };
        }
        return {
            EM: "Lấy bài luyện tập thành công",
            EC: "0",
            DT: parts,
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy bài luyện tập",
            EC: "-2",
            DT: null,
        };
    }
}

// Bắt đầu làm bài thi
exports.startTest = async (testId) => {
    try {
        const test = await Test.findwithAll(testId);
        if(!test){
            return {
                EM: "Không tìm thấy bài thi",
                EC: "2",
                DT: null,
            };
        }
        return {
            EM: "Bắt đầu làm bài thi thành công",
            EC: "0",
            DT: test,
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình bắt đầu làm bài thi",
            EC: "-2",
            DT: null,
        };
    }
}
// Nộp bài thi
exports.submitTest = async (testId, userId, answers) => {
  try {
    let correctAnswers = 0;
    const totalQuestions = answers.length;

    // Gom dữ liệu part
    const partStats = {}; // { part_id: { total: x, correct: y } }

    for (const ans of answers) {
      const question = await Questions.findByPk(ans.question_id);

      const isCorrect = question && question.correct_answer === ans.user_answer;
      if (isCorrect) correctAnswers++;

      //  Lưu UserAnswer
      await UserAnswers.create({
        user_id: userId,
        question_id: ans.question_id,
        user_answer: ans.user_answer,
        is_correct: isCorrect,
      });

      //  Gom nhóm theo Part
      if (question) {
        if (!partStats[question.part_id]) {
          partStats[question.part_id] = { total: 0, correct: 0 };
        }
        partStats[question.part_id].total += 1;
        if (isCorrect) partStats[question.part_id].correct += 1;
      }
    }

    // Tính điểm tổng
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    //  Lưu kết quả tổng
    const result = await Results.create({
      user_id: userId,
      test_id: testId,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score: score,
    });

    //Lưu kết quả từng part
    for (const [part_id, stats] of Object.entries(partStats)) {
      const partScore = Math.round((stats.correct / stats.total) * 100);

      await ResultPart.create({
        result_id: result.result_id,
        part_id: parseInt(part_id),
        total_questions: stats.total,
        correct_answers: stats.correct,
        score: partScore,
      });
    }

    return {
      EM: "Nộp bài thi thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("❌ submitTest error:", error);
    return {
      EM: "Có lỗi khi nộp bài thi",
      EC: "-2",
      DT: null,
    };
  }
};

// Nộp bài luyện tập
exports.submitPracticeTest = async (testId, userId, answers) => {
  try {
    let correctAnswers = 0;
    const totalQuestions = answers.length;
    const partStats = {};

    for (const ans of answers) {
      const question = await Questions.findByPk(ans.question_id);

      const isCorrect = question && question.correct_answer === ans.user_answer;
      if (isCorrect) correctAnswers++;

      //  lưu UserAnswers
      await UserAnswers.create({
        user_id: userId,
        question_id: ans.question_id,
        user_answer: ans.user_answer,
        is_correct: isCorrect,
      });

      //  thống kê theo Part
      if (question) {
        if (!partStats[question.part_id]) {
          partStats[question.part_id] = { total: 0, correct: 0 };
        }
        partStats[question.part_id].total += 1;
        if (isCorrect) partStats[question.part_id].correct += 1;
      }
    }

    // kết quả tổng nhưng chỉ trên số câu đã làm
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const result = await Results.create({
      user_id: userId,
      test_id: testId,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score: score,
    });
    // lưu từng part
    for (const [part_id, stats] of Object.entries(partStats)) {
      const partScore = Math.round((stats.correct / stats.total) * 100);
      await ResultPart.create({
        result_id: result.result_id,
        part_id: parseInt(part_id),
        total_questions: stats.total,
        correct_answers: stats.correct,
        score: partScore,
      });
    }

    return res.json({
      EM: "Nộp practice test thành công",
      EC: "0",
      DT: result,
    });
  } catch (error) {
    console.error("❌ submitPracticeTest error:", error);
    return res.status(500).json({
      EM: "Có lỗi khi nộp practice test",
      EC: "-2",
      DT: null,
    });
  }
};
