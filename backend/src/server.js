const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
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

//Logging middleware (chỉ trong development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Basic middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API is working!",
    timestamp: new Date().toISOString(),
  });
});
// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Database health check
app.get("/health/db", async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    res.json({
      status: "OK",
      database: dbHealth,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ===============================================
// 🧪 TEMPORARY TEST APIs - XÓA SAU KHI HOÀN THÀNH
// ===============================================

// Test API: Lấy danh sách tất cả sản phẩm
app.get("/api/test/products", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT
        p.id,
        p.name,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.brand,
        p.is_featured,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    res.json({
      status: "success",
      message: "Lấy danh sách sản phẩm thành công",
      data: results,
      total: results.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách sản phẩm:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi lấy danh sách sản phẩm",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Test API: Lấy danh sách categories
app.get("/api/test/categories", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT
        c.id,
        c.name,
        c.description,
        c.parent_id,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      WHERE c.is_active = 1
      GROUP BY c.id, c.name, c.description, c.parent_id
      ORDER BY c.sort_order ASC
    `);

    res.json({
      status: "success",
      message: "Lấy danh sách danh mục thành công",
      data: results,
      total: results.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách danh mục:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi lấy danh sách danh mục",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Test API: Lấy chi tiết sản phẩm theo ID
app.get("/api/test/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const [results] = await sequelize.query(
      `
      SELECT
        p.*,
        c.name as category_name,
        c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = :productId AND p.is_active = 1
    `,
      {
        replacements: { productId },
      }
    );

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy sản phẩm",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      status: "success",
      message: "Lấy chi tiết sản phẩm thành công",
      data: results[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết sản phẩm:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi lấy chi tiết sản phẩm",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Test API: Tìm kiếm sản phẩm theo tên
app.get("/api/test/products/search/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const [results] = await sequelize.query(
      `
      SELECT
        p.id,
        p.name,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.brand,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
        AND (p.name LIKE :keyword OR p.brand LIKE :keyword)
      ORDER BY p.name ASC
      LIMIT 20
    `,
      {
        replacements: { keyword: `%${keyword}%` },
      }
    );

    res.json({
      status: "success",
      message: `Tìm kiếm sản phẩm với từ khóa "${keyword}"`,
      data: results,
      total: results.length,
      keyword: keyword,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm sản phẩm:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi tìm kiếm sản phẩm",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Test API: Thống kê tổng quan
app.get("/api/test/stats", async (req, res) => {
  try {
    const [stats] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE is_active = 1) as total_users,
        (SELECT COUNT(*) FROM products WHERE is_active = 1) as total_products,
        (SELECT COUNT(*) FROM categories WHERE is_active = 1) as total_categories,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT SUM(final_amount) FROM orders WHERE payment_status = 'paid') as total_revenue
    `);

    res.json({
      status: "success",
      message: "Lấy thống kê tổng quan thành công",
      data: stats[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thống kê:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi lấy thống kê",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ===============================================
// 🔚 END TEMPORARY TEST APIs
// ===============================================

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
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔗 Database Health: http://localhost:${PORT}/health/db`);
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
