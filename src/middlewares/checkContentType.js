const httpStatus = require('http-status');
const ApiError = require('../utilities/apiErrors');

// Middleware factory to check Content-Type
const checkContentType = (...requiredContentTypes) => (req, res, next) => {
  // If there is no request body, skip content-type check
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(); // Proceed without checking Content-Type
  }
  const contentType = req.headers['content-type'];

  // If no Content-Type header is present, reject the request
  if (!contentType) {
    console.error('Missing Content-Type header');
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Content-Type header is missing'));
  }

  // Check if the content type is one of the required types
  const isValidContentType = requiredContentTypes.some(type => contentType.includes(type));

  if (!isValidContentType) {
    console.error('Invalid Content-Type:', contentType);
    return next(new ApiError(httpStatus.UNSUPPORTED_MEDIA_TYPE, `Unsupported Content-Type. Accepted types: ${requiredContentTypes.join(', ')}`));
  }

  next(); // If Content-Type is valid, proceed to the next middleware or route handler
};

module.exports = checkContentType;