const { 
  Test, 
  TestSection, 
  UserTest, 
  Question, 
  QuestionAnswer, 
  QuestionChoice, 
  UserTestAnswer,
  WritingAttempt,
  SpeakingAttempt 
} = require('../../models');
const { Op } = require('sequelize');

// Bắt đầu luyện tập (chọn sections cụ thể)
exports.startPracticeSession = async (filters) => {
  try {
    const { testId, userId, sectionIds, timeLimit } = filters;

    if (!testId || !userId || !sectionIds || sectionIds.length === 0) {
      return {
        EM: "Thiếu thông tin bắt buộc",
        EC: "1",
        DT: null
      };
    }

    // Kiểm tra test tồn tại
    const test = await Test.findByPk(testId);
    if (!test) {
      return {
        EM: "Bài kiểm tra không tồn tại",
        EC: "2",
        DT: null
      };
    }

    // Kiểm tra sections có thuộc test này không
    const sections = await TestSection.findAll({
      where: {
        section_id: sectionIds,
        test_id: testId
      },
      attributes: ['section_id', 'test_id', 'section_name', 'section_order', 'duration']
    });

    if (sections.length !== sectionIds.length) {
      return {
        EM: "Một số phần thi không hợp lệ",
        EC: "3",
        DT: null
      };
    }

    // Tạo user test session
    const userTest = await UserTest.createUserTest({
      user_id: userId,
      test_id: testId,
      status: 'in_progress',
      started_at: new Date(),
      remaining_time: timeLimit ? parseInt(timeLimit) * 60 : null, // Convert minutes to seconds
      is_submitted: false,
      last_saved_at: new Date()
    });

    return {
      EM: "Bắt đầu luyện tập thành công",
      EC: "0",
      DT: {
        user_test_id: userTest.user_test_id,
        test_id: testId,
        section_ids: sectionIds,
        time_limit: timeLimit,
        started_at: userTest.started_at
      }
    };
  } catch (error) {
    console.error("Error in startPracticeSession service:", error);
    return {
      EM: "Có lỗi xảy ra khi bắt đầu luyện tập",
      EC: "-1",
      DT: null
    };
  }
};

// Bắt đầu làm full test
exports.startFullTestSession = async (filters) => {
  try {
    const { testId, userId } = filters;

    if (!testId || !userId) {
      return {
        EM: "Thiếu thông tin bắt buộc",
        EC: "1",
        DT: null
      };
    }

    // Kiểm tra test tồn tại
    const test = await Test.findByPk(testId);
    if (!test) {
      return {
        EM: "Bài kiểm tra không tồn tại",
        EC: "2",
        DT: null
      };
    }

    // Lấy tất cả sections của test
    const sections = await TestSection.findAll({
      where: { test_id: testId },
      order: [['section_order', 'ASC']],
      attributes: ['section_id', 'test_id', 'section_name', 'section_order', 'duration']
    });

    if (sections.length === 0) {
      return {
        EM: "Bài kiểm tra chưa có phần thi nào",
        EC: "3",
        DT: null
      };
    }

    // Tạo user test session
    const userTest = await UserTest.createUserTest({
      user_id: userId,
      test_id: testId,
      status: 'in_progress',
      started_at: new Date(),
      remaining_time: test.duration * 60, // Convert minutes to seconds
      is_submitted: false,
      last_saved_at: new Date()
    });

    return {
      EM: "Bắt đầu làm full test thành công",
      EC: "0",
      DT: {
        user_test_id: userTest.user_test_id,
        test_id: testId,
        section_ids: sections.map(s => s.section_id),
        time_limit: test.duration,
        started_at: userTest.started_at
      }
    };
  } catch (error) {
    console.error("Error in startFullTestSession service:", error);
    return {
      EM: "Có lỗi xảy ra khi bắt đầu làm full test",
      EC: "-1",
      DT: null
    };
  }
};

// Lấy câu hỏi cho session
exports.getSessionQuestions = async (filters) => {
  try {
    const { userTestId, userId, sectionIds } = filters;

    if (!userTestId || !userId) {
      return {
        EM: "Thiếu thông tin bắt buộc",
        EC: "1",
        DT: null
      };
    }

    // Kiểm tra user test thuộc về user
    const userTest = await UserTest.findOne({
      where: {
        user_test_id: userTestId,
        user_id: userId,
        status: 'in_progress'
      }
    });

    if (!userTest) {
      return {
        EM: "Session không tồn tại hoặc đã kết thúc",
        EC: "2",
        DT: null
      };
    }

    // Lấy câu hỏi theo sections
    const whereCondition = sectionIds && sectionIds.length > 0 
      ? { section_id: sectionIds }
      : { section_id: { [Op.in]: await TestSection.findAll({ 
          where: { test_id: userTest.test_id }, 
          attributes: ['section_id'] 
        }).then(sections => sections.map(s => s.section_id)) } };

    const questions = await Question.findAll({
      where: whereCondition,
      include: [
        {
          model: QuestionAnswer,
          as: 'answer',
          attributes: ['correct_answer', 'explanation']
        },
        {
          model: QuestionChoice,
          as: 'choices',
          attributes: ['choice_id', 'choice_text', 'is_correct']
        }
      ],
      order: [['section_id', 'ASC'], ['order_in_section', 'ASC']]
    });

    // Lấy câu trả lời đã có của user
    const userAnswers = await UserTestAnswer.findAll({
      where: {
        user_test_id: userTestId,
        question_id: questions.map(q => q.question_id)
      }
    });

    // Format questions với user answers
    const formattedQuestions = questions.map(question => {
      const userAnswer = userAnswers.find(ua => ua.question_id === question.question_id);
      
      return {
        question_id: question.question_id,
        section_id: question.section_id,
        question_text: question.question_text,
        question_type: question.question_type,
        order_in_section: question.order_in_section,
        media_url: question.media_url,
        choices: question.choices || [],
        correct_answer: question.answer?.correct_answer,
        explanation: question.answer?.explanation,
        user_answer: userAnswer ? {
          answer_id: userAnswer.answer_id,
          answer_text: userAnswer.answer_text,
          choice_id: userAnswer.choice_id,
          is_draft: userAnswer.is_draft,
          answered_at: userAnswer.answered_at
        } : null
      };
    });

    return {
      EM: "Lấy câu hỏi thành công",
      EC: "0",
      DT: {
        user_test_id: userTestId,
        test_id: userTest.test_id,
        questions: formattedQuestions,
        total_questions: formattedQuestions.length,
        remaining_time: userTest.remaining_time
      }
    };
  } catch (error) {
    console.error("Error in getSessionQuestions service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy câu hỏi",
      EC: "-1",
      DT: null
    };
  }
};

// Lưu câu trả lời
exports.saveAnswer = async (filters) => {
  try {
    const { userTestId, userId, questionId, answerData } = filters;

    if (!userTestId || !userId || !questionId) {
      return {
        EM: "Thiếu thông tin bắt buộc",
        EC: "1",
        DT: null
      };
    }

    // Kiểm tra user test thuộc về user
    const userTest = await UserTest.findOne({
      where: {
        user_test_id: userTestId,
        user_id: userId,
        status: 'in_progress'
      }
    });

    if (!userTest) {
      return {
        EM: "Session không tồn tại hoặc đã kết thúc",
        EC: "2",
        DT: null
      };
    }

    // Kiểm tra question có tồn tại không
    const question = await Question.findByPk(questionId);
    if (!question) {
      return {
        EM: "Câu hỏi không tồn tại",
        EC: "3",
        DT: null
      };
    }

    // Tìm hoặc tạo user answer
    let userAnswer = await UserTestAnswer.findByUserTestAndQuestion(userTestId, questionId);
    
    const answerDataToSave = {
      user_test_id: userTestId,
      question_id: questionId,
      answer_text: answerData.answer_text || null,
      choice_id: answerData.choice_id || null,
      is_draft: answerData.is_draft !== false, // Default to true
      answered_at: new Date()
    };

    if (userAnswer) {
      // Update existing answer
      await UserTestAnswer.updateAnswer(userAnswer.answer_id, answerDataToSave);
    } else {
      // Create new answer
      userAnswer = await UserTestAnswer.createAnswer(answerDataToSave);
    }

    // Cập nhật last_saved_at cho user test
    await UserTest.updateUserTest(userTestId, {
      last_saved_at: new Date()
    });

    return {
      EM: "Lưu câu trả lời thành công",
      EC: "0",
      DT: {
        answer_id: userAnswer.answer_id,
        question_id: questionId,
        is_draft: answerDataToSave.is_draft
      }
    };
  } catch (error) {
    console.error("Error in saveAnswer service:", error);
    return {
      EM: "Có lỗi xảy ra khi lưu câu trả lời",
      EC: "-1",
      DT: null
    };
  }
};

// Submit bài thi
exports.submitSession = async (filters) => {
  try {
    const { userTestId, userId } = filters;

    if (!userTestId || !userId) {
      return {
        EM: "Thiếu thông tin bắt buộc",
        EC: "1",
        DT: null
      };
    }

    // Kiểm tra user test thuộc về user
    const userTest = await UserTest.findOne({
      where: {
        user_test_id: userTestId,
        user_id: userId,
        status: 'in_progress'
      }
    });

    if (!userTest) {
      return {
        EM: "Session không tồn tại hoặc đã kết thúc",
        EC: "2",
        DT: null
      };
    }

    // Lấy tất cả câu trả lời của user
    const userAnswers = await UserTestAnswer.findFinalAnswersByUserTest(userTestId);
    
    // Mark all answers as final
    await UserTestAnswer.markAllAsFinal(userTestId);

    // Tính điểm
    let totalScore = 0;
    let correctAnswers = 0;
    let totalQuestions = userAnswers.length;

    for (const answer of userAnswers) {
      const question = await Question.findByPk(answer.question_id, {
        include: [
          { model: QuestionAnswer, as: 'answer' },
          { model: QuestionChoice, as: 'choices' }
        ]
      });

      if (question) {
        let isCorrect = false;
        
        if (question.question_type === 'mcq' && answer.choice_id) {
          const selectedChoice = question.choices.find(c => c.choice_id === answer.choice_id);
          isCorrect = selectedChoice ? selectedChoice.is_correct : false;
        } else if (['fill_blank', 'short_answer'].includes(question.question_type) && answer.answer_text) {
          // Simple text comparison (có thể cải thiện sau)
          isCorrect = answer.answer_text.toLowerCase().trim() === question.answer?.correct_answer?.toLowerCase().trim();
        }

        // Update answer correctness
        await UserTestAnswer.updateAnswer(answer.answer_id, { is_correct: isCorrect });
        
        if (isCorrect) {
          correctAnswers++;
          totalScore += 1; // Mỗi câu đúng được 1 điểm
        }
      }
    }

    // Tính điểm phần trăm
    const percentageScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Cập nhật user test
    await UserTest.updateUserTest(userTestId, {
      status: 'completed',
      finished_at: new Date(),
      score: percentageScore,
      is_submitted: true,
      last_saved_at: new Date()
    });

    return {
      EM: "Nộp bài thành công",
      EC: "0",
      DT: {
        user_test_id: userTestId,
        score: percentageScore,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        finished_at: new Date()
      }
    };
  } catch (error) {
    console.error("Error in submitSession service:", error);
    return {
      EM: "Có lỗi xảy ra khi nộp bài",
      EC: "-1",
      DT: null
    };
  }
};

// Lấy kết quả bài thi
exports.getSessionResult = async (filters) => {
  try {
    const { userTestId, userId } = filters;

    if (!userTestId || !userId) {
      return {
        EM: "Thiếu thông tin bắt buộc",
        EC: "1",
        DT: null
      };
    }

    // Lấy thông tin user test
    const userTest = await UserTest.findOne({
      where: {
        user_test_id: userTestId,
        user_id: userId
      },
      include: [
        { model: Test, as: 'test' }
      ]
    });

    if (!userTest) {
      return {
        EM: "Session không tồn tại",
        EC: "2",
        DT: null
      };
    }

    // Lấy câu trả lời chi tiết
    const userAnswers = await UserTestAnswer.findAll({
      where: { user_test_id: userTestId },
      include: [
        { 
          model: Question, 
          as: 'question',
          include: [
            { model: QuestionAnswer, as: 'answer' },
            { model: QuestionChoice, as: 'choices' }
          ]
        }
      ],
      order: [['answered_at', 'ASC']]
    });

    // Format kết quả
    const result = {
      user_test_id: userTest.user_test_id,
      test_id: userTest.test_id,
      test_title: userTest.test?.title,
      score: userTest.score,
      status: userTest.status,
      started_at: userTest.started_at,
      finished_at: userTest.finished_at,
      total_questions: userAnswers.length,
      correct_answers: userAnswers.filter(a => a.is_correct).length,
      answers: userAnswers.map(answer => ({
        question_id: answer.question_id,
        question_text: answer.question?.question_text,
        question_type: answer.question?.question_type,
        user_answer: {
          answer_text: answer.answer_text,
          choice_id: answer.choice_id,
          is_correct: answer.is_correct
        },
        correct_answer: answer.question?.answer?.correct_answer,
        explanation: answer.question?.answer?.explanation
      }))
    };

    return {
      EM: "Lấy kết quả thành công",
      EC: "0",
      DT: result
    };
  } catch (error) {
    console.error("Error in getSessionResult service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy kết quả",
      EC: "-1",
      DT: null
    };
  }
};
