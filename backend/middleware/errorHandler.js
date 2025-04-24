const errorHandler = (err, req, res, _next) => {
  console.error(err);

  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  };

  // Handle Multer file size limit error
  if (err.code === 'LIMIT_FILE_SIZE') {
    errorResponse.error.code = 'VALIDATION_ERROR';
    errorResponse.error.message = 'File size exceeds the allowed limit';
    return res.status(400).json(errorResponse);
  }

  // Determine HTTP status code based on error type
  let statusCode = 500;
  switch (err.code) {
    case 'VALIDATION_ERROR':
      statusCode = 400;
      break;
    case 'REQUEST_NOT_FOUND':
    case 'FILE_NOT_FOUND':
    case 'VERSION_NOT_FOUND':
    case 'COMPARISON_ERROR':
      statusCode = 404;
      break;
    case 'FILE_UPLOAD_ERROR':
      statusCode = 422;
      break;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
