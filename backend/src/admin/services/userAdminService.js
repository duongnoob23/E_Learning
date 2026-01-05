const { 
    User, 
    UserRole, 
    CourseEnrollment, 
    Course, 
    Payment, 
    Order, 
    OrderItem,
    Topic,
    Word,
    UserWordStatus,
    ExamSession,
    Test,
    PartStatistics,
    Part,
    UserExamStatistics,
    LessonProgress,
    Lesson
} = require("../../models");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../../config/database");

//--- Gán role cho user ---//

exports.assignRoleToUser = async (user_id, role_id) => {
    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return {
                EM: "Người dùng không tồn tại",
                EC: "2",
                DT: null,
            };
        }
        const existingUserRole = await UserRole.findOne({
            where: { user_id, role_id },
        });
        if (existingUserRole) {
            return {
                EM: "Người dùng đã có role này",
                EC: "2",
                DT: null,
            };
        }
        const userRole = await UserRole.create({ user_id, role_id });
        return {
            EM: "Gán role thành công",
            EC: "0",
            DT: userRole,
        };
    } catch (error) {
        console.error("Error in assignRoleToUser:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình gán role",
            EC: "-2",
            DT: null,
        };
    }
}
//--- Quản lý tài khoản ---//
exports.getUsers = async (query) => {
    try {
        const { page = 1, limit = 10, sort = "ASC", order = "user_id" } = query;
        const offset = (page - 1) * limit;
        const { count, rows: users } = await User.findAndCountAll({
            offset,
            limit: parseInt(limit),
            order: [[order, sort]],
            attributes: { exclude: ["password_hash"] },
        });
        
        if (!users || users.length === 0) {
            return {
                EM: "Không tìm thấy người dùng",
                EC: "2",
                DT: null,
            };
        }

        return {
            EM: "Thành công",
            EC: "0",

            DT: {
                users,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                    items_per_page: parseInt(limit),
                },
            },
        };
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy danh sách người dùng",
            EC: "-2",
            DT: null,
        };
    }
}   

exports.getUserDetail = async (user_id) => {
    try {
        const user = await User.findOne({
            where: { user_id },
            attributes: { exclude: ["password_hash"] },
        });

        if (!user) {
            return {
                EM: "Không tìm thấy người dùng",
                EC: "2",
                DT: null,
            };
        }

        // Lấy danh sách khóa học đã đăng ký
        const enrollments = await CourseEnrollment.findAll({
            where: { user_id },
            include: [
                {
                    model: Course,
                    attributes: ["course_id", "title", "image", "price", "is_free"],
                    required: false, // Cho phép enrollment có course_id null
                },
            ],
            order: [["enrolled_at", "DESC"]],
        });

        // Lấy danh sách giao dịch
        const payments = await Payment.findAll({
            where: { user_id },
            include: [
                {
                    model: Order,
                    as: "order",
                    attributes: ["order_id", "order_number", "total_amount", "order_status"],
                    include: [
                        {
                            model: OrderItem,
                            as: "items",
                            include: [
                                {
                                    model: Course,
                                    as: "course",
                                    attributes: ["course_id", "title"],
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        // Thống kê tổng quan
        const stats = {
            totalEnrollments: enrollments.length,
            completedCourses: enrollments.filter(e => e.status === "completed").length,
            activeCourses: enrollments.filter(e => e.status === "active").length,
            totalPayments: payments.length,
            totalSpent: payments
                .filter(p => p.payment_status === "completed")
                .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
        };

        return {
            EM: "Thành công",
            EC: "0",
            DT: {
                user,
                enrollments,
                payments,
                stats,
            },
        };
    } catch (error) {
        console.error("Error in getUserDetail:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy thông tin người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

exports.createUser = async (data) => {
    try {
        const newUser = await User.createUser(data);
        return {
            EM: "Tạo người dùng thành công",
            EC: "0",
            DT: newUser,
        };
    } catch (error) {
        console.error("Error in createUser:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình tạo người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

exports.updateUser = async (user_id, data) => {
    try {
        const updatedUser = await User.updateUser(user_id, data);
        return {
            EM: "Cập nhật người dùng thành công",
            EC: "0",
            DT: updatedUser,
        };
    } catch (error) {
        console.error("Error in updateUser:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình cập nhật người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

exports.deleteUser = async (user_id) => {
    try {
        await User.deleteUser(user_id);
        return {
            EM: "Xóa người dùng thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        console.error("Error in deleteUser:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình xóa người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

//--- Quản lý trạng thái tài khoản ---//
exports.banUser = async (user_id) => {
    try {
        await User.updateUser(user_id, { status: "banned" });
        return {
            EM: "Chặn người dùng thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        console.error("Error in banUser:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình chặn người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

exports.unbanUser = async (user_id) => {
    try {
        await User.updateUser(user_id, { status: "active" });
        return {
            EM: "Bỏ chặn người dùng thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        console.error("Error in unbanUser:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình bỏ chặn người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

exports.updateUserStatus = async (user_id, status) => {
    try {
        await User.updateUser(user_id, { status });
        return {
            EM: "Cập nhật trạng thái người dùng thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        console.error("Error in updateUserStatus:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình cập nhật trạng thái người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

//--- Quản lý xác thực email & phone ---//
exports.verifyEmail = async (user_id) => {
    try {
        await User.updateUser(user_id, { email_verified: true });
        return {
            EM: "Xác thực email thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        console.error("Error in verifyEmail:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình xác thực email",
            EC: "-2",
            DT: null,
        };
    }
}

exports.verifyPhone = async (user_id) => {
    try {
        await User.updateUser(user_id, { phone_verified: true });
        return {
            EM: "Xác thực số điện thoại thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        console.error("Error in verifyPhone:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình xác thực số điện thoại",
            EC: "-2",
            DT: null,
        };
    }
}

//--- Quản lý bảo mật & đăng nhập ---//
exports.resetPassword = async (user_id, new_password) => {
    try {   
        await User.updateUser(user_id, { password_hash: new_password });
        return {
            EM: "Đặt lại mật khẩu thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình đặt lại mật khẩu",
            EC: "-2",
            DT: null,
        };
    }
}

//--- Tìm kiếm & lọc nâng cao ---//
exports.searchUsers = async (keyword) => {
    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `%${keyword}%` } },
                    { email: { [Op.like]: `%${keyword}%` } },
                    { full_name: { [Op.like]: `%${keyword}%` } },
                ],
            },
        });
        return {
            EM: "Tìm kiếm thành công",
            EC: "0",
            DT: users,
        };
    } catch (error) {
        console.error("Error in searchUsers:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình tìm kiếm",
            EC: "-2",
            DT: null,
        };
    }
}

exports.filterUsers = async (from, to) => {
    try {
        const users = await User.findAll({
            where: {
                created_at: { [Op.between]: [from, to] },
            },
        });
        return {
            EM: "Lọc người dùng thành công",
            EC: "0",
            DT: users,
        };
    } catch (error) {
        console.error("Error in filterUsers:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lọc người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

//--- Thống kê phân tích ---//  
// json tra ve :{
//   "total_users": 1200,
//   "active": 950,
//   "banned": 20,
//   "inactive": 150,
//   "pending_verification": 80,
//   "today_new_users": 12
// }
exports.getUsersStats = async () => {
    try {
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { status: "active" } });
        const bannedUsers = await User.count({ where: { status: "banned" } });
        const inactiveUsers = await User.count({ where: { status: "inactive" } });
        const pendingVerificationUsers = await User.count({ where: { status: "pending_verification" } });
        const todayNewUsers = await User.count({ where: { created_at: { [Op.gte]: new Date() } } });

        return {
            EM: "Thống kê người dùng thành công",
            EC: "0",
            DT: {
                total_users: totalUsers,
                active: activeUsers,
                banned: bannedUsers,
                inactive: inactiveUsers,
                pending_verification: pendingVerificationUsers,
                today_new_users: todayNewUsers,
            },
        };
    } catch (error) {
        console.error("Error in getUsersStats:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình thống kê người dùng",
            EC: "-2",
            DT: null,
        };
    }
}

exports.getUsersStatsByStatus = async () => {
    try{
        const users = await User.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
            group: ['status'],
        });

        return {
            EM: "Thống kê người dùng theo trạng thái thành công",
            EC: "0",
            DT: users,
        };
    } catch (error) {
        console.error("Error in getUsersStatsByStatus:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình thống kê người dùng theo trạng thái",
            EC: "-2",
            DT: null,
        };
    }
}

//--- Lấy danh sách khóa học đã đăng ký của user ---//
exports.getUserEnrollments = async (user_id, query = {}) => {
    try {
        const { page = 1, limit = 10, status } = query;
        const offset = (page - 1) * limit;

        const whereClause = { user_id };
        if (status) {
            whereClause.status = status;
        }

        const { count, rows: enrollments } = await CourseEnrollment.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Course,
                    attributes: ["course_id", "title", "image", "price", "is_free", "status"],
                },
            ],
            offset,
            limit: parseInt(limit),
            order: [["enrolled_at", "DESC"]],
        });

        return {
            EM: "Lấy danh sách khóa học đã đăng ký thành công",
            EC: "0",
            DT: {
                enrollments,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                    items_per_page: parseInt(limit),
                },
            },
        };
    } catch (error) {
        console.error("Error in getUserEnrollments:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy danh sách khóa học",
            EC: "-2",
            DT: null,
        };
    }
};

//--- Lấy danh sách giao dịch của user ---//
exports.getUserPayments = async (user_id, query = {}) => {
    try {
        const { page = 1, limit = 10, payment_status } = query;
        const offset = (page - 1) * limit;

        const whereClause = { user_id };
        if (payment_status) {
            whereClause.payment_status = payment_status;
        }

        const { count, rows: payments } = await Payment.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Order,
                    as: "order",
                    attributes: ["order_id", "order_number", "total_amount", "order_status", "created_at"],
                    include: [
                        {
                            model: OrderItem,
                            as: "items",
                            include: [
                                {
                                    model: Course,
                                    as: "course",
                                    attributes: ["course_id", "title", "image"],
                                },
                            ],
                        },
                    ],
                },
            ],
            offset,
            limit: parseInt(limit),
            order: [["created_at", "DESC"]],
        });

        // Tính tổng tiền đã thanh toán
        const totalSpent = await Payment.sum("amount", {
            where: { user_id, payment_status: "completed" },
        }) || 0;

        return {
            EM: "Lấy danh sách giao dịch thành công",
            EC: "0",
            DT: {
                payments,
                totalSpent,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                    items_per_page: parseInt(limit),
                },
            },
        };
    } catch (error) {
        console.error("Error in getUserPayments:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy danh sách giao dịch",
            EC: "-2",
            DT: null,
        };
    }
};

//--- Flashcard Progress ---//
exports.getUserFlashcardProgress = async (user_id) => {
    try {
        // Lấy tất cả topics active
        const allTopics = await Topic.findAll({
            where: { is_active: true },
            attributes: ["topic_id", "topic_name", "description", "image_url"],
        });

        // Lấy trạng thái học từ của user
        const userWordStatuses = await UserWordStatus.findAll({
            where: { user_id },
            attributes: ["word_id", "topic_id", "is_learned", "marked_at"],
        });

        // Tính toán tiến độ cho từng topic
        const topicsWithProgress = await Promise.all(
            allTopics.map(async (topic) => {
                const topicWords = await Word.findAll({
                    where: { topic_id: topic.topic_id, is_active: true },
                    attributes: ["word_id"],
                });

                const totalWords = topicWords.length;
                const userStatuses = userWordStatuses.filter(
                    (uws) => uws.topic_id === topic.topic_id
                );

                const wordsLearned = userStatuses.filter((uws) => uws.is_learned === true).length;
                const wordsLearning = userStatuses.filter((uws) => uws.is_learned === false).length;
                const wordsNew = totalWords - userStatuses.length;

                const progressPercent =
                    totalWords > 0 ? Math.round((wordsLearned / totalWords) * 100 * 100) / 100 : 0;

                const lastStudiedAt = userStatuses.length > 0
                    ? userStatuses
                          .map((uws) => uws.marked_at)
                          .filter((date) => date !== null)
                          .sort((a, b) => new Date(b) - new Date(a))[0]
                    : null;

                return {
                    topic_id: topic.topic_id,
                    topic_name: topic.topic_name,
                    description: topic.description,
                    image_url: topic.image_url,
                    total_words: totalWords,
                    words_learned: wordsLearned,
                    words_learning: wordsLearning,
                    words_new: wordsNew,
                    progress_percent: progressPercent,
                    last_studied_at: lastStudiedAt,
                };
            })
        );

        // Tính tổng số từ đã học
        const totalWordsLearned = userWordStatuses.filter((uws) => uws.is_learned === true).length;
        const totalTopicsStudied = new Set(userWordStatuses.map((uws) => uws.topic_id)).size;

        // Tính study streak (ngày liên tiếp học)
        const studyDates = userWordStatuses
            .filter((uws) => uws.marked_at !== null)
            .map((uws) => {
                const date = new Date(uws.marked_at);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            });
        const uniqueStudyDates = [...new Set(studyDates)].sort().reverse();

        let streak = 0;
        if (uniqueStudyDates.length > 0) {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            let currentDate = new Date(todayStr);

            for (let i = 0; i < uniqueStudyDates.length; i++) {
                const studyDate = new Date(uniqueStudyDates[i]);
                const diffTime = currentDate - studyDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === i || (i === 0 && diffDays <= 1)) {
                    streak++;
                    currentDate = new Date(studyDate);
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        return {
            EM: "Lấy tiến độ học flashcard thành công",
            EC: "0",
            DT: {
                overall: {
                    total_words_learned: totalWordsLearned,
                    total_topics_studied: totalTopicsStudied,
                    study_streak: streak,
                },
                topics: topicsWithProgress.filter((t) => t.total_words > 0),
            },
        };
    } catch (error) {
        console.error("Error in getUserFlashcardProgress:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy tiến độ học flashcard",
            EC: "-2",
            DT: null,
        };
    }
};

exports.getUserCreatedTopics = async (user_id) => {
    try {
        const topics = await Topic.findAll({
            where: {
                created_by: user_id,
                topic_type: "user_created",
            },
            attributes: [
                "topic_id",
                "topic_name",
                "description",
                "image_url",
                "word_count",
                "is_active",
                "created_at",
                "updated_at",
            ],
            order: [["created_at", "DESC"]],
        });

        // Đếm số người học mỗi topic
        const topicsWithLearners = await Promise.all(
            topics.map(async (topic) => {
                const learnersCount = await UserWordStatus.count({
                    where: { topic_id: topic.topic_id },
                    distinct: true,
                    col: "user_id",
                });

                return {
                    ...topic.toJSON(),
                    learners_count: learnersCount,
                };
            })
        );

        const statistics = {
            total_topics: topics.length,
            total_words: topics.reduce((sum, t) => sum + (t.word_count || 0), 0),
            total_learners: await UserWordStatus.count({
                where: {
                    topic_id: { [Op.in]: topics.map((t) => t.topic_id) },
                },
                distinct: true,
                col: "user_id",
            }),
            average_words_per_topic:
                topics.length > 0
                    ? Math.round(
                          (topics.reduce((sum, t) => sum + (t.word_count || 0), 0) / topics.length) *
                              100
                      ) / 100
                    : 0,
        };

        return {
            EM: "Lấy danh sách topics user đã tạo thành công",
            EC: "0",
            DT: {
                topics: topicsWithLearners,
                statistics,
            },
        };
    } catch (error) {
        console.error("Error in getUserCreatedTopics:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy danh sách topics",
            EC: "-2",
            DT: null,
        };
    }
};

//--- Exam Progress ---//
exports.getUserExams = async (user_id, query = {}) => {
    try {
        const { page = 1, limit = 20 } = query;
        const offset = (page - 1) * limit;

        console.log(`[getUserExams] Fetching exams for user_id: ${user_id}, page: ${page}, limit: ${limit}`);

        // Sử dụng cùng cách query như client API (findRecentSessions)
        const { count, rows: examSessions } = await ExamSession.findAndCountAll({
            where: { user_id },
            include: [
                {
                    model: Test,
                    as: "test", // ✅ Sử dụng "test" (小写) như client API
                    attributes: ["test_id", "title", "exam_type", "total_duration", "total_questions"],
                    required: false,
                },
            ],
            order: [["start_time", "DESC"]],
            offset,
            limit: parseInt(limit),
        });

        console.log(`[getUserExams] Found ${count} total sessions, returning ${examSessions.length} sessions`);

        // Format data - 与客户端 API 保持一致
        const exams = examSessions.map((session) => {
            // ✅ 优先使用 session.test (小写)，与客户端 API 一致
            const test = session.test || session.Test || null;
            
            // Parse selected_parts nếu là JSON string
            let selectedParts = null;
            try {
                if (session.selected_parts) {
                    selectedParts = typeof session.selected_parts === 'string' 
                        ? JSON.parse(session.selected_parts) 
                        : session.selected_parts;
                }
            } catch (e) {
                console.warn(`[getUserExams] Failed to parse selected_parts for session ${session.exam_session_id}:`, e.message);
            }

            const examData = {
                exam_session_id: session.exam_session_id,
                test_id: session.test_id,
                test_name: test?.title || "Unknown",
                exam_type: test?.exam_type || "TOEIC",
                session_type: session.session_type || "FULL_TEST",
                start_time: session.start_time,
                end_time: session.end_time,
                duration_seconds: session.duration_seconds || 0,
                duration_minutes: session.duration_seconds
                    ? Math.round((session.duration_seconds / 60) * 100) / 100
                    : 0,
                total_score: session.total_score || 0,
                correct_answers: session.correct_answers || 0,
                wrong_answers: session.wrong_answers || 0,
                skipped_answers: session.skipped_answers || 0,
                status: session.status,
                selected_parts: selectedParts, // ✅ 添加 selected_parts 信息
                created_at: session.created_at,
            };

            if (process.env.NODE_ENV === "development") {
                console.log(`[getUserExams] Session ${session.exam_session_id}:`, {
                    test_name: examData.test_name,
                    status: examData.status,
                    selected_parts: examData.selected_parts,
                });
            }

            return examData;
        });

        console.log(`[getUserExams] Returning ${exams.length} formatted exams`);

        return {
            EM: "Lấy lịch sử làm bài thi thành công",
            EC: "0",
            DT: {
                exams,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                    items_per_page: parseInt(limit),
                },
            },
        };
    } catch (error) {
        console.error("[getUserExams] Error:", error.message);
        console.error("[getUserExams] Stack:", error.stack);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy lịch sử làm bài thi",
            EC: "-2",
            DT: null,
        };
    }
};

exports.getUserExamStatistics = async (user_id) => {
    try {
        // Lấy thống kê từ UserExamStatistics nếu có
        const userExamStats = await UserExamStatistics.findOne({
            where: { user_id },
        });

        // Lấy thống kê tổng quan từ exam_sessions
        const completedSessions = await ExamSession.findAll({
            where: {
                user_id,
                status: "COMPLETED",
            },
            attributes: [
                "total_score",
                "correct_answers",
                "wrong_answers",
                "duration_seconds",
            ],
        });

        // Sử dụng UserExamStatistics nếu có, nếu không thì tính từ sessions
        const totalExams = userExamStats?.total_tests_taken || completedSessions.length;
        const averageScore = userExamStats?.average_score 
            ? parseFloat(userExamStats.average_score)
            : (totalExams > 0
                ? Math.round(
                      (completedSessions.reduce((sum, s) => sum + (s.total_score || 0), 0) /
                          totalExams) *
                          100
                  ) / 100
                : 0);
        const bestScore = userExamStats?.best_score 
            ? userExamStats.best_score
            : (totalExams > 0
                ? Math.max(...completedSessions.map((s) => s.total_score || 0))
                : 0);
        const worstScore =
            totalExams > 0
                ? Math.min(...completedSessions.map((s) => s.total_score || 0))
                : 0;

        // Thống kê theo exam type
        const sessionsByType = await ExamSession.findAll({
            where: {
                user_id,
                status: "COMPLETED",
            },
            include: [
                {
                    model: Test,
                    attributes: ["exam_type"],
                    required: false,
                },
            ],
        });

        const byType = {};
        sessionsByType.forEach((session) => {
            const test = session.Test || session.test || null;
            const examType = test?.exam_type || "TOEIC";
            if (!byType[examType]) {
                byType[examType] = { count: 0, scores: [] };
            }
            byType[examType].count++;
            byType[examType].scores.push(session.total_score || 0);
        });

        const byTypeStats = Object.keys(byType).map((type) => ({
            exam_type: type,
            count: byType[type].count,
            average:
                byType[type].scores.length > 0
                    ? Math.round(
                          (byType[type].scores.reduce((a, b) => a + b, 0) /
                              byType[type].scores.length) *
                              100
                      ) / 100
                    : 0,
        }));

        // Thống kê theo part
        const partStats = await PartStatistics.findAll({
            where: { user_id },
            include: [
                {
                    model: Part,
                    as: "part",
                    attributes: ["part_name", "part_type", "part_number"],
                    required: false,
                },
            ],
            order: [["last_attempt", "DESC"]],
        });

        // Nếu part null, query trực tiếp từ Part table
        const byPart = await Promise.all(
            partStats.map(async (ps) => {
                let part = ps.part || ps.Part || null;
                
                // Nếu part null, query trực tiếp
                if (!part && ps.part_id) {
                    part = await Part.findByPk(ps.part_id, {
                        attributes: ["part_name", "part_type", "part_number"],
                    });
                }
                
                return {
                    part_id: ps.part_id,
                    part_name: part?.part_name || `Part ${ps.part_id}`,
                    part_type: part?.part_type || "LISTENING",
                    part_number: part?.part_number || 0,
                    accuracy_rate: parseFloat(ps.accuracy_rate || 0),
                    total_attempts: ps.total_attempts || 0,
                    total_questions: ps.total_questions || 0,
                    correct_answers: ps.correct_answers || 0,
                    last_attempt: ps.last_attempt,
                };
            })
        );

        // Score trend (10 lần gần nhất)
        const recentSessions = await ExamSession.findAll({
            where: {
                user_id,
                status: "COMPLETED",
            },
            order: [["start_time", "DESC"]],
            limit: 10,
            attributes: ["start_time", "total_score"],
        });

        const trend = recentSessions
            .reverse()
            .map((s) => ({
                date: s.start_time,
                score: s.total_score || 0,
            }));

        return {
            EM: "Lấy thống kê exam thành công",
            EC: "0",
            DT: {
                overall: {
                    total_exams: totalExams,
                    average_score: averageScore,
                    best_score: bestScore,
                    worst_score: worstScore,
                },
                by_type: byTypeStats,
                by_part: byPart,
                trend: trend,
            },
        };
    } catch (error) {
        console.error("Error in getUserExamStatistics:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy thống kê exam",
            EC: "-2",
            DT: null,
        };
    }
};

//--- Course Progress (Cải thiện từ getUserEnrollments) ---//
exports.getUserCourseProgress = async (user_id, query = {}) => {
    try {
        const { page = 1, limit = 20 } = query;
        const offset = (page - 1) * limit;

        const { count, rows: enrollments } = await CourseEnrollment.findAndCountAll({
            where: { user_id },
            include: [
                {
                    model: Course,
                    attributes: [
                        "course_id",
                        "title",
                        "image",
                        "price",
                        "is_free",
                        "total_lessons",
                        "total_duration",
                    ],
                    required: false, // Cho phép enrollment có course_id null
                },
                {
                    model: Lesson,
                    as: "last_accessed_lesson",
                    attributes: ["lesson_id", "title"],
                    required: false,
                },
            ],
            order: [["enrolled_at", "DESC"]],
            offset,
            limit: parseInt(limit),
        });

        // Lấy tiến độ từng lesson cho mỗi course
        const enrollmentsWithLessonProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                if (!enrollment.course_id) {
                    return {
                        enrollment_id: enrollment.enrollment_id,
                        course_id: null,
                        course_name: "Unknown Course",
                        course_image: null,
                        course_price: null,
                        is_free: false,
                        status: enrollment.status,
                        progress_percent: parseFloat(enrollment.progress_percent || 0),
                        enrolled_at: enrollment.enrolled_at,
                        completed_at: enrollment.completed_at,
                        last_accessed_lesson_id: enrollment.last_accessed_lesson_id,
                        last_accessed_at: enrollment.last_accessed_at,
                        lesson_progress: [],
                        completed_lessons: 0,
                        total_lessons: 0,
                    };
                }

                const lessonProgress = await LessonProgress.findAll({
                    where: {
                        user_id,
                        course_id: enrollment.course_id,
                    },
                    include: [
                        {
                            model: Lesson,
                            attributes: ["lesson_id", "title", "sort_order"],
                            required: false,
                        },
                    ],
                    order: [[{ model: Lesson }, "sort_order", "ASC"]],
                });

                const completedLessons = lessonProgress.filter(
                    (lp) => lp.status === "completed"
                ).length;
                const course = enrollment.Course || enrollment.course || null;
                const totalLessons = course?.total_lessons || 0;

                return {
                    enrollment_id: enrollment.enrollment_id,
                    course_id: enrollment.course_id,
                    course_name: course?.title || "Unknown",
                    course_image: course?.image,
                    course_price: course?.price,
                    is_free: course?.is_free,
                    status: enrollment.status,
                    progress_percent: parseFloat(enrollment.progress_percent || 0),
                    enrolled_at: enrollment.enrolled_at,
                    completed_at: enrollment.completed_at,
                    last_accessed_lesson_id: enrollment.last_accessed_lesson_id,
                    last_accessed_at: enrollment.last_accessed_at,
                    lesson_progress: lessonProgress.map((lp) => {
                        const lesson = lp.Lesson || lp.lesson || null;
                        return {
                            lesson_id: lp.lesson_id,
                            lesson_name: lesson?.title || "Unknown",
                            status: lp.status,
                            completion_percent: parseFloat(lp.completion_percent || 0),
                            watched_duration: lp.watched_duration,
                            total_duration: lp.total_duration,
                            started_at: lp.started_at,
                            completed_at: lp.completed_at,
                        };
                    }),
                    completed_lessons: completedLessons,
                    total_lessons: totalLessons,
                };
            })
        );

        return {
            EM: "Lấy tiến độ học course thành công",
            EC: "0",
            DT: {
                enrollments: enrollmentsWithLessonProgress,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                    items_per_page: parseInt(limit),
                },
            },
        };
    } catch (error) {
        console.error("Error in getUserCourseProgress:", error.message);
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy tiến độ học course",
            EC: "-2",
            DT: null,
        };
    }
};