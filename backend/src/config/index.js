/**
 * Tập hợp tất cả các file config
 */

const database = require('./database');
const { connectDatabase, closeDatabase, checkDatabaseHealth } = require('./connectDB');
const { connectRedis, closeRedis, getRedisClient, isRedisAvailable } = require('./redis');

module.exports = {
  database,
  connectDatabase,
  closeDatabase,
  checkDatabaseHealth,
  // Redis exports
  connectRedis,
  closeRedis,
  getRedisClient,
  isRedisAvailable
};
