const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");

// Đăng nhập
exports.login = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error("Email không đúng");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }

  const token = jwt.sign(
    { userId: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const { password_hash, ...userWithoutPass } = user.toJSON();

  return { token, code: "success", message: "Đăng nhập thành công", user: userWithoutPass };
};

// Đăng ký
exports.register = async (username, email, password, fullName, phoneNumber, avatarUrl) => {
  const existingEmail = await User.findByEmail(email);
  if (existingEmail) {
    throw new Error("Email đã tồn tại");
  }

  const existingUsername = await User.findByUsername(username);
  if (existingUsername) {
    throw new Error("Username đã tồn tại");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.createUser({
    username,
    email,
    password_hash: passwordHash,
    full_name: fullName || null,
    phone_number: phoneNumber || null,
    avatar_url: avatarUrl || null,
    status: "active"
  });

  return { code: "success", message: "Đăng ký thành công" };
};