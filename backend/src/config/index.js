/**
 * Tập hợp tất cả các file config
 */

const database = require('./database');
const { connectDatabase, closeDatabase, checkDatabaseHealth } = require('./connectDB');

module.exports = {
  database,
  connectDatabase,
  closeDatabase,
  checkDatabaseHealth
};
