const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        EM: "Token không được cung cấp",
        EC: "1",
        DT: null
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        EM: "Token không hợp lệ",
        EC: "1",
        DT: null
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Thêm thông tin user vào request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        EM: "Token không hợp lệ",
        EC: "1",
        DT: null
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        EM: "Token đã hết hạn",
        EC: "1",
        DT: null
      });
    }
    
    return res.status(500).json({
      EM: "Lỗi xác thực",
      EC: "-2",
      DT: null
    });
  }
};
    
module.exports = authMiddleware;