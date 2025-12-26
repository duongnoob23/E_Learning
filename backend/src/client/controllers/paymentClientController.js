const paymentClientService = require("../services/paymentClientService");

// [POST] Tạo đơn hàng và payment url
exports.createOrder = async (req, res) => {
  try {
    const user_id = req.user?.userId;
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";

    if (!user_id) {
      return res.status(401).json({
        code: "error",
        message: "Vui lòng đăng nhập để thanh toán",
      });
    }

    const result = await paymentClientService.createOrder(
      { ...req.body, user_id },
      ipAddr,
      userAgent
    );

    return res.json({
      code: "success",
      message: "Tạo đơn hàng thành công",
      data: result,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(400).json({
      code: "error",
      message: error.message || "Không thể tạo đơn hàng",
    });
  }
};

// [POST] Tạo payment url (legacy - giữ lại để tương thích)
exports.createPaymentUrl = async (req, res) => {
  try {
    const ipAddr =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const paymentUrl = await paymentClientService.createPaymentUrl(
      req.body,
      ipAddr
    );

    return res.json({
      code: "success",
      paymentUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: "error",
      message: "Internal Server Error",
    });
  }
};

// [GET] vnpayIpn - Server-to-server callback từ VNPay
exports.vnpayIpn = async (req, res) => {
  console.log(" da chay ham ipn");
  try {
    const vnpParams = req.query;

    // Gọi service để verify checksum
    const { isValid, data } = paymentClientService.verifyIpn(vnpParams);

    if (!isValid) {
      console.log("❌ Invalid Checksum!");
      return res.status(200).json({
        RspCode: "97",
        Message: "Invalid Checksum",
      });
    }

    const orderId = data["vnp_TxnRef"];
    const rspCode = data["vnp_ResponseCode"];

    return res.status(200).json({
      RspCode: "00",
      Message: "Success",
    });
  } catch (err) {
    console.error("IPN Error:", err);
    return res.status(500).json({
      RspCode: "99",
      Message: "Server Error",
    });
  }
};

// [GET] vnpayReturn - User redirect back từ VNPay (browser redirect)
exports.vnpayReturn = async (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

  try {
    const vnpParams = { ...req.query };
    // Verify checksum
    const { isValid, data } = paymentClientService.verifyIpn(vnpParams);

    if (!isValid) {
      console.log("❌ Invalid Checksum on Return!");
      return res.redirect(
        `${FRONTEND_URL}/payment/failed?message=Invalid+Checksum`
      );
    }

    const orderNumber = data["vnp_TxnRef"];
    const rspCode = data["vnp_ResponseCode"];

    // Xử lý thanh toán (update DB)
    const result = await paymentClientService.processPaymentSuccess(data);

    if (result.success) {
      // Thanh toán thành công → Redirect về My Course
      const FRONTEND_BASE = process.env.FRONTEND_URL || "http://localhost:5173";
      const successUrl = new URL(`${FRONTEND_BASE}/mycourses`);
      successUrl.searchParams.append("orderNumber", result.order_number);
      successUrl.searchParams.append("amount", result.amount);
      successUrl.searchParams.append(
        "transactionId",
        result.transaction_id || ""
      );
      successUrl.searchParams.append("payment", "success");

      return res.redirect(successUrl.toString());
    } else {
      // Thanh toán thất bại
      const FRONTEND_BASE = process.env.FRONTEND_URL || "http://localhost:5173";
      const failUrl = new URL(`${FRONTEND_BASE}/payment/failed`);
      failUrl.searchParams.append("orderNumber", result.order_number);
      failUrl.searchParams.append("code", result.response_code);
      failUrl.searchParams.append("message", result.message);

      return res.redirect(failUrl.toString());
    }
  } catch (err) {
    console.error("Return Error:", err);
    const FRONTEND_BASE = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(
      `${FRONTEND_BASE}/payment/failed?message=${encodeURIComponent(err.message || "Server Error")}`
    );
  }
};

// [GET] Lấy thông tin đơn hàng theo order_number
exports.getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await paymentClientService.getOrderByNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        code: "error",
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json({
      code: "success",
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({
      code: "error",
      message: "Lỗi server",
    });
  }
};

// [GET] Lấy lịch sử đơn hàng của user
exports.getMyOrders = async (req, res) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({
        code: "error",
        message: "Vui lòng đăng nhập",
      });
    }

    const orders = await paymentClientService.getOrdersByUserId(user_id);

    return res.json({
      code: "success",
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({
      code: "error",
      message: "Lỗi server",
    });
  }
};
