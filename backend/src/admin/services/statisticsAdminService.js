const { Op, fn, col, literal } = require("sequelize");
const {
  User,
  Course,
  CourseEnrollment,
  Order,
  Payment,
  Test,
  ExamSession,
  Topic,
  Word,
  UserWord,
  Lesson,
  Module,
  sequelize,
} = require("../../models");

/**
 * Thống kê tổng quan cho dashboard admin
 */
exports.getOverviewStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // User statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: "active" } });
    const newUsersToday = await User.count({
      where: { created_at: { [Op.gte]: today } }
    });
    const newUsersThisMonth = await User.count({
      where: { created_at: { [Op.gte]: thisMonthStart } }
    });

    // Course statistics
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: "published" } });
    const totalEnrollments = await CourseEnrollment.count();
    const newEnrollmentsThisMonth = await CourseEnrollment.count({
      where: { enrolled_at: { [Op.gte]: thisMonthStart } }
    });

    // Exam statistics
    const totalExams = await Test.count();
    const totalExamSessions = await ExamSession.count();
    const examSessionsThisMonth = await ExamSession.count({
      where: { start_time: { [Op.gte]: thisMonthStart } }
    });

    // Revenue statistics
    const totalRevenue = await Payment.sum("amount", {
      where: { payment_status: "completed" }
    }) || 0;
    
    const revenueThisMonth = await Payment.sum("amount", {
      where: {
        payment_status: "completed",
        created_at: { [Op.gte]: thisMonthStart }
      }
    }) || 0;

    const revenueLastMonth = await Payment.sum("amount", {
      where: {
        payment_status: "completed",
        created_at: { [Op.gte]: lastMonthStart, [Op.lte]: lastMonthEnd }
      }
    }) || 0;

    // Vocabulary statistics
    const totalTopics = await Topic.count();
    const totalWords = await Word.count();
    const totalUserWords = await UserWord.count();

    return {
      EM: "Lấy thống kê tổng quan thành công",
      EC: "0",
      DT: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newToday: newUsersToday,
          newThisMonth: newUsersThisMonth,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          totalEnrollments: totalEnrollments,
          newEnrollmentsThisMonth: newEnrollmentsThisMonth,
        },
        exams: {
          total: totalExams,
          totalSessions: totalExamSessions,
          sessionsThisMonth: examSessionsThisMonth,
        },
        revenue: {
          total: parseFloat(totalRevenue),
          thisMonth: parseFloat(revenueThisMonth),
          lastMonth: parseFloat(revenueLastMonth),
          growth: revenueLastMonth > 0 
            ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(2)
            : 0,
        },
        vocabulary: {
          totalTopics: totalTopics,
          totalWords: totalWords,
          totalUserWords: totalUserWords,
        },
      },
    };
  } catch (error) {
    console.error("Error in getOverviewStats:", error);
    return {
      EM: "Lỗi khi lấy thống kê tổng quan",
      EC: "-1",
      DT: null,
    };
  }
};

/**
 * Thống kê người dùng theo thời gian
 */
exports.getUserStats = async (period = "month", year = new Date().getFullYear()) => {
  try {
    let groupBy, dateFormat;
    
    if (period === "day") {
      groupBy = "DATE(created_at)";
      dateFormat = "%Y-%m-%d";
    } else if (period === "week") {
      groupBy = "YEARWEEK(created_at)";
      dateFormat = "%Y-W%u";
    } else {
      groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
      dateFormat = "%Y-%m";
    }

    const usersByPeriod = await User.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("created_at"), dateFormat), "period"],
        [fn("COUNT", col("user_id")), "count"],
      ],
      where: {
        created_at: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`),
        },
      },
      group: [literal(groupBy)],
      order: [[literal("period"), "ASC"]],
      raw: true,
    });

    // User by status
    const usersByStatus = await User.findAll({
      attributes: ["status", [fn("COUNT", col("user_id")), "count"]],
      group: ["status"],
      raw: true,
    });

    return {
      EM: "Lấy thống kê người dùng thành công",
      EC: "0",
      DT: {
        byPeriod: usersByPeriod,
        byStatus: usersByStatus,
      },
    };
  } catch (error) {
    console.error("Error in getUserStats:", error);
    return { EM: "Lỗi khi lấy thống kê người dùng", EC: "-1", DT: null };
  }
};

/**
 * Thống kê khóa học
 */
exports.getCourseStats = async () => {
  try {
    // Courses by status
    const coursesByStatus = await Course.findAll({
      attributes: ["status", [fn("COUNT", col("course_id")), "count"]],
      group: ["status"],
      raw: true,
    });

    // Top courses by enrollment
    const topCoursesByEnrollment = await CourseEnrollment.findAll({
      attributes: [
        "course_id",
        [fn("COUNT", col("enrollment_id")), "enrollmentCount"],
      ],
      include: [
        {
          model: require("../../models").Course,
          attributes: ["title", "image"],
        },
      ],
      group: ["course_id"],
      order: [[literal("enrollmentCount"), "DESC"]],
      limit: 10,
      raw: true,
      nest: true,
    });

    // Enrollments by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const enrollmentsByMonth = await CourseEnrollment.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("enrolled_at"), "%Y-%m"), "month"],
        [fn("COUNT", col("enrollment_id")), "count"],
      ],
      where: {
        enrolled_at: { [Op.gte]: twelveMonthsAgo },
      },
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    // Course completion rate
    const completedEnrollments = await CourseEnrollment.count({
      where: { status: "completed" },
    });
    const totalEnrollments = await CourseEnrollment.count();
    const completionRate = totalEnrollments > 0
      ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2)
      : 0;

    return {
      EM: "Lấy thống kê khóa học thành công",
      EC: "0",
      DT: {
        byStatus: coursesByStatus,
        topByEnrollment: topCoursesByEnrollment,
        enrollmentsByMonth: enrollmentsByMonth,
        completionRate: parseFloat(completionRate),
      },
    };
  } catch (error) {
    console.error("Error in getCourseStats:", error);
    return { EM: "Lỗi khi lấy thống kê khóa học", EC: "-1", DT: null };
  }
};

/**
 * Thống kê doanh thu
 */
exports.getRevenueStats = async (year = new Date().getFullYear()) => {
  try {
    // Revenue by month
    const revenueByMonth = await Payment.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"],
        [fn("SUM", col("amount")), "revenue"],
        [fn("COUNT", col("payment_id")), "transactions"],
      ],
      where: {
        payment_status: "completed",
        created_at: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lte]: new Date(`${year}-12-31`),
        },
      },
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    // Revenue by payment method
    const revenueByMethod = await Payment.findAll({
      attributes: [
        "payment_method",
        [fn("SUM", col("amount")), "revenue"],
        [fn("COUNT", col("payment_id")), "count"],
      ],
      where: { payment_status: "completed" },
      group: ["payment_method"],
      raw: true,
    });

    // Recent transactions
    const recentTransactions = await Payment.findAll({
      where: { payment_status: "completed" },
      include: [
        {
          model: require("../../models").User,
          as: "user",
          attributes: ["user_id", "username", "email", "full_name"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 10,
      raw: true,
      nest: true,
    });

    return {
      EM: "Lấy thống kê doanh thu thành công",
      EC: "0",
      DT: {
        byMonth: revenueByMonth,
        byMethod: revenueByMethod,
        recentTransactions: recentTransactions,
      },
    };
  } catch (error) {
    console.error("Error in getRevenueStats:", error);
    return { EM: "Lỗi khi lấy thống kê doanh thu", EC: "-1", DT: null };
  }
};

/**
 * Thống kê bài thi
 */
exports.getExamStats = async () => {
  try {
    // Exams by type (exam_type thay vì test_type)
    const examsByType = await Test.findAll({
      attributes: ["exam_type", [fn("COUNT", col("test_id")), "count"]],
      group: ["exam_type"],
      raw: true,
    });

    // Exam sessions by month
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sessionsByMonth = await ExamSession.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("start_time"), "%Y-%m"), "month"],
        [fn("COUNT", col("exam_session_id")), "count"],
      ],
      where: {
        start_time: { [Op.gte]: twelveMonthsAgo },
      },
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    // Average scores (total_score thay vì score)
    const avgScoreResult = await ExamSession.findAll({
      attributes: [[fn("AVG", col("total_score")), "avgScore"]],
      where: {
        status: "COMPLETED",
        total_score: { [Op.ne]: null },
      },
      raw: true,
    });
    const avgScore = avgScoreResult[0]?.avgScore || 0;

    // Completion rate
    const completedSessions = await ExamSession.count({
      where: { status: "COMPLETED" },
    });
    const totalSessions = await ExamSession.count();
    const completionRate = totalSessions > 0
      ? ((completedSessions / totalSessions) * 100).toFixed(2)
      : 0;

    // Top exams by attempts
    const topExams = await ExamSession.findAll({
      attributes: [
        "test_id",
        [fn("COUNT", col("exam_session_id")), "attempts"],
        [fn("AVG", col("total_score")), "avgScore"],
      ],
      include: [
        {
          model: require("../../models").Test,
          as: "test",
          attributes: ["title", "exam_type"],
        },
      ],
      group: ["test_id"],
      order: [[literal("attempts"), "DESC"]],
      limit: 10,
      raw: true,
      nest: true,
    });

    return {
      EM: "Lấy thống kê bài thi thành công",
      EC: "0",
      DT: {
        byType: examsByType.map(item => ({ type: item.exam_type, count: item.count })),
        sessionsByMonth: sessionsByMonth,
        avgScore: parseFloat(avgScore).toFixed(2),
        completionRate: parseFloat(completionRate),
        topExams: topExams,
      },
    };
  } catch (error) {
    console.error("Error in getExamStats:", error);
    return { EM: "Lỗi khi lấy thống kê bài thi", EC: "-1", DT: null };
  }
};

/**
 * Thống kê từ vựng
 */
exports.getVocabularyStats = async () => {
  try {
    const { UserWordStatus } = require("../../models");

    // Topics by word count (topic_name thay vì name)
    const topicsByWordCount = await Word.findAll({
      attributes: [
        "topic_id",
        [fn("COUNT", col("word_id")), "wordCount"],
      ],
      include: [
        {
          model: require("../../models").Topic,
          attributes: ["topic_name", "description"],
        },
      ],
      group: ["topic_id"],
      order: [[literal("wordCount"), "DESC"]],
      limit: 10,
      raw: true,
      nest: true,
    });

    // User learning progress - sử dụng is_learned từ UserWordStatus
    const learnedWords = await UserWordStatus.count({
      where: { is_learned: true },
    });
    const totalUserWordStatus = await UserWordStatus.count();
    const notLearnedWords = totalUserWordStatus - learnedWords;

    const userLearningStats = [
      { status: "learned", count: learnedWords },
      { status: "not_learned", count: notLearnedWords },
    ];

    // Starred words count
    const starredWords = await UserWord.count({
      where: { is_starred: 1 },
    });

    // New words added by month
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const wordsByMonth = await Word.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"],
        [fn("COUNT", col("word_id")), "count"],
      ],
      where: {
        created_at: { [Op.gte]: twelveMonthsAgo },
      },
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    return {
      EM: "Lấy thống kê từ vựng thành công",
      EC: "0",
      DT: {
        topicsByWordCount: topicsByWordCount,
        userLearningStats: userLearningStats,
        starredWords: starredWords,
        wordsByMonth: wordsByMonth,
      },
    };
  } catch (error) {
    console.error("Error in getVocabularyStats:", error);
    return { EM: "Lỗi khi lấy thống kê từ vựng", EC: "-1", DT: null };
  }
};

