const authClientService = require("../services/authClientService");

// [POST] client đăng nhập
const validateInput = (email, password) => {
  if (!email) {
    return { isValid: false, message: "Email không được để trống" };
  }
  if (!password) {
    return { isValid: false, message: "Mật khẩu không được để trống" };
  }
  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email không đúng định dạng" };
  }
  // Kiểm tra độ dài mật khẩu
  // if (password.length < 6) {
  //   return { isValid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
  // }
  return { isValid: true };
};

const validateInput2 = (
  username,
  email,
  password,
  fullName,
  phoneNumber,
  avatarUrl
) => {
  // Kiểm tra các trường bắt buộc
  if (!username) {
    return { isValid: false, message: "Tên người dùng không được để trống" };
  }
  if (!email) {
    return { isValid: false, message: "Email không được để trống" };
  }
  if (!password) {
    return { isValid: false, message: "Mật khẩu không được để trống" };
  }

  // Kiểm tra độ dài username (tối đa 50 ký tự theo schema)
  if (username.length > 50) {
    return {
      isValid: false,
      message: "Tên người dùng không được vượt quá 50 ký tự",
    };
  }

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email không đúng định dạng" };
  }
  if (email.length > 100) {
    return { isValid: false, message: "Email không được vượt quá 100 ký tự" };
  }

  // Kiểm tra độ dài và độ mạnh của mật khẩu
  if (password.length < 6) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
  }
  if (password.length > 255) {
    return {
      isValid: false,
      message: "Mật khẩu không được vượt quá 255 ký tự",
    };
  }

  // Kiểm tra các trường tùy chọn
  // if (fullName && fullName.length > 100) {
  //   return { isValid: false, message: "Họ tên không được vượt quá 100 ký tự" };
  // }
  // if (phoneNumber) {
  //   const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Định dạng số điện thoại quốc tế
  //   if (!phoneRegex.test(phoneNumber)) {
  //     return { isValid: false, message: "Số điện thoại không đúng định dạng" };
  //   }
  //   if (phoneNumber.length > 20) {
  //     return {
  //       isValid: false,
  //       message: "Số điện thoại không được vượt quá 20 ký tự",
  //     };
  //   }
  // }
  // if (avatarUrl && avatarUrl.length > 255) {
  //   return {
  //     isValid: false,
  //     message: "URL ảnh đại diện không được vượt quá 255 ký tự",
  //   };
  // }

  return { isValid: true, message: "" };
};

// Controller xử lý login
exports.login = async (req, res) => {
  try {
    // Lấy email và password từ request body
    const { email, password } = req.body;

    // Validation thủ công
    const validation = validateInput(email, password);
    if (!validation.isValid) {
      return res.status(400).json({
        EM: validation.message,
        EC: "1", // Lỗi validation ở controller
        DT: null,
      });
    }

    // Gọi service để xử lý logic đăng nhập
    const data = await authClientService.login(email, password);

    // Trả về response theo format yêu cầu
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    // Xử lý lỗi hệ thống trong controller
    return res.status(500).json({
      EM: error.message || "Lỗi hệ thống trong controller",
      EC: "-1", // Lỗi hệ thống ở controller
      DT: null,
    });
  }
};

// [POST] client đăng ký
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, phoneNumber, avatarUrl } =
      req.body;

    // Validation thủ công
    const validate = validateInput2(
      username,
      email,
      password,
      fullName,
      phoneNumber,
      avatarUrl
    );
    if (!validate.isValid) {
      return res.status(400).json({
        EM: validate.message,
        EC: "1", // Lỗi validation ở controller
        DT: null,
      });
    }

    // Gọi service để xử lý logic đăng ký
    const data = await authClientService.register(
      username,
      email,
      password,
      fullName || null,
      phoneNumber || null,
      avatarUrl || null
    );

    // Thành công
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: error.message || "Lỗi hệ thống trong controller",
      EC: "-1", // Lỗi hệ thống ở controller
      DT: null,
    });
  }
};
