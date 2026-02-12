class ApiError extends Error {
	constructor(statusCode = 500, message = 'Internal Server Error', isOperational = true, stack = '') {
		super(message);
		this.statusCode = statusCode;
		this.status = statusCode >= 400 ? false : false; // Set status to true for client errors (4xx)
		this.isOperational = isOperational;
		this.data = message;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

module.exports = ApiError;
