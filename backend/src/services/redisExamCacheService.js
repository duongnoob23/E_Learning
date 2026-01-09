/**
 * Redis Exam Cache Service
 * Service quản lý cache đáp án exam trong Redis
 * Giúp user không mất đáp án khi mất mạng/điện
 */

const { getRedisClient, isRedisAvailable } = require('../config/redis');

// TTL mặc định: 24 giờ
const DEFAULT_TTL = 24 * 60 * 60; // seconds

// Key prefixes
const KEYS = {
  ANSWERS: 'exam:session:{id}:answers',
  SESSION_INFO: 'exam:session:{id}:info'
};

/**
 * Lưu tất cả đáp án của một session
 * @param {number} sessionId - ID của exam session
 * @param {Array} answers - Mảng đáp án [{question_id, selected_choice_id}]
 * @param {number} ttl - Time to live in seconds (default: 24h)
 */
const saveAnswers = async (sessionId, answers, ttl = DEFAULT_TTL) => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = KEYS.ANSWERS.replace('{id}', sessionId);
    await client.setEx(key, ttl, JSON.stringify(answers));
    
    console.log(`[REDIS_CACHE] Saved ${answers.length} answers for session ${sessionId}`);
    return true;
  } catch (error) {
    console.error('[REDIS_CACHE] Error saving answers:', error.message);
    return false;
  }
};

/**
 * Lưu một đáp án đơn lẻ (auto-save)
 * @param {number} sessionId - ID của exam session
 * @param {number} questionId - ID của question
 * @param {number} selectedChoiceId - ID của choice được chọn
 */
const saveSingleAnswer = async (sessionId, questionId, selectedChoiceId) => {
  try {
    const client = getRedisClient();
    if (!client) {
      console.log(`[REDIS_CACHE] ❌ Redis not available for session ${sessionId}`);
      return false;
    }

    const key = KEYS.ANSWERS.replace('{id}', sessionId);
    
    // Lấy answers hiện tại
    let answers = [];
    const existingData = await client.get(key);
    if (existingData) {
      answers = JSON.parse(existingData);
      console.log(`[REDIS_CACHE] 📥 Found ${answers.length} existing answers for session ${sessionId}`);
    } else {
      console.log(`[REDIS_CACHE] 📝 No existing answers, creating new array for session ${sessionId}`);
    }

    // Update hoặc thêm answer mới
    const existingIndex = answers.findIndex(a => a.question_id === questionId);
    const answerData = {
      question_id: questionId,
      selected_choice_id: selectedChoiceId,
      updated_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      answers[existingIndex] = answerData;
      console.log(`[REDIS_CACHE] 🔄 Updated existing answer for Q${questionId}`);
    } else {
      answers.push(answerData);
      console.log(`[REDIS_CACHE] ➕ Added new answer for Q${questionId}`);
    }

    // Lưu lại với TTL mới
    await client.setEx(key, DEFAULT_TTL, JSON.stringify(answers));
    
    // Verify: Lấy lại để confirm
    const verifyData = await client.get(key);
    const verifyAnswers = verifyData ? JSON.parse(verifyData) : [];
    
    console.log(`[REDIS_CACHE] ✅ Auto-saved Q${questionId} = ${selectedChoiceId} for session ${sessionId}`);
    console.log(`[REDIS_CACHE] 📊 Total answers in Redis: ${verifyAnswers.length}`, verifyAnswers);
    return true;
  } catch (error) {
    console.error('[REDIS_CACHE] ❌ Error saving single answer:', error.message);
    console.error('[REDIS_CACHE] Stack:', error.stack);
    return false;
  }
};

/**
 * Lấy tất cả đáp án của một session
 * @param {number} sessionId - ID của exam session
 * @returns {Array|null} - Mảng đáp án hoặc null nếu không có
 */
const getAnswers = async (sessionId) => {
  try {
    const client = getRedisClient();
    if (!client) {
      console.log(`[REDIS_CACHE] ❌ Redis not available for session ${sessionId}`);
      return null;
    }

    const key = KEYS.ANSWERS.replace('{id}', sessionId);
    console.log(`[REDIS_CACHE] 🔍 Getting answers from key: ${key}`);
    const data = await client.get(key);
    
    if (data) {
      const answers = JSON.parse(data);
      console.log(`[REDIS_CACHE] ✅ Retrieved ${answers.length} answers for session ${sessionId}:`, answers);
      return answers;
    }
    
    console.log(`[REDIS_CACHE] ℹ️ No data found in Redis for session ${sessionId}`);
    return null;
  } catch (error) {
    console.error('[REDIS_CACHE] ❌ Error getting answers:', error.message);
    console.error('[REDIS_CACHE] Stack:', error.stack);
    return null;
  }
};

/**
 * Xóa đáp án của một session (khi submit hoặc hủy)
 * @param {number} sessionId - ID của exam session
 */
const deleteAnswers = async (sessionId) => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = KEYS.ANSWERS.replace('{id}', sessionId);
    await client.del(key);
    
    console.log(`[REDIS_CACHE] Deleted answers for session ${sessionId}`);
    return true;
  } catch (error) {
    console.error('[REDIS_CACHE] Error deleting answers:', error.message);
    return false;
  }
};

/**
 * Lưu thông tin session
 * @param {number} sessionId - ID của exam session
 * @param {Object} sessionInfo - Thông tin session
 */
const saveSessionInfo = async (sessionId, sessionInfo, ttl = DEFAULT_TTL) => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = KEYS.SESSION_INFO.replace('{id}', sessionId);
    await client.setEx(key, ttl, JSON.stringify(sessionInfo));
    
    console.log(`[REDIS_CACHE] Saved session info for ${sessionId}`);
    return true;
  } catch (error) {
    console.error('[REDIS_CACHE] Error saving session info:', error.message);
    return false;
  }
};

/**
 * Lấy thông tin session
 * @param {number} sessionId - ID của exam session
 */
const getSessionInfo = async (sessionId) => {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const key = KEYS.SESSION_INFO.replace('{id}', sessionId);
    const data = await client.get(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    return null;
  } catch (error) {
    console.error('[REDIS_CACHE] Error getting session info:', error.message);
    return null;
  }
};

/**
 * Xóa thông tin session
 * @param {number} sessionId - ID của exam session
 */
const deleteSessionInfo = async (sessionId) => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = KEYS.SESSION_INFO.replace('{id}', sessionId);
    await client.del(key);
    
    console.log(`[REDIS_CACHE] Deleted session info for ${sessionId}`);
    return true;
  } catch (error) {
    console.error('[REDIS_CACHE] Error deleting session info:', error.message);
    return false;
  }
};

/**
 * Xóa tất cả cache của một session (answers + info)
 * @param {number} sessionId - ID của exam session
 */
const clearSessionCache = async (sessionId) => {
  try {
    await deleteAnswers(sessionId);
    await deleteSessionInfo(sessionId);
    console.log(`[REDIS_CACHE] Cleared all cache for session ${sessionId}`);
    return true;
  } catch (error) {
    console.error('[REDIS_CACHE] Error clearing session cache:', error.message);
    return false;
  }
};

/**
 * Đếm số đáp án đã lưu
 * @param {number} sessionId - ID của exam session
 */
const countAnswers = async (sessionId) => {
  try {
    const answers = await getAnswers(sessionId);
    return answers ? answers.length : 0;
  } catch (error) {
    return 0;
  }
};

module.exports = {
  saveAnswers,
  saveSingleAnswer,
  getAnswers,
  deleteAnswers,
  saveSessionInfo,
  getSessionInfo,
  deleteSessionInfo,
  clearSessionCache,
  countAnswers,
  isRedisAvailable
};

