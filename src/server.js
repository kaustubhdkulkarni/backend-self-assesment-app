const dotenv = require('dotenv');
const logger = require('./config/logger'); // Assuming you have a logger setup
const app = require('./app');
const { sequelize, initializeDatabase } = require('./db/db');

dotenv.config();

// Sync models (create tables if they don't exist)
const syncModels = async () => {
    try {
        // alter: true will recreate foreignKey on each restart.
        await sequelize.sync({ alter: false });
        logger.info('Database schema synchronized.');
    } catch (error) {
        logger.error('Error synchronizing database schema:', error);
        throw error; // Throw error to be handled in startup sequence
    }
};

const startServer = () => {
    const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : process.env.PORT;

    // Start the server after successful DB connection
    const server = app.listen(port, () => {
        logger.info(`Listening on port ${port}`);
    });

    // Graceful shutdown handlers
    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger.info('Server closed');
                process.exit(0); // Exit with success status code
            });
        } else {
            process.exit(0); // Exit with success status code
        }
    };

    const unexpectedErrorHandler = (error) => {
        logger.error('Unexpected error:', error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
        logger.info('SIGTERM received');
        if (server) {
            server.close((err) => {
                if (err) {
                    logger.error('Error closing server:', err);
                    process.exit(1); // Exit with error status code
                } else {
                    logger.info('Server closed gracefully');
                    process.exit(0); // Exit with success status code
                }
            });
        } else {
            process.exit(0); // Exit with success status code
        }
    });
}

// Run migrations and sync models, then start the server
const initializeApp = async () => {
    try {
        await initializeDatabase();
        // await syncModels();
        startServer();
    } catch (error) {
        logger.error('Error during initialization:', error);
        process.exit(1); // Exit with failure status code
    }
};

initializeApp();