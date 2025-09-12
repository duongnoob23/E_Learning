const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
require("dotenv").config();

// Import database connection
const {
  connectDatabase,
  closeDatabase,
  checkDatabaseHealth,
  database: sequelize,
} = require("./config");

const app = express();

// Security middleware
app.use(helmet());

// CORS - Cho phép frontend gọi API
app.use(cors());

app.use(express.json());
// app.use(routes);

//Logging middleware (chỉ trong development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 404 handler - Bắt lỗi route không tồn tại (không dùng "*")
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler - Bắt các lỗi khác
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

// Hàm khởi động server
const startServer = async () => {
  try {
    // Kết nối database trước khi start server
    console.log("=".repeat(50));
    console.log("🚀 KHỞI ĐỘNG SERVER E-COMMERCE");
    console.log("=".repeat(50));

    const dbConnected = await connectDatabase();

    if (!dbConnected) {
      console.error(
        "❌ Không thể kết nối database. Server sẽ không khởi động."
      );
      process.exit(1);
    }

    // Start server sau khi database đã kết nối thành công
    app.listen(PORT, () => {
      console.log("=".repeat(50));
      console.log(`✅ Server đã khởi động thành công!`);
      console.log(`🚀 Port: ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API Test: http://localhost:${PORT}`);
      console.log("=".repeat(50));
    });
  } catch (error) {
    console.error("❌ Lỗi khởi động server:", error.message);
    process.exit(1);
  }
};

// Xử lý graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Đang tắt server...");
  await closeDatabase();
  console.log("✅ Server đã tắt an toàn");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🔄 Đang tắt server...");
  await closeDatabase();
  console.log("✅ Server đã tắt an toàn");
  process.exit(0);
});

// Khởi động server
startServer();
