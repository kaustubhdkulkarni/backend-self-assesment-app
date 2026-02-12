const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utilities/pick');
const ApiError = require('../utilities/apiErrors');

const validate = (schema) => {
	// Precompile the Joi schema for efficiency if it's static.
	const compiledSchema = Joi.compile(schema)
		.prefs({ errors: { label: 'key' } });

	return (req, res, next) => {
		const validSchema = pick(schema, ['params', 'query', 'body']);
		const object = pick(req, Object.keys(validSchema));
		const { value, error } = compiledSchema.validate(object);

		if (error) {
			console.log("error:", error);
			const errorMessage = error.details.map(details => details.message).join(', ');
			return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
		}
		Object.assign(req, value);
		return next();
	};
};

module.exports = validate;

