const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional().isString(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  validate
];

const validateUser = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const validateCartItem = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  validate
];

const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  validate
];

const validateId = [
  param('id').notEmpty().withMessage('ID parameter is required'),
  validate
];

module.exports = {
  validateProduct,
  validateUser,
  validateCartItem,
  validateOrder,
  validateId
};
