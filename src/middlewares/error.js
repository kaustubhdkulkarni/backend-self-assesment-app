const mysql = require('mysql2');
const httpStatus = require('http-status');
const ApiError = require('../utilities/apiErrors');
const config = require('../config/config');
const logger = require('../config/logger');

// Error converter middleware
const errorConverter = (err, req, res, next) => {
    const statusCode = err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
        ? httpStatus.BAD_REQUEST
        : err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];
    const error = err instanceof ApiError ? err : new ApiError(statusCode, message, false, err.stack);
    next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const response = {
        code: statusCode,
        status: statusCode < 500, // True for client errors, false for server errors
        message: config.env === 'production' && !err.isOperational
            ? 'An unexpected error occurred'
            : err.message,
        ...(config.env === 'development' && { stack: err.stack })
    };

    if (err.isOperational) {
        logger.warn(err);
    } else {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};
