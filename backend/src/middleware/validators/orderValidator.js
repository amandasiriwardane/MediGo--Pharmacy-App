const { body } = require('express-validator');

exports.orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('items.*.productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('deliveryAddress.fullAddress')
    .trim()
    .notEmpty()
    .withMessage('Delivery address is required'),
  
  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('deliveryAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('deliveryAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  
  body('deliveryAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone is required'),
  
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['cod', 'card', 'upi', 'wallet'])
    .withMessage('Invalid payment method')
];