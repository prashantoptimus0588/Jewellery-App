// server/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  createRazorpayOrder,
  verifyPayment,
  getOrders,
  saveAddress,
  getAddresses,
} = require('../controllers/orderController');

router.use(requireAuth); // all order routes require auth

router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.get('/', getOrders);
router.post('/address', saveAddress);
router.get('/addresses', getAddresses);

module.exports = router;