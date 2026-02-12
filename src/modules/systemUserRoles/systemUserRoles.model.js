const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SystemUserRoles = sequelize.define(
    "SystemUserRoles",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      systemUserRoleName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modulePermissions: {
        type: DataTypes.JSONB,
        defaultValue: {},
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
    },
    {
      timestamps: true, // Enables createdAt and updatedAt
      tableName: "system_user_roles", // Explicit table name
      hooks: {
        // Define any model hooks if needed
      },
      defaultScope: {
        // Define default scopes here if needed
      },
      scopes: {
        // Additional scopes can be defined here
      },
    }
  );

  return SystemUserRoles;
};
