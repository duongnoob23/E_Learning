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
  ExamTag,
  QuestionTag
} = require("../../models");
const { Op } = require("sequelize");

// GET /api/tests - Lấy danh sách đề thi
exports.getTests = async (filters = {}) => {
    try {
        const { exam_type, difficulty_level, page = 1, limit = 10 } = filters;

        const whereClause = {};
        if (exam_type) whereClause.exam_type = exam_type;
        if (difficulty_level) whereClause.difficulty_level = difficulty_level;

        const offset = (page - 1) * limit;

        const { count, rows: tests } = await Test.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['created_at', 'DESC']]
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
                    items_per_page: parseInt(limit)
                }
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
}

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
}

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
}

// GET /api/tests/{test_id}/result - Lấy kết quả thi của đề thi
exports.getPracticeTestResult = async (test_id, user_id) => {
    try {
        const examSessions = await ExamSession.findByUserIdAndTestId(user_id, test_id);
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
}

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
}

// POST /api/exam-sessions/start - Bắt đầu phiên thi
exports.startExamSession = async (sessionData) => {
    try {
        const { user_id, test_id, session_type, selected_parts, time_limit_minutes } = sessionData;

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
            session_type: session_type || 'FULL_TEST',
            start_time: new Date(),
            selected_parts: selected_parts ? JSON.stringify(selected_parts) : null,
            time_limit_minutes: time_limit_minutes || test.total_duration,
            status: 'IN_PROGRESS'
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
}
// POST /api/exam-sessions/{session_id}/submit - Nộp bài thi
exports.submitExamSession = async (session_id, user_id, answers) => {   
    try {
        // Kiểm tra phiên thi có tồn tại và thuộc về user không
        const examSession = await ExamSession.findById(session_id);
        if (!examSession || examSession.user_id !== user_id) {
            return {
                EM: "Không tìm thấy phiên thi hoặc bạn không có quyền truy cập",
                EC: "2",
                DT: null,
            };
        }

        if (examSession.status !== 'IN_PROGRESS') {
            return {
                EM: "Phiên thi đã kết thúc",
                EC: "3",
                DT: null,
            };
        }

        let correctAnswers = 0;
        let wrongAnswers = 0;
        let skippedAnswers = 0;
        const totalQuestions = answers.length;
        const partStats = {}; // { part_id: { total: x, correct: y } }

        // Xử lý từng câu trả lời
        for (const ans of answers) {
            const question = await Question.findById(ans.question_id);
            if (!question) continue;

            let isCorrect = null;
            let selectedChoice = null;

            if (ans.selected_choice_id) {
                selectedChoice = await Choice.findById(ans.selected_choice_id);
                isCorrect = selectedChoice ? selectedChoice.is_correct : false;

                if (isCorrect) {
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                }
            } else {
                skippedAnswers++;
            }

            // Lưu UserAnswer
            await UserAnswer.createAnswer({
                exam_session_id: session_id,
                question_id: ans.question_id,
                selected_choice_id: ans.selected_choice_id || null,
                is_correct: isCorrect,
                answer_time: new Date()
            });

            // Thống kê theo Part
            if (!partStats[question.part_id]) {
                partStats[question.part_id] = { total: 0, correct: 0 };
            }
            partStats[question.part_id].total += 1;
            if (isCorrect) partStats[question.part_id].correct += 1;
        }

        // Tính điểm tổng
        const totalScore = Math.round((correctAnswers / totalQuestions) * 100);

        // Cập nhật phiên thi
        const endTime = new Date();
        const durationSeconds = Math.floor((endTime - new Date(examSession.start_time)) / 1000);

        await ExamSession.updateSession(session_id, {
            end_time: endTime,
            duration_seconds: durationSeconds,
            total_score: totalScore,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            skipped_answers: skippedAnswers,
            status: 'COMPLETED'
        });

        // Cập nhật thống kê người dùng
        await this.updateUserStatistics(user_id, totalScore, totalQuestions, correctAnswers);

        // Cập nhật thống kê từng part
        for (const [part_id, stats] of Object.entries(partStats)) {
            await PartStatistics.updatePartPerformance(
                user_id,
                parseInt(part_id),
                stats.total,
                stats.correct
            );
        }

        const updatedSession = await ExamSession.findById(session_id);

        return {
            EM: "Nộp bài thi thành công",
            EC: "0",
            DT: updatedSession,
        };
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

        if (examSession.status !== 'COMPLETED') {
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
                part_statistics: partStatistics
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
}

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

        if (examSession.status !== 'COMPLETED') {
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
            const selectedChoice = answer.selected_choice_id ?
                await Choice.findById(answer.selected_choice_id) : null;

            detailedAnswers.push({
                ...answer.toJSON(),
                question,
                selected_choice: selectedChoice
            });
        }

        return {
            EM: "Xem lại bài thi thành công",
            EC: "0",
            DT: {
                session: examSession,
                detailed_answers: detailedAnswers
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
}

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

        if (examSession.status !== 'COMPLETED') {
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
            session_type: 'REVIEW',
            start_time: new Date(),
            selected_parts: null,
            time_limit_minutes: null,
            status: 'IN_PROGRESS',
            parent_session_id: session_id
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
                wrong_questions: wrongQuestions
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
}

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
                recent_sessions: recentSessions
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
}

// GET /api/discussions/test/{test_id} - Lấy thảo luận của đề thi
exports.getTestDiscussions = async (test_id, options = {}) => {
    try {
        const { page = 1, limit = 10 } = options;
        const offset = (page - 1) * limit;

        const { count, rows: discussions } = await TestDiscussion.findAndCountAll({
            where: { test_id },
            limit: parseInt(limit),
            offset: offset,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'username', 'full_name', 'avatar_url']
                },
                {
                    model: TestComment,
                    as: 'comments',
                    limit: 3,
                    order: [['created_at', 'DESC']],
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['user_id', 'username', 'full_name', 'avatar_url']
                        }
                    ]
                }
            ]
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
                    items_per_page: parseInt(limit)
                }
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
}

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
            content
        });

        // Lấy thảo luận với thông tin user
        const discussionWithUser = await TestDiscussion.findOne({
            where: { test_discussion_id: discussion.test_discussion_id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'username', 'full_name', 'avatar_url']
                }
            ]
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
}

// POST /api/discussions/{discussion_id}/comments - Thêm bình luận
exports.addComment = async (commentData) => {
    try {
        const { test_discussion_id, user_id, content, parent_comment_id } = commentData;

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
            parent_comment_id: parent_comment_id || null
        });

        // Lấy bình luận với thông tin user
        const commentWithUser = await TestComment.findOne({
            where: { test_comment_id: comment.test_comment_id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'username', 'full_name', 'avatar_url']
                }
            ]
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
}

// Helper function - Cập nhật thống kê người dùng
exports.updateUserStatistics = async (user_id, score, total_questions, correct_answers) => {
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
                total_study_time_minutes: 0
            });
        } else {
            // Cập nhật thống kê
            const newTotalTests = userStats.total_tests_taken + 1;
            const newTotalQuestions = userStats.total_questions_answered + total_questions;
            const newTotalCorrect = userStats.total_correct_answers + correct_answers;
            const newAverageScore = Math.round((userStats.average_score * userStats.total_tests_taken + score) / newTotalTests);

            await UserExamStatistics.update({
                total_tests_taken: newTotalTests,
                total_questions_answered: newTotalQuestions,
                total_correct_answers: newTotalCorrect,
                average_score: newAverageScore,
                highest_score: Math.max(userStats.highest_score, score),
                lowest_score: Math.min(userStats.lowest_score, score)
            }, {
                where: { user_id }
            });
        }
    } catch (error) {
        console.error("Error updating user statistics:", error);
    }
}

// GET /api/exam-sessions/{session_id}/result-by-tags - Lấy kết quả phân tích theo tag
exports.getResultByTags = async (session_id, user_id) => {
    try {
        // Kiểm tra session có tồn tại và thuộc về user không
        const session = await ExamSession.findOne({
            where: {
                exam_session_id: session_id,
                user_id: user_id,
                status: 'COMPLETED'
            }
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
                    as: 'question',
                    include: [
                        {
                            model: QuestionTag,
                            as: 'questionTags',
                            include: [
                                {
                                    model: ExamTag,
                                    as: 'examTag'
                                }
                            ]
                        }
                    ]
                }
            ]
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
        userAnswers.forEach(answer => {
            const question = answer.question;
            if (!question || !question.questionTags) return;

            // Duyệt qua tất cả tag của câu hỏi
            question.questionTags.forEach(questionTag => {
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
                        question_list: []
                    });
                }

                const stats = tagStats.get(tagName);
                stats.total_questions++;

                // Thêm thông tin câu hỏi vào danh sách
                stats.question_list.push({
                    question_id: question.question_id,
                    question_number: question.question_number,
                    question_text: question.question_text.substring(0, 100) + '...', // Cắt ngắn text
                    is_correct: answer.is_correct,
                    selected_choice_id: answer.selected_choice_id
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
                    stats.accuracy_rate = ((stats.correct_answers / stats.total_questions) * 100).toFixed(2);
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
            total_correct: userAnswers.filter(a => a.is_correct === true).length,
            total_wrong: userAnswers.filter(a => a.is_correct === false).length,
            total_skipped: userAnswers.filter(a => a.is_correct === null).length,
            overall_accuracy: ((userAnswers.filter(a => a.is_correct === true).length / userAnswers.length) * 100).toFixed(2)
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
                    duration_seconds: session.duration_seconds
                },
                overall_statistics: totalStats,
                tag_analysis: tagAnalysis
            },
        };

    } catch (error) {
        console.error("Error in getResultByTags service:", error);
        return {
            EM: "Lỗi server khi lấy kết quả phân tích theo tag",
            EC: "1",
            DT: null,
        };
    }
};
