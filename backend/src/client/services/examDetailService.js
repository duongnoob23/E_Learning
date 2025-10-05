const { Test, TestSection, UserTest, User, Tag } = require('../../models');
const { Op } = require('sequelize');

// Lấy thông tin chi tiết exam với sections và user test status
exports.getExamDetail = async (filters) => {
  try {
    const { testId, userId } = filters;

    if (!testId) {
      return {
        EM: "Test ID là bắt buộc",
        EC: "2",
        DT: null
      };
    }

    // Lấy thông tin test
    const test = await Test.findByPk(testId);

    if (!test) {
      return {
        EM: "Test không tồn tại",
        EC: "3",
        DT: null
      };
    }

    // Lấy sections của test
    const sections = await TestSection.findAll({
      where: { test_id: testId },
      order: [['section_order', 'ASC']],
      attributes: ['section_id', 'test_id', 'section_name', 'section_order', 'duration']
    });
    
    // Lấy user test status nếu có userId
    let userTestStatus = null;
    if (userId) {
      userTestStatus = await UserTest.findOne({
        where: {
          user_id: userId,
          test_id: testId,
          status: { [Op.in]: ['in_progress', 'abandoned'] }
        },
        order: [['last_saved_at', 'DESC']]
      });
    }

    // Format sections
    const formattedSections = sections.map(section => ({
      section_id: section.section_id,
      section_name: section.section_name,
      section_order: section.section_order,
      duration: section.duration,
      created_at: section.created_at
    }));

    // Format test data
    const formattedTest = {
      test_id: test.test_id,
      title: test.title,
      test_type: test.test_type,
      duration: test.duration,
      // description: test.description, // Không có cột description trong database
      // image_url: test.image_url, // Không có cột image_url trong database
      // difficulty: test.difficulty, // Không có cột difficulty trong database
      // questions_count: test.questions_count, // Không có cột questions_count trong database
      // is_active: test.is_active, // Không có cột is_active trong database
      created_at: test.created_at,
      // updated_at: test.updated_at, // Không có cột updated_at trong database
      tags: test.tags ? test.tags.map(tag => ({
        tag_id: tag.tag_id,
        tag_name: tag.tag_name
      })) : [],
      sections: formattedSections,
      total_duration: formattedSections.reduce((total, section) => total + section.duration, 0)
    };

    // Format user test status
    if (userTestStatus) {
      formattedTest.user_test_status = {
        user_test_id: userTestStatus.user_test_id,
        status: userTestStatus.status,
        started_at: userTestStatus.started_at,
        finished_at: userTestStatus.finished_at,
        score: userTestStatus.score,
        remaining_time: userTestStatus.remaining_time,
        is_submitted: userTestStatus.is_submitted,
        last_saved_at: userTestStatus.last_saved_at
      };
    }

    return {
      EM: "Lấy thông tin chi tiết exam thành công",
      EC: "0",
      DT: formattedTest
    };
  } catch (error) {
    console.error("Error in getExamDetail service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy thông tin chi tiết exam",
      EC: "-2",
      DT: null
    };
  }
};

// Bắt đầu làm bài
exports.startExam = async (filters) => {
  try {
    const { testId, userId, sessionId } = filters;

    if (!testId || !userId) {
      return {
        EM: "Test ID và User ID là bắt buộc",
        EC: "2",
        DT: null
      };
    }

    // Kiểm tra test có tồn tại không
    const test = await Test.findByPk(testId);
    if (!test) {
      return {
        EM: "Test không tồn tại",
        EC: "3",
        DT: null
      };
    }

    // Kiểm tra user có đang làm bài này chưa
    const existingUserTest = await UserTest.findByUserAndTest(userId, testId);
    if (existingUserTest && existingUserTest.status === 'in_progress') {
      return {
        EM: "Bạn đang làm bài này rồi",
        EC: "4",
        DT: {
          user_test_id: existingUserTest.user_test_id,
          status: existingUserTest.status,
          remaining_time: existingUserTest.remaining_time,
          started_at: existingUserTest.started_at
        }
      };
    }

    // Lấy sections để tính tổng thời gian
    const sections = await TestSection.getSectionsByTest(testId);
    const totalDuration = sections.reduce((total, section) => total + section.duration, 0);

    // Tạo hoặc cập nhật user test
    let userTest;
    if (existingUserTest) {
      // Cập nhật lại để bắt đầu làm bài
      await UserTest.updateUserTest(existingUserTest.user_test_id, {
        session_id: sessionId || existingUserTest.session_id,
        started_at: new Date(),
        status: 'in_progress',
        remaining_time: totalDuration * 60, // Convert minutes to seconds
        is_submitted: false,
        last_saved_at: new Date(),
        updated_at: new Date()
      });
      userTest = await UserTest.findById(existingUserTest.user_test_id);
    } else {
      // Tạo mới
      userTest = await UserTest.createUserTest({
        user_id: userId,
        test_id: testId,
        session_id: sessionId,
        started_at: new Date(),
        status: 'in_progress',
        remaining_time: totalDuration * 60, // Convert minutes to seconds
        is_submitted: false,
        last_saved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return {
      EM: "Bắt đầu làm bài thành công",
      EC: "0",
      DT: {
        user_test_id: userTest.user_test_id,
        test_id: userTest.test_id,
        session_id: userTest.session_id,
        started_at: userTest.started_at,
        status: userTest.status,
        remaining_time: userTest.remaining_time,
        test_duration: totalDuration
      }
    };
  } catch (error) {
    console.error("Error in startExam service:", error);
    return {
      EM: "Có lỗi xảy ra khi bắt đầu làm bài",
      EC: "-2",
      DT: null
    };
  }
};

// Lưu tiến độ làm bài
exports.saveExamProgress = async (filters) => {
  try {
    const { userTestId, remainingTime, currentSection, answers } = filters;

    if (!userTestId) {
      return {
        EM: "User Test ID là bắt buộc",
        EC: "2",
        DT: null
      };
    }

    const userTest = await UserTest.findById(userTestId);
    if (!userTest) {
      return {
        EM: "User test không tồn tại",
        EC: "1",
        DT: null
      };
    }

    if (userTest.status !== 'in_progress') {
      return {
        EM: "Chỉ có thể lưu tiến độ khi đang làm bài",
        EC: "5",
        DT: null
      };
    }

    const updateData = {
      last_saved_at: new Date(),
      updated_at: new Date()
    };

    if (remainingTime !== undefined) {
      updateData.remaining_time = remainingTime;
    }

    await UserTest.updateUserTest(userTestId, updateData);

    return {
      EM: "Lưu tiến độ thành công",
      EC: "0",
      DT: {
        user_test_id: userTestId,
        remaining_time: remainingTime || userTest.remaining_time,
        last_saved_at: new Date()
      }
    };
  } catch (error) {
    console.error("Error in saveExamProgress service:", error);
    return {
      EM: "Có lỗi xảy ra khi lưu tiến độ",
      EC: "-2",
      DT: null
    };
  }
};

// Nộp bài
exports.submitExam = async (filters) => {
  try {
    const { userTestId, score, answers } = filters;

    if (!userTestId) {
      return {
        EM: "User Test ID là bắt buộc",
        EC: "2",
        DT: null
      };
    }

    const userTest = await UserTest.findById(userTestId);
    if (!userTest) {
      return {
        EM: "User test không tồn tại",
        EC: "1",
        DT: null
      };
    }

    if (userTest.status !== 'in_progress') {
      return {
        EM: "Chỉ có thể nộp bài khi đang làm bài",
        EC: "5",
        DT: null
      };
    }

    if (userTest.is_submitted) {
      return {
        EM: "Bài đã được nộp rồi",
        EC: "6",
        DT: null
      };
    }

    const finishedAt = new Date();
    const updateData = {
      finished_at: finishedAt,
      score: score || 0,
      status: 'completed',
      is_submitted: true,
      last_saved_at: finishedAt,
      updated_at: finishedAt
    };

    await UserTest.updateUserTest(userTestId, updateData);

    return {
      EM: "Nộp bài thành công",
      EC: "0",
      DT: {
        user_test_id: userTestId,
        score: score || 0,
        finished_at: finishedAt,
        status: 'completed',
        is_submitted: true
      }
    };
  } catch (error) {
    console.error("Error in submitExam service:", error);
    return {
      EM: "Có lỗi xảy ra khi nộp bài",
      EC: "-2",
      DT: null
    };
  }
};

// Bỏ dở bài thi
exports.abandonExam = async (filters) => {
  try {
    const { userTestId } = filters;

    if (!userTestId) {
      return {
        EM: "User Test ID là bắt buộc",
        EC: "2",
        DT: null
      };
    }

    const userTest = await UserTest.findById(userTestId);
    if (!userTest) {
      return {
        EM: "User test không tồn tại",
        EC: "1",
        DT: null
      };
    }

    if (userTest.status !== 'in_progress') {
      return {
        EM: "Chỉ có thể bỏ dở khi đang làm bài",
        EC: "5",
        DT: null
      };
    }

    await UserTest.updateUserTest(userTestId, {
      status: 'abandoned',
      finished_at: new Date(),
      last_saved_at: new Date(),
      updated_at: new Date()
    });

    return {
      EM: "Bỏ dở bài thi thành công",
      EC: "0",
      DT: {
        user_test_id: userTestId,
        status: 'abandoned',
        finished_at: new Date()
      }
    };
  } catch (error) {
    console.error("Error in abandonExam service:", error);
    return {
      EM: "Có lỗi xảy ra khi bỏ dở bài thi",
      EC: "-2",
      DT: null
    };
  }
};

// Lấy lịch sử làm bài của user
exports.getUserExamHistory = async (filters) => {
  try {
    const { userId, page = 1, limit = 10, status, test_type } = filters;

    if (!userId) {
      return {
        EM: "User ID là bắt buộc",
        EC: "2",
        DT: null
      };
    }

    const whereConditions = { user_id: userId };
    if (status) whereConditions.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await UserTest.findAndCountAll({
      where: whereConditions,
      include: [{
        model: Test,
        as: 'test',
        attributes: ['test_id', 'title', 'test_type', 'duration', 'description'],
        where: test_type ? { test_type } : undefined,
        required: true
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });

    const formattedUserTests = rows.map(userTest => ({
      user_test_id: userTest.user_test_id,
      user_id: userTest.user_id,
      test_id: userTest.test_id,
      session_id: userTest.session_id,
      started_at: userTest.started_at,
      finished_at: userTest.finished_at,
      score: userTest.score,
      status: userTest.status,
      remaining_time: userTest.remaining_time,
      is_submitted: userTest.is_submitted,
      last_saved_at: userTest.last_saved_at,
      created_at: userTest.created_at,
      updated_at: userTest.updated_at,
      test: userTest.test ? {
        test_id: userTest.test.test_id,
        title: userTest.test.title,
        test_type: userTest.test.test_type,
        duration: userTest.test.duration,
        // description: userTest.test.description // Không có cột description trong database
      } : null
    }));

    return {
      EM: "Lấy lịch sử làm bài thành công",
      EC: "0",
      DT: {
        user_tests: formattedUserTests,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / parseInt(limit)),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    };
  } catch (error) {
    console.error("Error in getUserExamHistory service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy lịch sử làm bài",
      EC: "-2",
      DT: null
    };
  }
};
