// server/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, searchProducts } = require('../controllers/productController');

router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

module.exports = router;