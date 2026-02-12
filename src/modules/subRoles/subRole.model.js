const { DataTypes } = require('sequelize');
const { subRoles } = require('../../config/enums');
module.exports = (sequelize) => {
	const SubRole = sequelize.define('sub_roles', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		subRoleName: {
			type: DataTypes.ENUM(subRoles.businessInvestor, subRoles.regularInvestor, subRoles.sophisticatedInvestor),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
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
		tableName: "sub_roles",
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
	return SubRole;
}