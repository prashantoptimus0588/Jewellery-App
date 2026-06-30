const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, googleAuth, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleAuth);
router.get('/me', requireAuth, getMe);

module.exports = router;