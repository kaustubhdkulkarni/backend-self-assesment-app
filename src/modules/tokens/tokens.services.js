const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Token = require('./token.model');
const moment = require('moment');
const User = require('../users/user.model');
const { tokenTypes } = require('../../config/tokens');
const { db } = require('../../db/db');
const { sendVerificationEmail, sendForgotPasswordEmail } = require('../../utilities/emailService');
const { Op } = require('sequelize');
const { roles } = require('../../config/enums');
const MAX_EMAIL_VERIFY_ATTEMPTS = 3;
const MAX_FORGOT_PASSWORD_ATTEMPTS = 3;

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};


const generateForgotPasswordToken = async (user) => {
	try {
		const oneDayAgo = moment().subtract(24, 'hour').toDate();
		const recentForogtPasswordAttempts = await db.Tokens.count({
			where: {
				userId: user.id, type: tokenTypes.RESET_PASSWORD,
				createdAt: { [Op.gte]: oneDayAgo }
			}
		});
		if (recentForogtPasswordAttempts >= MAX_FORGOT_PASSWORD_ATTEMPTS) {
			return { status: false, code: 400, msg: "Too many forgot password requests in the last one day. Please try again later!." };
		}

		const existingForgotPasswordToken = await db.Tokens.count({
			where: {
				userId: user.id, type: tokenTypes.RESET_PASSWORD,
				expires: { [Op.gte]: Date.now() }
			},
			order: [['createdAt', 'DESC']]
		});
		
		if (existingForgotPasswordToken) {
			return { status: true, code: 200, data: `A forgot passwrod link has already been sent to verify your email.` };
		}

		const forgotPasswordTokenExpires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
		const forgotPasswordToken = generateToken(user.id, forgotPasswordTokenExpires, tokenTypes.VERIFY_EMAIL);
		await saveToken(forgotPasswordToken, user.id, tokenTypes.RESET_PASSWORD, forgotPasswordTokenExpires);

		let baseUrl = user?.role === roles.superAdmin
			? process.env.REMOTE_ADMIN_URL
			: process.env.REMOTE_BASE_URL;

		const resetLink = `${baseUrl}/reset-password/?token=${forgotPasswordToken}`

		const forgotPasswordEmailResponse = await sendForgotPasswordEmail(user, resetLink);
		return forgotPasswordEmailResponse;

	} catch (error) {
		return { msg: error.message, status: false, code: 500 }
	}
}

const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
	const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
	await saveToken(refreshToken, user.id, tokenTypes.REFRESH, refreshTokenExpires);
	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

const saveToken = async (token, userId, type, expires, blacklisted = false) => {
	const tokenDoc = await db.Tokens.create({
		token,
		userId,  // Use 'userId' to correctly map to the foreign key in the Token model
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

const verifyToken = async (token, type) => {
	try {
		const payload = jwt.verify(token, config.jwt.secret);
		const tokenDoc = await db.Tokens.findOne({
			where: {
				token, type, userId: payload.sub, blacklisted: false
			}
		});
		if (!tokenDoc) {
			throw new Error('Token not found');
		}
		return tokenDoc;
	} catch (error) {
		return { msg: error.message, status: false, code: 401 }
	}
};

const sendTokenForVerification = async (user) => {
	try {
		const oneDayAgo = moment().subtract(24, 'hour').toDate();
		const recentVerifyAttempts = await db.Tokens.count({
			where: {
				userId: user.id, type: tokenTypes.VERIFY_EMAIL,
				createdAt: { [Op.gte]: oneDayAgo }
			}
		});

		if (recentVerifyAttempts >= MAX_EMAIL_VERIFY_ATTEMPTS) {
			return { status: false, code: 400, msg: "Too many email verification requests in the last one day. Please try again later." };
		}

		const existingVerifyToken = await db.Tokens.count({
			where: {
				userId: user.id, type: tokenTypes.VERIFY_EMAIL,
				expires: { [Op.gte]: Date.now() }
			},
			order: [['createdAt', 'DESC']]
		});

		if (existingVerifyToken) {
			return { status: true, code: 200, data: `A verification link has already been sent to verify your email.` };
		}

		const verifyTokenExpires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
		const verifyEmailToken = generateToken(user.id, verifyTokenExpires, tokenTypes.VERIFY_EMAIL);
		await saveToken(verifyEmailToken, user.id, tokenTypes.VERIFY_EMAIL, verifyTokenExpires);
		const inviteLink = `${process.env.REMOTE_BASE_URL}/verify-email/?token=${verifyEmailToken}`
		const emailResponse = await sendVerificationEmail(user, inviteLink);
		return emailResponse;
	} catch (error) {
		return { msg: error.message, status: false, code: 500 }
	}
}
const generateInvestmentToken = async (user) => {
	try {
		const verifyTokenExpires = moment().add(config.jwt.investmentContactVerifyExpirationMinutes, 'minutes');
		const verifyContactToken = generateToken(user.id, verifyTokenExpires, tokenTypes.INVESTMENT_VERIFICATION);
		await saveToken(verifyContactToken, user.id, tokenTypes.INVESTMENT_VERIFICATION, verifyTokenExpires);
		return verifyContactToken;
	} catch (error) {
		return { msg: error.message, status: false, code: 500 }
	}
}

module.exports = {
	generateAuthTokens,
	generateToken,
	verifyToken,
	saveToken,
	generateForgotPasswordToken,
	sendTokenForVerification,
	generateInvestmentToken,
}