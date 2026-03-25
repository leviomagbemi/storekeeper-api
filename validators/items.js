const { body } = require('express-validator');
const { handleValidationErrors, validateNonEmptyBody } = require('./common');

const validateCreateItemPayload = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required.'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('sku is required.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('category is required.'),
  body('quantityInStock')
    .isFloat({ min: 0 })
    .withMessage('quantityInStock must be a non-negative number.')
    .toFloat(),
  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('unitPrice must be a non-negative number.')
    .toFloat(),
  body('supplier')
    .notEmpty()
    .withMessage('supplier is required.')
    .bail()
    .isMongoId()
    .withMessage('supplier must be a valid supplier id.'),
  body('reorderLevel')
    .isFloat({ min: 0 })
    .withMessage('reorderLevel must be a non-negative number.')
    .toFloat(),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('location is required.'),
  body('lastRestocked')
    .notEmpty()
    .withMessage('lastRestocked is required.')
    .bail()
    .isISO8601()
    .withMessage('lastRestocked must be a valid date.')
    .toDate(),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string.')
    .trim(),
  handleValidationErrors
];

const validateUpdateItemPayload = [
  validateNonEmptyBody,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('name is required.'),
  body('sku')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('sku is required.'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('category is required.'),
  body('quantityInStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('quantityInStock must be a non-negative number.')
    .toFloat(),
  body('unitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('unitPrice must be a non-negative number.')
    .toFloat(),
  body('supplier')
    .optional()
    .isMongoId()
    .withMessage('supplier must be a valid supplier id.'),
  body('reorderLevel')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('reorderLevel must be a non-negative number.')
    .toFloat(),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('location is required.'),
  body('lastRestocked')
    .optional()
    .isISO8601()
    .withMessage('lastRestocked must be a valid date.')
    .toDate(),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string.')
    .trim(),
  handleValidationErrors
];

module.exports = {
  validateCreateItemPayload,
  validateUpdateItemPayload
};
