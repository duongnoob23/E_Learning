const sequelize = require("./database");

/**
 * Kết nối và đồng bộ database
 * @returns {Promise<boolean>} - true nếu kết nối thành công
 */
// backend/src/config/connectDB.js

const connectDatabase = async () => {
  try {
    console.log("🔄 Đang kết nối đến database...");
    await sequelize.authenticate();
    console.log("✅ Kết nối database thành công!");
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);

    // Chỉ sync khi cho phép rõ ràng qua env
    const shouldSync =
      String(process.env.DB_SYNC || "").toLowerCase() === "true";
    if (shouldSync) {
      console.log("🔄 Đang đồng bộ database (sync)...");
      await sequelize.sync({
        alter: false,
        logging: false,
      });
      console.log("✅ Đồng bộ database thành công!");
    } else {
      console.log("⏭️ Bỏ qua sync; chỉ kiểm tra kết nối.");
    }

    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối database:");
    console.error(`   - Message: ${error.message}`);
    console.error(`   - Code: ${error.original?.code || "N/A"}`);
    console.error(`   - Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.error(`   - Database: ${process.env.DB_NAME}`);
    console.error(`   - User: ${process.env.DB_USER}`);
    return false;
  }
};

/**
 * Đóng kết nối database
 */
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log("✅ Đã đóng kết nối database");
  } catch (error) {
    console.error("❌ Lỗi khi đóng kết nối database:", error.message);
  }
};

/**
 * Kiểm tra trạng thái kết nối database
 */
const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    return {
      status: "healthy",
      message: "Database connection is working",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

module.exports = {
  connectDatabase,
  closeDatabase,
  checkDatabaseHealth,
  sequelize,
};
