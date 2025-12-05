const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"]; // Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error(`[AUTH] 401 - Missing token | ${req.method} ${req.originalUrl}`);
      return res.status(401).json({
        EM: "Unauthorized",
        EC: "401",
        DT: null
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error(`[AUTH] 401 - Empty token | ${req.method} ${req.originalUrl}`);
      return res.status(401).json({
        EM: "Unauthorized",
        EC: "401",
        DT: null
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    console.error(`[AUTH] 401 - Invalid/expired token | ${req.method} ${req.originalUrl} | Error: ${error.message}`);
    return res.status(401).json({
      EM: "Invalid or expired token",
      EC: "401",
      DT: null
    });
  }
};

module.exports = authMiddleware;