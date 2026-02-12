const { Sequelize, Op } = require('sequelize');
const mysql = require('mysql2/promise');
const logger = require('../config/logger');
// const session = require('express-session');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Database configuration
const config = {
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	host: process.env.MYSQL_HOST,
	dbPort: process.env.MYSQL_PORT,
	dialect: 'mysql',
};

// Create a connection to the MySQL server and ensure the database exists
const createDatabaseIfNotExists = async () => {
	const connection = await mysql.createConnection({
		host: config.host,
		user: config.username,
		password: config.password,
	});

	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
	await connection.end();
};

// Test connection and create database if it doesn't exist
const initializeDatabase = async () => {
	try {
		await createDatabaseIfNotExists();
		await sequelize.authenticate();
		logger.info('MySQL connection has been established successfully.');
	} catch (error) {
		logger.error('Unable to connect to the database:', error);
	}
};

// Initialize database connection
// initializeDatabase();

// Create Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
	port: config.dbPort,
	logging: false, // Set to `console.log` to enable SQL query logging
	pool: {
		max: 50, // Increase max connections
		// max: 20,     // old before 14-11-2025
		min: 5,         // Keep some idle connections ready (optional)
	//	acquire: 30000, // 60s wait for connection — keep as is
		acquire: 60000, // Wait up to 60s for a connection before failing
		idle: 10000,    // close idle connections after 10s
	//	idle: 10000,    // old before 14-11-2025
	}
});
console.log("sequelize connection pool: ",sequelize?.connectionManager?.pool);

// // Initialize session store
// const sessionStore = new SequelizeStore({
// 	db: sequelize, // Use your existing Sequelize instance
//   });
// Import models
const db = {
	Tokens: require('../modules/tokens/token.model')(sequelize),
	Users: require('../modules/users/user.model')(sequelize),
	SubRoles: require('../modules/subRoles/subRole.model')(sequelize),
	Otps: require('../modules/otps/otp.model')(sequelize),
	SystemUserRoles: require('../modules/systemUserRoles/systemUserRoles.model')(sequelize),

	Notification: require('../modules/notification/notification.model')(sequelize),

};

// Define associations
db.Tokens.belongsTo(db.Users, {
	foreignKey: 'userId',
});
db.Users.belongsTo(db.SubRoles, {
	foreignKey: 'subRoleId', as: 'subRoleObj'
});

db.Notification.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});

db.Users.belongsTo(db.SystemUserRoles,{
	foreignKey: "systemUserRoleId", as: "systemUserRoleObj"
})


db.Sequelize = Sequelize;  // it gives access to sequelize utility functions like Sequelize.fn which  is use to execute functions like COUNT, SUM, DISTINCT...

module.exports = {
	sequelize,
	db,
	Op,
	// sessionStore,
	initializeDatabase
};