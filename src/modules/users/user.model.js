const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { roles, accountType, gender, source } = require('../../config/enums');

module.exports = (sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        middleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: { msg: 'Must be a valid email address' },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        systemUserRoleId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM(Object.values(roles)),
            allowNull: false,
            defaultValue: roles.user,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        isAccountLocked: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        lockedUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },
        accountLockingReason: {
            type: DataTypes.STRING,
            allowNull: true,
            default: ""
        },
        isMobileVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        accountType: {
            type: DataTypes.ENUM(accountType.investor, accountType.fundraiser, ""),
            allowNull: true,
        },
        subRoleId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'The "date of birth" field must be a valid date.',
                },
                isAtLeast16YearsOld(value) {
                    if (value) {
                        const now = new Date();
                        const eighteenYearsAgo = new Date(now.setFullYear(now.getFullYear() - 18));
                        if (value > eighteenYearsAgo) {
                            throw new Error('The "date of birth" must be at least 18 years ago from today.');
                        }
                    }
                },
            },
        },
        gender: {
            type: DataTypes.ENUM(gender.male, gender.female, gender.other),
            allowNull: true
        },
        isKycVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        isKybVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        loginAttempts: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        civilNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        source: {
            type: DataTypes.ENUM(Object.values(source)),
            allowNull: true,
            defaultValue: source.web
        },
        accreditationRequestId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        isWelcomeEmailSent: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        isAccountDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        deletionReason: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
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
        tableName: "users",
        timestamps: true,
        defaultScope: {
             where: {
        isAccountDeleted: false,
    },
            attributes: { exclude: ['password'] },
        },
        scopes: {
            withPassword: {
                attributes: { include: ['password'] },
            },
        },
        hooks: {
            beforeSave: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    });

    return User;
};
