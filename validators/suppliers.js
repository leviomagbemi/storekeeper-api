const { body } = require('express-validator');
const { handleValidationErrors, validateNonEmptyBody } = require('./common');

const validateCreateSupplierPayload = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required.')
    .bail()
    .isEmail()
    .withMessage('email must be a valid email address.'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('phone is required.'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('address is required.'),
  body('contactPerson')
    .trim()
    .notEmpty()
    .withMessage('contactPerson is required.'),
  handleValidationErrors
];

const validateUpdateSupplierPayload = [
  validateNonEmptyBody,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('name is required.'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('email is required.')
    .bail()
    .isEmail()
    .withMessage('email must be a valid email address.'),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('phone is required.'),
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('address is required.'),
  body('contactPerson')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('contactPerson is required.'),
  handleValidationErrors
];

module.exports = {
  validateCreateSupplierPayload,
  validateUpdateSupplierPayload
};
