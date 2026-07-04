// server/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, deleteProductImage,
  getAllOrders, updateOrderStatus,
  getDashboardStats,
} = require('../controllers/adminController');

router.use(requireAuth, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/products', getAllProducts);
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/products/images/:imageId', deleteProductImage);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;