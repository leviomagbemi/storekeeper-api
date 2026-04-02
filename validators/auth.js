const { body } = require('express-validator');
const { handleValidationErrors } = require('./common');

const validateRegisterPayload = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username is required.')
    .isLength({ min: 3 })
    .withMessage('username must be at least 3 characters long.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required.')
    .bail()
    .isEmail()
    .withMessage('email must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required.')
    .bail()
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long.'),
  handleValidationErrors
];

const validateLoginPayload = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required.')
    .bail()
    .isEmail()
    .withMessage('email must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required.'),
  handleValidationErrors
];

module.exports = {
  validateRegisterPayload,
  validateLoginPayload
};
