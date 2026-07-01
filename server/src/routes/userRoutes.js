// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { getWishlist, addToWishlist, removeFromWishlist, updateProfile } = require('../controllers/userController');

router.use(requireAuth);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.put('/profile', updateProfile);

module.exports = router;