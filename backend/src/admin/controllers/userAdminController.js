const userAdminService = require("../services/userAdminService");

exports.assignRoleToUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { role_id } = req.body;
        const response = await userAdminService.assignRoleToUser(user_id, role_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const response = await userAdminService.getUsers(req.query);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserDetail = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserDetail(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const response = await userAdminService.createUser(req.body);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {    
    try {
        const { user_id } = req.params;
        const response = await userAdminService.updateUser(user_id, req.body);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.deleteUser(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.banUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.banUser(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.unbanUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.unbanUser(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { status } = req.body;
        const response = await userAdminService.updateUserStatus(user_id, status);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.verifyPhone = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.verifyPhone(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.verifyEmail = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.verifyEmail(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.searchUsers = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const response = await userAdminService.searchUsers(keyword);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.filterUsers = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const response = await userAdminService.filterUsers(from, to);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUsersStats = async (req, res, next) => {
    try {
        const response = await userAdminService.getUsersStats();
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUsersStatsByStatus = async (req, res, next) => {
    try {
        const response = await userAdminService.getUsersStatsByStatus();
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserEnrollments = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserEnrollments(user_id, req.query);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserPayments = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserPayments(user_id, req.query);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserFlashcardProgress = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserFlashcardProgress(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserCreatedTopics = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserCreatedTopics(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserExams = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserExams(user_id, req.query);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserExamStatistics = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserExamStatistics(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserExamResult = async (req, res, next) => {
    try {
        const { user_id, exam_session_id } = req.params;
        const response = await userAdminService.getUserExamResult(user_id, exam_session_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

exports.getUserCourseProgress = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.getUserCourseProgress(user_id, req.query);
        res.json(response);
    } catch (error) {
        next(error);
    }
}