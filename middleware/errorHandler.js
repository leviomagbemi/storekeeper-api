const mongoose = require('mongoose');

const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found.' });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: Object.values(err.errors).map((error) => error.message)
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate value error.',
      field: Object.keys(err.keyPattern || {})[0]
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: 'Invalid identifier.'
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error.'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
