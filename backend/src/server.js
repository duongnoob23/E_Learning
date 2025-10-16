const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
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

// Security middleware - Tạm tắt để test CORS
// app.use(helmet());

// CORS - Cho phép frontend gọi API (disable all restrictions for testing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Route riêng để serve avatar files
app.get('/uploads/avatars/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/avatars', filename);

  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Disable cache để test
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  console.log(`Serving avatar file: ${filename}`);
  console.log(`File path: ${filePath}`);

  // Send file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).json({ error: 'File not found' });
    } else {
      console.log(`Successfully served: ${filename}`);
    }
  });
});

// Test endpoint
app.get('/test-avatar', (req, res) => {
  res.json({
    message: 'Avatar endpoint test',
    avatar_url: '/uploads/avatars/avatar-1758302390265-316843243.jpg',
    full_url: 'http://localhost:5000/uploads/avatars/avatar-1758302390265-316843243.jpg'
  });
});

// Simple image test route
app.get('/test-image', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'text/html');
  res.send(`
    <html>
      <body>
        <h1>Image Test</h1>
        <img src="/uploads/avatars/avatar-1758302390265-316843243.jpg" alt="Avatar" style="max-width: 200px;">
        <p>If you see the image above, the server is working correctly.</p>
      </body>
    </html>
  `);
});

// Base64 avatar route để bypass CORS issues
app.get('/avatar-base64/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/avatars', filename);

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'application/json');

  try {
    if (fs.existsSync(filePath)) {
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = 'image/jpeg'; // Assume JPEG for now

      res.json({
        success: true,
        data: `data:${mimeType};base64,${base64Image}`,
        filename: filename
      });
    } else {
      res.status(404).json({ success: false, error: 'File not found' });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.use(routes);

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
