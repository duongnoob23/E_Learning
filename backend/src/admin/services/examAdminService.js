const { Test, TestCategoryRelation, ExamSession, Question, Choice, Part } = require("../../models");

exports.getTests = async () => {
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
}

exports.createTest = async ( {title, duration, description, category_ids}) => {
    try {
        const testData = {
            title,
            description,
            exam_type: 'TOEIC',
            total_duration: duration,
            total_questions: 0,
            total_parts: 0,
            difficulty_level: 'EASY',
            created_by: 1,
        };
        const test = await Test.createTest(testData);
        const testCategory = await TestCategoryRelation.createRelation({
            test_id: test.test_id,
            exam_category_id: category_ids,
        });
        return {
            EM: "Tạo đề thi thành công",
            EC: "0",
            DT: test,
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình tạo đề thi",
            EC: "-2",
            DT: null,
        };
    }
}

exports.updateTest = async (test_id, {title, duration, description}) => {
    try {
        const test = await Test.updateTest(test_id, {title, total_duration: duration, description});
        return {
            EM: "Cập nhật đề thi thành công",
            EC: "0",
            DT: test,
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình cập nhật đề thi",
            EC: "-2",
            DT: null,
        };
    }
}

// Xóa dữ liệu liên quan trong parts, questions, choices → Sau đó xóa bản ghi tests.
exports.deleteTest = async (test_id) => {
    try {
        await TestCategoryRelation.deleteByTestId(test_id);
        await Part.deletePartByTestId(test_id);
        await Test.deleteTest(test_id);
        return {
            EM: "Xóa đề thi thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình xóa đề thi",
            EC: "-2",
            DT: null,
        };
    }
}

exports.addPartToTest = async (test_id, { part_name, part_type,part_number, question_count, duration_minutes, description, display_template }) => {
    try {
        console.log()
        const part = await Part.createPart({
            test_id,
            part_name,
            part_type,
            part_number,
            question_count,
            duration_minutes,
            description,
            display_template,
        });
        return {
            EM: "Thêm part thành công",
            EC: "0",
            DT: part,
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình thêm part",
            EC: "-2",
            DT: null,
        };
    }
}

exports.addQuestionToPart = async (part_id, { question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes }) => {
    try {
        const question = await Question.createQuestion({
            part_id,
            question_text,
            question_type,
            audio_file,
            image_file,
            transcript,
            explanation,
            grammar_notes,
        });
        return {
            EM: "Thêm câu hỏi thành công",
            EC: "0",
            DT: question,
        };
    }
    catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình thêm câu hỏi",
            EC: "-2",
            DT: null,
        };
    }
}

exports.updateQuestion = async (question_id, { question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes }) => {
    try {
        const question = await Question.updateQuestion(question_id, {
            question_text,
            question_type,
            audio_file,
            image_file,
            transcript,
            explanation,
            grammar_notes,
        });
        return {
            EM: "Cập nhật câu hỏi thành công",
            EC: "0",
            DT: question,
        };
    }
    catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình cập nhật câu hỏi",
            EC: "-2",
            DT: null,
        };
    }
}

// Xóa bản ghi questions, liên quan trong choices.
exports.deleteQuestion = async (question_id) => {
    try {
        await Choice.deleteChoiceByQuestionId(question_id);
        await Question.deleteQuestion(question_id);
        return {
            EM: "Xóa câu hỏi thành công",
            EC: "0",
            DT: null,
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình xóa câu hỏi",
            EC: "-2",
            DT: null,
        };
    }
}

// Danh sách session của người dùng (user_id, score, duration)
exports.getTestSessions = async (test_id) => {
    try{
        const sessions = await ExamSession.findByTestIdWithUser(test_id);
        return {
            EM: "Lấy danh sách session thành công",
            EC: "0",
            DT: sessions,
        };
    } catch{
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy danh sách session",
            EC: "-2",
            DT: null,
        };
    }
}


// Lấy thông tin chi tiết của session (user_id, score, duration, answers, part_statistics)
exports.getExamSessionDetail = async (session_id) => {
    try {
        const session = await ExamSession.findWithAnswers(session_id);
        const user_answers = await UserAnswer.findBySessionId(session_id);
        return {
            EM: "Lấy thông tin session thành công",
            EC: "0",
            DT: {
                session,
                user_answers,
            },
        };
    }
    catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy thông tin session",
            EC: "-2",
            DT: null,
        };
    }
}


// Thống kê tổng hợp (số lượt thi, điểm trung bình, part yếu nhất, tỉ lệ đúng)
// Tính toán dựa trên dữ liệu exam_sessions, user_statistics, part_statistics.
exports.getTestStatistics = async (test_id) => {
    try {
        const sessions = await ExamSession.findByTestId(test_id);
        const totalSessions = sessions.length;
        const totalScore = sessions.reduce((acc, session) => acc + session.total_score, 0);
        const averageScore = totalSessions ? totalScore / totalSessions : 0;
        // const partStats = await PartStatistics.findByTestId(test_id);
        // const weakestPart = partStats.reduce((acc, part) => part.accuracy_rate < acc.accuracy_rate ? part : acc);
        // const highestAccuracyPart = partStats.reduce((acc, part) => part.accuracy_rate > acc.accuracy_rate ? part : acc);
        return {
            EM: "Lấy thống kê bài thi thành công",
            EC: "0",
            DT: {
                sessions,
                totalSessions,
                averageScore,
                // weakestPart,
                // highestAccuracyPart,
            },
        };
    } catch (error) {
        return {
            EM: "Có lỗi xảy ra trong quá trình lấy thống kê bài thi",
            EC: "-2",
            DT: null,
        };
    }
}
        


