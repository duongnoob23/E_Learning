const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Xác thực đăng ký E-Learning",
    text: `Mã OTP xác thực của bạn là: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };