const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
		PORT: Joi.number().default(3001),
		REMOTE_BASE_URL: Joi.string().required().description('REMOTE Base URL '),
		MYSQL_HOST: Joi.string().required().description('MySQL host'),
		MYSQL_USER: Joi.string().required().description('MySQL user'),
		MYSQL_PASSWORD: Joi.string().required().description('MySQL password'),
		MYSQL_DATABASE: Joi.string().required().description('MySQL database name'),
		MYSQL_PORT: Joi.string().required().description('MySQL database port'),
		PHONE_VERIFY_OTP_EXPIRATION_MINUTES: Joi.number().required().description('Minutes after which phone verify otp expire'),
		JWT_SECRET: Joi.string().required().description('JWT secret key'),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(60).description('Minutes after which access tokens expire'),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(60).description('Minutes after which refresh tokens expire'),
		JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('Minutes after which reset password token expires'),
		JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('Minutes after which verify email token expires'),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	baseUrl: envVars.REMOTE_BASE_URL,
	mysql: {
		host: envVars.MYSQL_HOST,
		user: envVars.MYSQL_USER,
		password: envVars.MYSQL_PASSWORD,
		database: envVars.MYSQL_DATABASE,
		dbPort: envVars.MYSQL_PORT,
	},
	otp: {
		phoneVerifyExpirationMinutes: envVars.PHONE_VERIFY_OTP_EXPIRATION_MINUTES
	},
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
		verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
		investmentContactVerifyExpirationMinutes: envVars.JWT_INVESTMENT_CONTACT_VERIFY_EXPIRATION_MINUTES,
	},
};
