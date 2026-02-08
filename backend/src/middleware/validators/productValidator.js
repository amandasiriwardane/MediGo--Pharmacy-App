const { body } = require('express-validator');

exports.productValidation = [
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['prescription', 'otc', 'supplement', 'medical-equipment', 'personal-care'])
    .withMessage('Invalid category'),
  
  body('manufacturer')
    .trim()
    .notEmpty()
    .withMessage('Manufacturer is required'),
  
  body('pricing.price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('stock.quantity')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  
  body('stock.unit')
    .optional()
    .isIn(['piece', 'bottle', 'box', 'strip'])
    .withMessage('Invalid stock unit'),
  
  body('requiresPrescription')
    .optional()
    .isBoolean()
    .withMessage('requiresPrescription must be a boolean')
];