const { DataTypes } = require("sequelize");
const { campaignStatus, notificationTypes } = require("../../config/enums");

module.exports = (sequelize) => {
	const Notification = sequelize.define('notifications', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		isRead: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		notificationType: {
			type: DataTypes.ENUM(...Object.values(notificationTypes)),
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	}, {
		tableName: "notifications",
		timestamps: true,
		hooks: {
		},
		defaultScope: {
			// Define default scopes here if needed
		},
		scopes: {
			// Additional scopes can be defined here
		}
	});
	return Notification;
};
