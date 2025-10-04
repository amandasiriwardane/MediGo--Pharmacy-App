const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  updateStock
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { productValidation } = require('../middleware/validators/productValidator');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Pharmacy routes
router.get('/my/products', protect, authorize('pharmacy'), getMyProducts);
router.post('/', protect, authorize('pharmacy'), productValidation, createProduct);
router.put('/:id', protect, authorize('pharmacy'), updateProduct);
router.delete('/:id', protect, authorize('pharmacy'), deleteProduct);
router.put('/:id/stock', protect, authorize('pharmacy'), updateStock);

module.exports = router;