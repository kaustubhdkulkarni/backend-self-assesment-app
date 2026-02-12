const { DataTypes } = require('sequelize');
const { transactionType, transactionStatus } = require('../../config/enums');

module.exports = (sequelize) => {
	const transaction = sequelize.define('transactions', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false
		},
		currency: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ratePerUSD: {
			type: DataTypes.DECIMAL(11, 4),
			allowNull: false,
			get() {
				const value = this.getDataValue('ratePerUSD'); // Get the raw value
				return parseFloat(value); // Convert it to a number
			},
		},
		amountToPayInUSD: {
			type: DataTypes.DECIMAL(11, 4),
			allowNull: false,
			get() {
				const value = this.getDataValue('amountToPayInUSD'); // Get the raw value
				return parseFloat(value); // Convert it to a number
			},
		},
		transactionType: {
			type: DataTypes.ENUM(Object.values(transactionType)),
			allowNull: false,
		},
		transactionAmount: {
			type: DataTypes.DECIMAL(11, 4),
			allowNull: false,
			get() {
				const value = this.getDataValue('transactionAmount'); // Get the raw value
				return parseFloat(value); // Convert it to a number
			},
		},
		remainingAmount: {
			type: DataTypes.DECIMAL(11, 4),
			allowNull: true,
			defaultValue: 0,
			get() {
				const value = this.getDataValue('remainingAmount'); // Get the raw value
				return parseFloat(value); // Convert it to a number
			},
		},
		transactionStatus: {
			type: DataTypes.ENUM(Object.values(transactionStatus)),
			allowNull: false,
		},
		transactionSession: {
			type: DataTypes.STRING,
			allowNull: true
		},
		checkoutURL: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		expiryAt: {
			type: DataTypes.DATE,
			allowNull: true
		},
		campaignId: {
			type: DataTypes.UUID,
			allowNull: true
		},
		installmentId: {
			type: DataTypes.UUID,
			allowNull: true
		},
		transactionResponse: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		bankDetails: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		notes: {
			type: DataTypes.JSON,
			allowNull: true,
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
		tableName: "transactions",
		timestamps: true,
		hooks: {
			// Define model hooks if necessary
		},
		defaultScope: {
			// Define default scopes if needed
		},
		scopes: {
			// Additional scopes can be defined here
		}
	});

	return transaction;
};