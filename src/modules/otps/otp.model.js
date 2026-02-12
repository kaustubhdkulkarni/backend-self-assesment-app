const { DataTypes } = require('sequelize');
const { otpType } = require('../../config/enums');

module.exports = (sequelize) => {
	const Otp = sequelize.define('otps', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		otpCode: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				len: [6, 6],
			},
		},
		otpFor: {
			type: DataTypes.ENUM(Object.values(otpType)),
			allowNull: false,
		},
		investmentId: {
			type: DataTypes.UUID,
			allowNull: true
		},
		expiresAt: {
			type: DataTypes.DATE,
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
		tableName: "otps",
		timestamps: true,
		hooks: {
			// Define hooks here if needed
		},
		defaultScope: {
			// Define default scopes here if needed
		},
		scopes: {
			// Additional scopes can be defined here
		},
	});

	return Otp;
};
