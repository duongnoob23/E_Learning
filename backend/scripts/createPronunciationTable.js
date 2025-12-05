const sequelize = require("../src/config/database");
const fs = require("fs");
const path = require("path");

const createPronunciationTable = async () => {
  try {
    console.log("🔄 Đang tạo bảng pronunciation_assessment...");

    // Đọc SQL file
    const sqlPath = path.join(__dirname, "../migrations/create_pronunciation_assessment_table.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Thực thi SQL
    await sequelize.query(sql);

    console.log("✅ Bảng pronunciation_assessment đã được tạo thành công!");
    console.log("\n📊 Thông tin bảng:");
    console.log("- assessment_id: BIGINT (Primary Key)");
    console.log("- user_id: BIGINT (Foreign Key)");
    console.log("- word_id: BIGINT (Foreign Key)");
    console.log("- user_word_id: BIGINT (Foreign Key)");
    console.log("- score: FLOAT (0-100)");
    console.log("- pronunciation_score: FLOAT");
    console.log("- fluency_score: FLOAT");
    console.log("- feedback: JSON");
    console.log("- audio_url: VARCHAR(255)");
    console.log("- created_at: DATETIME");
    console.log("- updated_at: DATETIME");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi tạo bảng:", error.message);
    process.exit(1);
  }
};

createPronunciationTable();

