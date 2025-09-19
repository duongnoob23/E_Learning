// auth.validator.js
const { body } = require("express-validator");

const loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu tối thiểu 6 ký tự"),
];

const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username không được để trống")
    .isLength({ min: 3 })
    .withMessage("Username phải có ít nhất 3 ký tự"),

  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự"),

  body("fullName")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Tên đầy đủ tối thiểu 2 ký tự"),

  body("phoneNumber")
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Số điện thoại phải có 10-11 số"),

  body("avatarUrl")
    .optional()
    .isURL()
    .withMessage("avatarUrl phải là đường dẫn hợp lệ"),
];

module.exports = {
  loginValidator,
  registerValidator,
};
