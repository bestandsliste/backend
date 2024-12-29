const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/products?search=...&availability=...
router.get('/', getProducts);

// Weitere Routen...

module.exports = router;
