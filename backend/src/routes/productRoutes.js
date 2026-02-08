const express = require('express');
const upload = require('../middleware/upload');
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
router.post('/', protect, authorize('pharmacy'), upload.single('image'), productValidation, createProduct);
router.put('/:id', protect, authorize('pharmacy'), upload.single('image'), productValidation, updateProduct);
router.delete('/:id', protect, authorize('pharmacy'), deleteProduct);
router.put('/:id/stock', protect, authorize('pharmacy'), updateStock);

module.exports = router;