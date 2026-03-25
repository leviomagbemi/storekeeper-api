const { param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    message: 'Validation failed.',
    errors: errors.array().map((error) => error.msg)
  });
};

const validateNonEmptyBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: ['Request body must contain at least one field.']
    });
  }

  return next();
};

const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid identifier.'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateNonEmptyBody,
  validateObjectId
};
