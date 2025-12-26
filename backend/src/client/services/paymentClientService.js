const crypto = require("crypto");
const querystring = require("qs");
const config = require("../../config/paymentConfig.json");
const { Order, OrderItem, Payment, CourseEnrollment, Course, Instructor, Coupon, sequelize } = require("../../models");

// --- Helper: Sort object theo key ---
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// --- Helper: Format date YYYYMMDDHHMMSS ---
function formatDate(date) {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
}

// =============================================
// TẠO ĐƠN HÀNG + PAYMENT URL
// =============================================
exports.createOrder = async (data, ipAddr, userAgent) => {
    const { user_id, courses, coupon_code } = data;
    const transaction = await sequelize.transaction();

    try {
        // 1. Validate courses
        if (!courses || courses.length === 0) {
            throw new Error("Không có khóa học nào được chọn");
        }

        // 2. Lấy thông tin các khóa học
        const courseIds = courses.map(c => c.course_id);
        const courseList = await Course.findAll({
            where: { course_id: courseIds },
            include: [{ model: Instructor, as: "instructor" }],
            transaction
        });

        if (courseList.length !== courseIds.length) {
            throw new Error("Một số khóa học không tồn tại");
        }

        // 3. Kiểm tra user đã mua khóa học chưa
        const existingEnrollments = await CourseEnrollment.findAll({
            where: {
                user_id,
                course_id: courseIds,
                payment_status: "paid"
            },
            transaction
        });

        if (existingEnrollments.length > 0) {
            const boughtCourseIds = existingEnrollments.map(e => e.course_id);
            throw new Error(`Bạn đã mua các khóa học: ${boughtCourseIds.join(", ")}`);
        }

        // 4. Tính tổng tiền
        let subtotal = 0;
        const orderItemsData = courseList.map(course => {
            const originalPrice = parseFloat(course.old_price || course.price) || 0;
            const salePrice = parseFloat(course.price) || 0;
            subtotal += salePrice;

            return {
                course_id: course.course_id,
                course_title: course.title,
                course_image: course.image,
                course_slug: course.slug,
                instructor_name: course.instructor?.full_name || "Unknown",
                original_price: originalPrice,
                sale_price: salePrice,
                final_price: salePrice, // Sẽ cập nhật sau nếu có coupon
            };
        });

        // 5. Áp dụng coupon (nếu có)
        let discountAmount = 0;
        let couponId = null;
        let appliedCoupon = null;

        if (coupon_code) {
            appliedCoupon = await Coupon.findOne({
                where: { code: coupon_code, is_active: true },
                transaction
            });

            if (appliedCoupon) {
                const now = new Date();
                if (now >= appliedCoupon.valid_from && now <= appliedCoupon.valid_until) {
                    if (appliedCoupon.discount_type === "percentage") {
                        discountAmount = subtotal * (appliedCoupon.discount_value / 100);
                    } else {
                        discountAmount = parseFloat(appliedCoupon.discount_value);
                    }
                    couponId = appliedCoupon.coupon_id;
                }
            }
        }

        const totalAmount = Math.max(0, subtotal - discountAmount);

        // 6. Tạo Order
        const orderNumber = Order.generateOrderNumber();
        const order = await Order.create({
            order_number: orderNumber,
            user_id,
            subtotal,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            coupon_id: couponId,
            coupon_code: coupon_code || null,
            order_status: "pending",
            payment_status: "pending",
            payment_method: "vnpay",
            ip_address: ipAddr,
            user_agent: userAgent,
            created_at: new Date(),
            updated_at: new Date(),
        }, { transaction });

        // 7. Tạo Order Items
        const itemsWithOrderId = orderItemsData.map(item => ({
            ...item,
            order_id: order.order_id,
            created_at: new Date(),
        }));

        await OrderItem.bulkCreate(itemsWithOrderId, { transaction });

        // 8. Tạo Payment record (pending)
        await Payment.create({
            order_id: order.order_id,
            user_id,
            payment_method: "vnpay",
            amount: totalAmount,
            currency: "VND",
            payment_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        }, { transaction });

        await transaction.commit();

        // 9. Tạo VNPay URL
        const paymentUrl = await this.generateVnpayUrl({
            order_number: orderNumber,
            amount: totalAmount,
            orderDescription: `Thanh toan don hang ${orderNumber}`,
            ipAddr,
        });

        return {
            order_id: order.order_id,
            order_number: orderNumber,
            subtotal,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            payment_url: paymentUrl,
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// =============================================
// TẠO VNPAY URL
// =============================================
exports.generateVnpayUrl = async ({ order_number, amount, orderDescription, ipAddr, bankCode, language }) => {
    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;

    const now = new Date();
    const createDate = formatDate(now);
    const locale = language || "vn";

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = order_number;
    vnp_Params["vnp_OrderInfo"] = orderDescription || `Thanh toan ${order_number}`;
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Amount"] = Math.round(amount * 100);
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr || "127.0.0.1";
    vnp_Params["vnp_CreateDate"] = createDate;

    if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};

// Legacy function - giữ lại để tương thích
exports.createPaymentUrl = async (data, ipAddr) => {
    const { amount, bankCode, orderDescription, orderType, language } = data;

    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;

    const now = new Date();
    const createDate = formatDate(now);
    const orderId = formatDate(now) + Math.floor(Math.random() * 1000);
    const locale = language || "vn";

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderDescription;
    vnp_Params["vnp_OrderType"] = orderType || "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};


// =============================================
// VERIFY IPN/RETURN từ VNPay
// =============================================
exports.verifyIpn = (vnpParams) => {

    // Clone để không modify original
    const params = { ...vnpParams };

    const secureHash = params["vnp_SecureHash"];

    // Xóa các field không tham gia tạo hash
    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    // Sort params theo key và encode giá trị (giống như khi tạo URL)
    const sortedParams = sortObject(params);

    // Tạo signData từ sorted params
    const signData = querystring.stringify(sortedParams, { encode: false });
    const secretKey = config.vnp_HashSecret;

    // Tạo hash để so sánh
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    return {
        isValid: signed === secureHash,
        data: params  // Trả về params gốc (chưa encode)
    };
};

// =============================================
// XỬ LÝ THANH TOÁN THÀNH CÔNG
// =============================================
exports.processPaymentSuccess = async (vnpData) => {
    const transaction = await sequelize.transaction();

    try {
        const orderNumber = vnpData["vnp_TxnRef"];
        const responseCode = vnpData["vnp_ResponseCode"];
        const transactionId = vnpData["vnp_TransactionNo"];
        const bankCode = vnpData["vnp_BankCode"];
        const bankTransNo = vnpData["vnp_BankTranNo"];
        const cardType = vnpData["vnp_CardType"];
        const amount = parseInt(vnpData["vnp_Amount"]) / 100;
        const payDate = vnpData["vnp_PayDate"];

        // 1. Tìm order
        const order = await Order.findOne({
            where: { order_number: orderNumber },
            include: [{ model: OrderItem, as: "items" }],
            transaction
        });

        if (!order) {
            throw new Error(`Không tìm thấy đơn hàng: ${orderNumber}`);
        }

        // 2. Kiểm tra đã xử lý chưa (tránh duplicate)
        if (order.payment_status === "paid") {
            return {
                success: true,
                message: "Đơn hàng đã được xử lý",
                order
            };
        }

        // 3. Kiểm tra amount khớp
        if (Math.abs(amount - parseFloat(order.total_amount)) > 1) {
            throw new Error(`Số tiền không khớp: VNPay=${amount}, Order=${order.total_amount}`);
        }

        // 4. Xử lý theo response code
        if (responseCode === "00") {
            // THANH TOÁN THÀNH CÔNG
            const now = new Date();

            // 4.1 Update Order
            await Order.update({
                order_status: "confirmed",
                payment_status: "paid",
                paid_at: now,
                updated_at: now,
            }, {
                where: { order_id: order.order_id },
                transaction
            });

            // 4.2 Update Payment
            await Payment.update({
                payment_status: "completed",
                transaction_id: transactionId,
                transaction_ref: orderNumber,
                bank_code: bankCode,
                bank_trans_no: bankTransNo,
                card_type: cardType,
                response_code: responseCode,
                response_message: "Giao dịch thành công",
                payment_data: vnpData,
                paid_at: now,
                updated_at: now,
            }, {
                where: { order_id: order.order_id },
                transaction
            });

            // 4.3 Tạo CourseEnrollment cho mỗi khóa học
            const enrollments = order.items.map(item => ({
                user_id: order.user_id,
                course_id: item.course_id,
                status: "active",
                enrolled_at: now,
                payment_amount: item.final_price,
                payment_method: "vnpay",
                payment_status: "paid",
                transaction_id: transactionId,
                created_at: now,
                updated_at: now,
            }));

            await CourseEnrollment.bulkCreate(enrollments, {
                transaction,
                ignoreDuplicates: true // Bỏ qua nếu đã tồn tại
            });

            // 4.4 Cập nhật used_count của coupon (nếu có)
            if (order.coupon_id) {
                await Coupon.increment("used_count", {
                    where: { coupon_id: order.coupon_id },
                    transaction
                });
            }

            // 4.5 Cập nhật total_students cho các khóa học
            for (const item of order.items) {
                await Course.increment("total_students", {
                    where: { course_id: item.course_id },
                    transaction
                });
            }

            await transaction.commit();
            return {
                success: true,
                message: "Thanh toán thành công",
                order_id: order.order_id,
                order_number: orderNumber,
                amount: amount,
                transaction_id: transactionId,
            };

        } else {
            // THANH TOÁN THẤT BẠI
            await Order.update({
                payment_status: "failed",
                updated_at: new Date(),
            }, {
                where: { order_id: order.order_id },
                transaction
            });

            await Payment.update({
                payment_status: "failed",
                response_code: responseCode,
                response_message: getVnpayResponseMessage(responseCode),
                payment_data: vnpData,
                updated_at: new Date(),
            }, {
                where: { order_id: order.order_id },
                transaction
            });

            await transaction.commit();

            return {
                success: false,
                message: getVnpayResponseMessage(responseCode),
                order_number: orderNumber,
                response_code: responseCode,
            };
        }

    } catch (error) {
        await transaction.rollback();
        console.error("Process payment error:", error);
        throw error;
    }
};

// =============================================
// LẤY THÔNG TIN ĐƠN HÀNG
// =============================================
exports.getOrderByNumber = async (orderNumber) => {
    return await Order.findOne({
        where: { order_number: orderNumber },
        include: [
            { model: OrderItem, as: "items" },
            { model: Payment, as: "payments" }
        ]
    });
};

exports.getOrdersByUserId = async (userId) => {
    return await Order.findAll({
        where: { user_id: userId },
        include: [
            { model: OrderItem, as: "items" },
            { model: Payment, as: "payments" }
        ],
        order: [["created_at", "DESC"]]
    });
};

// =============================================
// HELPER: VNPay Response Messages
// =============================================
function getVnpayResponseMessage(code) {
    const messages = {
        "00": "Giao dịch thành công",
        "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
        "09": "Giao dịch không thành công: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking",
        "10": "Giao dịch không thành công: Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
        "11": "Giao dịch không thành công: Đã hết hạn chờ thanh toán",
        "12": "Giao dịch không thành công: Thẻ/Tài khoản bị khóa",
        "13": "Giao dịch không thành công: Nhập sai mật khẩu xác thực (OTP)",
        "24": "Giao dịch không thành công: Khách hàng hủy giao dịch",
        "51": "Giao dịch không thành công: Tài khoản không đủ số dư",
        "65": "Giao dịch không thành công: Tài khoản đã vượt quá hạn mức giao dịch trong ngày",
        "75": "Ngân hàng thanh toán đang bảo trì",
        "79": "Giao dịch không thành công: Nhập sai mật khẩu thanh toán quá số lần quy định",
        "99": "Lỗi không xác định",
    };
    return messages[code] || `Lỗi không xác định (${code})`;
}