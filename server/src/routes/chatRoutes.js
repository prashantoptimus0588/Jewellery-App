// server/src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage, clearChat } = require('../controllers/chatController');

router.post('/message', sendMessage);
router.delete('/session/:sessionId', clearChat);

module.exports = router;