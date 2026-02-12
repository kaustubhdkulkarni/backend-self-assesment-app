const winston = require('winston');
const config = require('./config');
const { format } = winston;

// Custom error formatting
const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

// Define log filename and log level based on environment
const logFilename = 'app.log';
const logLevel = 'debug';

// Logger configuration
const logger = winston.createLogger({
    level: logLevel,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        enumerateErrorFormat(),
        format.colorize(),
        format.splat(),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    format.printf(({ timestamp, level, message, metadata }) => {
      const metaString = metadata && Object.keys(metadata).length
        ? JSON.stringify(metadata, null, 2)
        : '';
      return `[${timestamp}] ${level}: ${message} ${metaString}`;
    })

    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
        // File transport for production environment
        config.env !== 'development' && new winston.transports.File({ filename: logFilename }),
    ].filter(Boolean), // Remove falsy values (null or undefined) from the array
});

// Error handling: Log uncaught exceptions
process.on('uncaughtException', (ex) => {
  logger.error('Uncaught exception:', ex);
  // Allow some cleanup before exit
  setTimeout(() => process.exit(1), 1000);
});


// Error handling: Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
  // Optionally exit after logging
  setTimeout(() => process.exit(1), 1000);
});

module.exports = logger;
