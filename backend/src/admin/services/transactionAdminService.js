const { Op, fn, col, literal } = require("sequelize");
const {
  Order,
  OrderItem,
  Payment,
  User,
  Course,
  Coupon,
  sequelize,
} = require("../../models");

// ==================== LẤY DANH SÁCH GIAO DỊCH ==================== //
exports.getTransactions = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "DESC",
      order = "created_at",
      payment_status,
      order_status,
      payment_method,
      from_date,
      to_date,
      search,
    } = query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (payment_status) whereClause.payment_status = payment_status;
    if (order_status) whereClause.order_status = order_status;
    if (payment_method) whereClause.payment_method = payment_method;

    if (from_date || to_date) {
      whereClause.created_at = {};
      if (from_date) whereClause.created_at[Op.gte] = new Date(from_date);
      if (to_date) whereClause.created_at[Op.lte] = new Date(to_date);
    }

    // Search by order number
    if (search) {
      whereClause.order_number = { [Op.like]: `%${search}%` };
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email", "full_name", "avatar_url"],
        },
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
        {
          model: Payment,
          as: "payments",
          attributes: ["payment_id", "payment_method", "amount", "payment_status", "transaction_id", "paid_at"],
        },
        {
          model: Coupon,
          as: "coupon",
          attributes: ["coupon_id", "code", "discount_type", "discount_value"],
        },
      ],
      offset,
      limit: parseInt(limit),
      order: [[order, sort]],
      distinct: true,
    });

    return {
      EM: "Lấy danh sách giao dịch thành công",
      EC: "0",
      DT: {
        orders,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getTransactions:", error.message);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách giao dịch",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== LẤY CHI TIẾT GIAO DỊCH ==================== //
exports.getTransactionDetail = async (order_id) => {
  try {
    const order = await Order.findOne({
      where: { order_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email", "full_name", "avatar_url", "phone"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["course_id", "title", "image", "slug"],
            },
          ],
        },
        {
          model: Payment,
          as: "payments",
        },
        {
          model: Coupon,
          as: "coupon",
        },
      ],
    });

    if (!order) {
      return {
        EM: "Không tìm thấy giao dịch",
        EC: "2",
        DT: null,
      };
    }

    return {
      EM: "Lấy chi tiết giao dịch thành công",
      EC: "0",
      DT: order,
    };
  } catch (error) {
    console.error("Error in getTransactionDetail:", error.message);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy chi tiết giao dịch",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== THỐNG KÊ GIAO DỊCH ==================== //
exports.getTransactionStats = async () => {
  try {
    // Tổng số đơn hàng
    const totalOrders = await Order.count();

    // Đơn hàng theo trạng thái thanh toán
    const pendingPayments = await Order.count({ where: { payment_status: "pending" } });
    const paidPayments = await Order.count({ where: { payment_status: "paid" } });
    const failedPayments = await Order.count({ where: { payment_status: "failed" } });
    const refundedPayments = await Order.count({ where: { payment_status: "refunded" } });

    // Tổng doanh thu (đơn đã thanh toán thành công)
    const totalRevenue = await Order.sum("total_amount", {
      where: { payment_status: "paid" },
    }) || 0;

    // Doanh thu hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Order.sum("total_amount", {
      where: {
        payment_status: "paid",
        paid_at: { [Op.gte]: today },
      },
    }) || 0;

    // Đơn hàng hôm nay
    const todayOrders = await Order.count({
      where: {
        created_at: { [Op.gte]: today },
      },
    });

    // Tổng giảm giá
    const totalDiscount = await Order.sum("discount_amount", {
      where: { payment_status: "paid" },
    }) || 0;

    return {
      EM: "Lấy thống kê giao dịch thành công",
      EC: "0",
      DT: {
        total_orders: totalOrders,
        pending_payments: pendingPayments,
        paid_payments: paidPayments,
        failed_payments: failedPayments,
        refunded_payments: refundedPayments,
        total_revenue: parseFloat(totalRevenue),
        today_revenue: parseFloat(todayRevenue),
        today_orders: todayOrders,
        total_discount: parseFloat(totalDiscount),
      },
    };
  } catch (error) {
    console.error("Error in getTransactionStats:", error.message);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy thống kê",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== THỐNG KÊ DOANH THU THEO THỜI GIAN ==================== //
exports.getRevenueByPeriod = async (query) => {
  try {
    const { period = "month", year = new Date().getFullYear() } = query;

    let dateFormat;
    let groupBy;

    if (period === "day") {
      dateFormat = "%Y-%m-%d";
      groupBy = literal("DATE(paid_at)");
    } else if (period === "week") {
      dateFormat = "%Y-%u";
      groupBy = literal("YEARWEEK(paid_at)");
    } else {
      dateFormat = "%Y-%m";
      groupBy = literal("DATE_FORMAT(paid_at, '%Y-%m')");
    }

    const revenue = await Order.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("paid_at"), dateFormat), "period"],
        [fn("SUM", col("total_amount")), "revenue"],
        [fn("COUNT", col("order_id")), "order_count"],
      ],
      where: {
        payment_status: "paid",
        paid_at: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lt]: new Date(`${parseInt(year) + 1}-01-01`),
        },
      },
      group: [groupBy],
      order: [[literal("period"), "ASC"]],
      raw: true,
    });

    return {
      EM: "Lấy thống kê doanh thu thành công",
      EC: "0",
      DT: revenue,
    };
  } catch (error) {
    console.error("Error in getRevenueByPeriod:", error.message);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy thống kê doanh thu",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== XUẤT BÁO CÁO ==================== //
exports.exportTransactions = async (query) => {
  try {
    const { from_date, to_date, payment_status, format = "json" } = query;

    const whereClause = {};
    if (payment_status) whereClause.payment_status = payment_status;

    if (from_date || to_date) {
      whereClause.created_at = {};
      if (from_date) whereClause.created_at[Op.gte] = new Date(from_date);
      if (to_date) whereClause.created_at[Op.lte] = new Date(to_date);
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email", "full_name"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Course, as: "course", attributes: ["title"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Format data for export
    const exportData = orders.map(order => ({
      order_number: order.order_number,
      user_name: order.user?.full_name || order.user?.username,
      user_email: order.user?.email,
      courses: order.items?.map(i => i.course?.title).join(", "),
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_status: order.order_status,
      created_at: order.created_at,
      paid_at: order.paid_at,
    }));

    return {
      EM: "Xuất báo cáo thành công",
      EC: "0",
      DT: exportData,
    };
  } catch (error) {
    console.error("Error in exportTransactions:", error.message);
    return {
      EM: "Có lỗi xảy ra trong quá trình xuất báo cáo",
      EC: "-2",
      DT: null,
    };
  }
};

