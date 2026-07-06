// server/src/ai/chatMemory.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const WINDOW_SIZE = 6; // last 6 messages = 3 turns
const TTL = 60 * 60;  // 1 hour

const getHistory = async (sessionId) => {
  try {
    const history = await redis.get(`chat:${sessionId}`);
    return history || [];
  } catch {
    return [];
  }
};

const saveHistory = async (sessionId, messages) => {
  // Keep only last WINDOW_SIZE messages
  const windowed = messages.slice(-WINDOW_SIZE);
  await redis.set(`chat:${sessionId}`, windowed, { ex: TTL });
};

const clearHistory = async (sessionId) => {
  await redis.del(`chat:${sessionId}`);
};

module.exports = { getHistory, saveHistory, clearHistory };