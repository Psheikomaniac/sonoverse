const errorHandler = (err, req, res, _next) => {
  console.error(err);

  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  };

  // Determine HTTP status code based on error type
  let statusCode = 500;
  switch (err.code) {
    case 'VALIDATION_ERROR':
      statusCode = 400;
      break;
    case 'REQUEST_NOT_FOUND':
    case 'FILE_NOT_FOUND':
      statusCode = 404;
      break;
    case 'FILE_UPLOAD_ERROR':
      statusCode = 422;
      break;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
