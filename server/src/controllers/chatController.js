// server/src/controllers/chatController.js
const { chat } = require('../ai/ragChain');
const { clearHistory } = require('../ai/chatMemory');
const { v4: uuidv4 } = require('uuid');

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sid = sessionId || uuidv4();
    const result = await chat(sid, message.trim());

    res.json({
      sessionId: sid,
      response: result.response,
      products: result.products,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed', details: err.message });
  }
};

const clearChat = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await clearHistory(sessionId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear chat' });
  }
};

module.exports = { sendMessage, clearChat };