const moment = require("moment");
const qs = require('qs');
const crypto = require("crypto");
const { Course, CourseEnrollment } = require("../../models"); // cập nhật path models của bạn

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj).sort().forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      sorted[key] = String(obj[key]).trim();
    }
  });
  return sorted;
}

const { VNPay } = require("vnpay");
const dateFormat = require("vnpay");

function formatDateVnpay(date = new Date()) {
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
    
exports.createVnpayPayment = async (req, res) => {
      try {
        const { enrollment_id } = req.body;
        const userId = req.user.userId;
    
        const enrollment = await CourseEnrollment.findOne({
          where: { enrollment_id, user_id: userId },
          include: [{ model: Course, as: "course_detail" }]
        });
    
        if (!enrollment) {
          return res.json({ EC: 1, EM: "Enrollment not found" });
        }
    
        const amount = Number(enrollment.course_detail.price);
    
        const { VNPay } = require("vnpay");
    
        const vnpay = new VNPay({
          tmnCode: process.env.VNP_TMN_CODE,
          secureSecret: process.env.VNP_HASH_SECRET,
          vnpayHost: "https://sandbox.vnpayment.vn",
          testMode: true,
        });
    
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
    
        const paymentUrl = await vnpay.buildPaymentUrl({
          vnp_Amount: amount,
          vnp_IpAddr: req.ip,
          vnp_TxnRef: String(enrollment_id),
          vnp_OrderInfo: `Pay enrollment ${enrollment_id}`,
          vnp_OrderType: "education",
          vnp_ReturnUrl: process.env.VNP_RETURN_URL,
          vnp_CreateDate: formatDateVnpay(),
          vnp_ExpireDate: formatDateVnpay(tomorrow),
          vnp_Locale: "vn",
        });
    
        return res.json({
          EC: 0,
          EM: "Create payment url success",
          DT: {
            payment_url: paymentUrl,
          },
        });
      } catch (error) {
        console.log("VNPAY create error:", error);
        return res.json({ EC: -1, EM: "VNPAY error", DT: error.message });
      }
    };
    
exports.vnpayReturn = async (req, res) => {
      try {
        const vnpay = new VNPay({
          tmnCode: process.env.VNP_TMN_CODE,
          secureSecret: process.env.VNP_HASH_SECRET,
          vnpayHost: "https://sandbox.vnpayment.vn",
        });
    
        const verify = vnpay.verifyReturnUrl(req.query);
    
        if (!verify.isVerified) {
          return res.redirect("http://localhost:3000/payment-failed");
        }
    
        const enrollmentId = req.query.vnp_TxnRef;
    
        await CourseEnrollment.update(
          {
            payment_status: "paid",
            transaction_id: req.query.vnp_TransactionNo,
          },
          { where: { enrollment_id: enrollmentId } }
        );
        const enroll = await CourseEnrollment.findOne({
            where: { enrollment_id: enrollmentId },
            attributes: ["course_id"]
          });
          
          return res.redirect(`http://localhost:5173/lesson/${enroll.course_id}`);

      } catch (err) {
        console.log("Verify error:", err);
        return res.redirect("http://localhost:3000/payment-failed");
      }
};
    