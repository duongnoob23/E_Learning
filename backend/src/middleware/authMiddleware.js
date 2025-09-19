const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"]; // Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ EM: "Unauthorized", EC: "401", DT: null });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ EM: "Unauthorized", EC: "401", DT: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ EM: "Invalid or expired token", EC: "401", DT: null });
  }
};

module.exports = authMiddleware;