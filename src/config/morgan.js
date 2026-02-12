const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
	skip: (req, res) => res.statusCode >= 400,
	stream: {
		write: (message) => {
			try {
				logger.info(message.trim());
			} catch (error) {
				console.error('Error occurred while logging:', error);
			}
		}
	},
});

const errorHandler = morgan(errorResponseFormat, {
	skip: (req, res) => res.statusCode < 400,
	stream: {
		write: (message) => {
			try {
				logger.error(message.trim());
			} catch (error) {
				console.error('Error occurred while logging:', error);
			}
		}
	},
});

module.exports = {
	successHandler,
	errorHandler,
};
