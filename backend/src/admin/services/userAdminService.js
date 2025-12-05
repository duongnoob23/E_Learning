const { User } = require("../../models");
const { Op } = require("sequelize");

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
        const user = await User.findbyId(user_id);
        if (!user) {
            return {
                EM: "Không tìm thấy người dùng",
                EC: "2",
                DT: null,
            };
        }

        return {
            EM: "Thành công",
            EC: "0",
            DT: user,
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