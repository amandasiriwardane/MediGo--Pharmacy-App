const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  assignDriver,
  getAvailableOrders,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { orderValidation } = require('../middleware/validators/orderValidator');

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('customer'), orderValidation, createOrder);

// Common routes (all authenticated users)
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);

// Status updates
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

// Driver routes
router.get('/available/orders', protect, authorize('driver'), getAvailableOrders);
router.put('/:id/assign-driver', protect, assignDriver);

module.exports = router;