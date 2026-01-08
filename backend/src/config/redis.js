/**
 * Redis Configuration
 * Dùng để cache đáp án exam session, giúp user không mất đáp án khi mất mạng
 */

const { createClient } = require("redis");

let redisClient = null;
let isConnected = false;

// Tạo Redis client
const createRedisClient = () => {
  const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.log("[REDIS] Max retries reached, giving up");
          return false;
        }
        return Math.min(retries * 500, 2000);
      },
    },
  });

  client.on("error", (err) => {
    // Chỉ log lần đầu để tránh spam
    if (isConnected) {
      console.error("[REDIS] Connection error:", err.message);
      isConnected = false;
    }
  });

  client.on("connect", () => {
    console.log("[REDIS] Connecting...");
  });

  client.on("ready", () => {
    console.log("[REDIS] ✅ Connected and ready");
    isConnected = true;
  });

  client.on("end", () => {
    console.log("[REDIS] Connection closed");
    isConnected = false;
  });

  return client;
};

// Kết nối Redis
const connectRedis = async () => {
  try {
    if (redisClient && isConnected) {
      return true;
    }

    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    console.log(`[REDIS] 🔌 Attempting to connect to: ${redisUrl}`);

    redisClient = createRedisClient();
    await redisClient.connect();
    return true;
  } catch (error) {
    console.log("");
    console.log("=".repeat(60));
    console.log("[REDIS] ❌ Could not connect to Redis!");
    console.log("=".repeat(60));
    console.log("Error:", error.message);
    console.log("");
    console.log("💡 Possible causes:");
    console.log("   1. Redis/Memurai is not installed");
    console.log("   2. Redis service is not running");
    console.log("   3. Port 6379 is blocked by firewall");
    console.log("   4. Redis is running on a different port");
    console.log("");
    console.log("📖 See REDIS_SETUP_WINDOWS.md for installation guide");
    console.log("🧪 Run: node test-redis.js to test connection");
    console.log("=".repeat(60));
    console.log("[REDIS] App will continue without Redis caching");
    console.log("");
    redisClient = null;
    isConnected = false;
    return false;
  }
};

// Đóng kết nối Redis
const closeRedis = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
      isConnected = false;
      console.log("[REDIS] Connection closed");
    }
  } catch (error) {
    console.error("[REDIS] Error closing connection:", error.message);
  }
};

// Lấy Redis client (có thể null nếu không kết nối được)
const getRedisClient = () => {
  if (!redisClient || !isConnected) {
    return null;
  }
  return redisClient;
};

// Check Redis có available không
const isRedisAvailable = () => {
  return redisClient !== null && isConnected;
};

module.exports = {
  connectRedis,
  closeRedis,
  getRedisClient,
  isRedisAvailable,
};
