const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate entry',
      details: err.errors.map(e => e.message)
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong'
  });
};

module.exports = errorHandler;