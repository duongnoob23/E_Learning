const {
  Test,
  TestCategoryRelation,
  ExamSession,
  UserAnswer,
  Question,
  Choice,
  Part,
} = require("../../models");

/**
 * Lấy danh sách tất cả bài thi
 */
exports.getTest = async () => {
  try {
    const tests = await Test.findAll();
    return {
      EM: "Lấy danh sách đề thi thành công",
      EC: "0",
      DT: tests,
    };
  } catch (error) {
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách đề thi",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Lấy chi tiết bài thi
 */
exports.getTestDetail = async (test_id) => {
  try {
    const test = await Test.findWithAll(test_id);
    return {
      EM: "Lấy chi tiết đề thi thành công",
      EC: "0",
      DT: test,
    };
  } catch (error) {
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy chi tiết đề thi",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Tạo bài thi mới (chỉ thông tin cơ bản)
 */
exports.createTest = async ({
  title,
  duration,
  description,
  total_questions,
  total_parts,
  difficulty_level,
  exam_type,
  category_ids,
  created_by,
}) => {
  try {
    const test = await Test.createTest({
      title,
      total_duration: duration,
      description,
      total_questions: total_questions || 0,
      total_parts: total_parts || 0,
      difficulty_level,
      exam_type: exam_type || "TOEIC",
      created_by,
    });

    return {
      EM: "Tạo đề thi thành công",
      EC: "0",
      DT: test,
    };
  } catch (error) {
    console.error("Error in createTest:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình tạo đề thi",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Tạo toàn bộ bài thi (Test + Parts + Questions + Choices)
 * Đây là API chính để tạo bài thi hoàn chỉnh từ frontend
 */
exports.createFullExam = async ({
  testInfo,
  parts,
  created_by,
}) => {
  try {
    // 1. Tạo Test
    const test = await Test.createTest({
      title: testInfo.title,
      description: testInfo.description,
      exam_type: testInfo.exam_type || "TOEIC",
      total_duration: testInfo.total_duration || 120,
      difficulty_level: testInfo.difficulty_level || "MEDIUM",
      total_questions: 0, // Sẽ cập nhật sau
      total_parts: parts.length,
      created_by,
    });

    let totalQuestions = 0;

    // 2. Tạo Parts và Questions
    for (const partData of parts) {
      // Tạo Part
      const part = await Part.createPart({
        test_id: test.test_id,
        part_number: partData.part_number,
        part_name: partData.part_name,
        part_type: partData.part_type,
        duration_minutes: partData.duration_minutes || 0,
        description: partData.description || null,
        display_template: partData.display_template || null,
        question_count: 0, // Sẽ cập nhật sau
      });

      // Tạo Questions cho Part
      if (partData.questions && partData.questions.length > 0) {
        for (const questionData of partData.questions) {
          // Tạo Question
          const question = await Question.createQuestion({
            part_id: part.part_id,
            question_number: questionData.question_number,
            question_text: questionData.question_text || null,
            question_type: questionData.question_type || "MULTIPLE_CHOICE",
            audio_file: questionData.audio_file || null,
            image_file: questionData.image_file || null,
            transcript: questionData.transcript || null,
            explanation: questionData.explanation || null,
            grammar_notes: questionData.grammar_notes || null,
          });

          totalQuestions++;

          // Tạo Choices (chỉ cho Listening & Reading)
          if (
            (partData.part_type === "LISTENING" ||
              partData.part_type === "READING") &&
            questionData.choices &&
            questionData.choices.length > 0
          ) {
            const choiceData = questionData.choices.map((c) => ({
              question_id: question.question_id,
              choice_letter: c.choice_letter,
              choice_text: c.choice_text,
              choice_translation: c.choice_translation || null,
              choice_explanation: c.choice_explanation || null,
              is_correct: c.is_correct || false,
            }));

            await Choice.createChoices(question.question_id, choiceData);
          }
        }

        // Cập nhật question_count cho Part
        await Part.updatePart(part.part_id, {
          question_count: partData.questions.length,
        });
      }
    }

    // 3. Cập nhật total_questions cho Test
    await Test.updateTest(test.test_id, {
      total_questions: totalQuestions,
    });

    // 4. Lấy lại Test với đầy đủ thông tin
    const fullTest = await Test.findWithAll(test.test_id);

    return {
      EM: "Tạo bài thi hoàn chỉnh thành công",
      EC: "0",
      DT: fullTest,
    };
  } catch (error) {
    console.error("Error in createFullExam:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình tạo bài thi: " + error.message,
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Thêm nhiều câu hỏi vào Part
 */
exports.addMultipleQuestionsToPart = async (part_id, questions) => {
  try {
    const createdQuestions = [];

    for (const q of questions) {
      const {
        question_text,
        question_type,
        question_number,
        audio_file,
        image_file,
        transcript,
        explanation,
        grammar_notes,
        choices,
      } = q;

      const question = await Question.createQuestion({
        part_id,
        question_text,
        question_type,
        question_number,
        audio_file,
        image_file,
        transcript,
        explanation,
        grammar_notes,
      });

      if (choices && choices.length > 0) {
        const choiceData = choices.map((c) => ({
          ...c,
          question_id: question.question_id,
        }));
        await Choice.createChoices(question.question_id, choiceData);
      }

      createdQuestions.push(question);
    }

    // Cập nhật question_count cho Part
    const part = await Part.findById(part_id);
    if (part) {
      await Part.updatePart(part_id, {
        question_count: part.question_count + questions.length,
      });
    }

    return {
      EM: "Thêm nhiều câu hỏi thành công",
      EC: "0",
      DT: createdQuestions,
    };
  } catch (error) {
    console.error("Error in addMultipleQuestionsToPart:", error);
    return {
      EM: "Có lỗi xảy ra khi thêm nhiều câu hỏi",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Thêm Part vào Test
 */
exports.addPartToTest = async (test_id, partData) => {
  try {
    const part = await Part.createPart({
      test_id,
      part_number: partData.part_number,
      part_name: partData.part_name,
      part_type: partData.part_type,
      duration_minutes: partData.duration_minutes || 0,
      description: partData.description || null,
      display_template: partData.display_template || null,
      question_count: 0,
    });

    // Cập nhật total_parts cho Test
    const test = await Test.findById(test_id);
    if (test) {
      await Test.updateTest(test_id, {
        total_parts: test.total_parts + 1,
      });
    }

    return {
      EM: "Thêm Part thành công",
      EC: "0",
      DT: part,
    };
  } catch (error) {
    console.error("Error in addPartToTest:", error);
    return {
      EM: "Có lỗi xảy ra khi thêm Part",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Cập nhật Test
 */
exports.updateTest = async (test_id, updateData) => {
  try {
    await Test.updateTest(test_id, updateData);
    const updatedTest = await Test.findById(test_id);

    return {
      EM: "Cập nhật đề thi thành công",
      EC: "0",
      DT: updatedTest,
    };
  } catch (error) {
    console.error("Error in updateTest:", error);
    return {
      EM: "Có lỗi xảy ra khi cập nhật đề thi",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Xóa Test
 */
exports.deleteTest = async (test_id) => {
  try {
    // Xóa tất cả Parts (sẽ tự động xóa Questions và Choices do foreign key)
    await Part.deletePartByTestId(test_id);
    
    // Xóa Test
    await Test.deleteTest(test_id);

    return {
      EM: "Xóa đề thi thành công",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Error in deleteTest:", error);
    return {
      EM: "Có lỗi xảy ra khi xóa đề thi",
      EC: "-2",
      DT: null,
    };
  }
};

// Các hàm khác giữ nguyên...
// (getTestSessions, getExamSessionDetail, getTestStatistics, etc.)
