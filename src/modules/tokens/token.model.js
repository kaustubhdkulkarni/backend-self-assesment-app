const { DataTypes } = require('sequelize');
const { tokenTypes } = require('../../config/tokens');

module.exports = (sequelize) => {
    const Token = sequelize.define('tokens', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true,  // Add a unique constraint if required
        },
        userId: {
            type: DataTypes.UUID,  // Assuming the User's ID is UUID
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(
                tokenTypes.REFRESH,
                tokenTypes.RESET_PASSWORD,
                tokenTypes.VERIFY_EMAIL,
                tokenTypes.SETUP_PASSWORD,
                tokenTypes.SOCIAL_LOGIN
            ),
            allowNull: false,
        },
        expires: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        blacklisted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
		tableName: "tokens",
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

    return Token;
};
