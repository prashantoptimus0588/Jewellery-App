// server/src/routes/adminOrderRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');
const { getAdminOrders, getAdminOrderById, updateOrderStatus } = require('../controllers/adminOrderController');

router.use(requireAuth, requireAdmin);

router.get('/', getAdminOrders);
router.get('/:id', getAdminOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;