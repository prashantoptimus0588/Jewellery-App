// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { sendOtp, verifyOtp, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', requireAuth, getMe);

// Google OAuth
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login-failed` }),
  (req, res) => {
    const { token, user } = req.user;
    // Redirect to frontend with token + user in query params
    const params = new URLSearchParams({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
    });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?${params.toString()}`);
  }
);

module.exports = router;