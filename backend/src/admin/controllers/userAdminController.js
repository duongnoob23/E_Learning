const userAdminService = require("../services/userAdminService");


//--- Quản lý tài khoản ---//
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

//--- Quản lý trạng thái tài khoản ---//
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

//--- Quản lý xác thực email & phone ---//

exports.verifyPhone = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.verifyPhone(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

//--- Quản lý bảo mật & đăng nhập ---//
exports.verifyEmail = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const response = await userAdminService.verifyEmail(user_id);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

//--- Tìm kiếm & lọc nâng cao ---//
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

//--- Thống kê phân tích ---//
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
