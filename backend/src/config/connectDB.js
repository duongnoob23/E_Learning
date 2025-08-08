const sequelize = require('./database');

/**
 * Kết nối và đồng bộ database
 * @returns {Promise<boolean>} - true nếu kết nối thành công
 */
const connectDatabase = async () => {
  try {
    console.log('🔄 Đang kết nối đến database...');
    
    // Test kết nối database
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    
    // Đồng bộ database (tạo bảng nếu chưa có)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Đang đồng bộ database...');
      await sequelize.sync({ 
        alter: true,  // Cập nhật cấu trúc bảng nếu có thay đổi
        logging: false // Tắt log SQL khi sync
      });
      console.log('✅ Đồng bộ database thành công!');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Lỗi kết nối database:');
    console.error(`   - Message: ${error.message}`);
    console.error(`   - Code: ${error.original?.code || 'N/A'}`);
    console.error(`   - Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.error(`   - Database: ${process.env.DB_NAME}`);
    console.error(`   - User: ${process.env.DB_USER}`);
    
    // Kiểm tra các lỗi phổ biến
    if (error.original?.code === 'ECONNREFUSED') {
      console.error('💡 Gợi ý: Kiểm tra MySQL server có đang chạy không?');
    } else if (error.original?.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Gợi ý: Kiểm tra username/password trong file .env');
    } else if (error.original?.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Gợi ý: Database không tồn tại, tạo database trong MySQL Workbench');
    }
    
    return false;
  }
};

/**
 * Đóng kết nối database
 */
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Đã đóng kết nối database');
  } catch (error) {
    console.error('❌ Lỗi khi đóng kết nối database:', error.message);
  }
};

/**
 * Kiểm tra trạng thái kết nối database
 */
const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    return {
      status: 'healthy',
      message: 'Database connection is working',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  connectDatabase,
  closeDatabase,
  checkDatabaseHealth,
  sequelize
};
