const { otpType } = require('../../../config/enums');
const { db, sequelize, Op } = require('../../../db/db');
const moment = require('moment');
const generateOtp = require('../../../utilities/generateOtp');
const sendOtpOnMobile = require('../../../utilities/sendOTPOnPhone');

const MAX_OTP_ATTEMPTS = 3;
const OTP_EXPIRATION_MINUTES = process.env.PHONE_VERIFY_OTP_EXPIRATION_MINUTES || 15; // Default to 10 minutes if not set

const sendOtpForVerification = async (phoneNumber, email) => {
	try {
		const userExists = await db.Users.findAll({
			where: {
				[Op.and]: [
					{ active: true }, // Ensure user is active
					{
						[Op.or]: [
							// 🚫 Restrict: Same email, same phone (Not Allowed)
							{
								[Op.and]: [
									{ email: email },
									{
										[Op.or]: [
											{ phone: phoneNumber }, // Exact match
											sequelize.where(
												sequelize.fn("REPLACE", sequelize.col("phone"), "+", ""),
												phoneNumber.replace("+", "")
											), // Match ignoring `+`
										],
									},
								],
							},
							// 🚫 Restrict: Same email, different phone (Not Allowed)
							{
								[Op.and]: [
									{ email: email },
									{
										[Op.not]: {
											[Op.or]: [
												{ phone: phoneNumber }, // Exact match
												sequelize.where(
													sequelize.fn("REPLACE", sequelize.col("phone"), "+", ""),
													phoneNumber.replace("+", "")
												), // Match ignoring `+`
											],
										},
									}, // Different phone
								],
							},
						],
					},
				]
			}, raw: true
		});
		if (userExists?.length > 1) {
			return { status: false, code: 400, msg: "We found multiple records for details provided." };
		}
		let user = userExists[0];

		if (!user) {
			return { status: false, code: 404, msg: "Record not found for this phone number." };
		}

		if (user?.isAccountLocked) {
			return { status: false, code: 400, msg: `Your account is locked. ${user?.accountLockingReason}.` };
		}
		if (user.isMobileVerified && user.isEmailVerified){
			return { status: true, code: 200, data: "Your account is already verified." }
		} 
		// if (user?.isMobileVerified) {
		// 	return { status: true, code: 200, data: "Your phone number is already verified." };
		// }

		const oneHourAgo = moment().subtract(1, 'hour').toDate();

		// Check the number of OTP requests in the last hour
		const recentOtpAttempts = await db.Otps.count({
			where: {
				phoneNumber,
				email,
				otpFor: otpType.phoneVerify,
				createdAt: { [Op.gte]: oneHourAgo }
			}
		});

		if (recentOtpAttempts >= MAX_OTP_ATTEMPTS) {
			return { status: false, code: 400, msg: "Too many OTP requests in the last hour. Please try again later." };
		}

		// Check if an unexpired OTP already exists
		const existingOtp = await db.Otps.findOne({
			where: {
				phoneNumber,
				email,
				otpFor: otpType.phoneVerify,
				expiresAt: { [Op.gt]: new Date() } // Ensure OTP has not expired
			},
			order: [['createdAt', 'DESC']]
		});

		if (existingOtp) {
			return {
				status: true, code: 200, data: {
					user,
					msg: `An OTP has already been sent to verify your phone number.`
				}
			};
		}

		const otpCode = generateOtp();
		const expiresAt = moment().add(OTP_EXPIRATION_MINUTES, 'minutes').toDate();

		const newOtp = await db.Otps.create({
			phoneNumber,
			email,
			otpCode,
			otpFor: otpType.phoneVerify,
			expiresAt
		});

		// Implement your method to send OTP, e.g., sendSms(phoneNumber, otpCode);

		if (newOtp) {
			let otpRes = await sendOtpOnMobile(otpCode, phoneNumber, email)
			if (otpRes.hasOwnProperty("status") && otpRes?.status === true) {
				return {
					status: true, code: 200, data: {
						user,
						otpCode,
						msg: `An OTP has been send to verify your phone number.`
					}
				}
			} else {
				return otpRes
			}
		} else {
			return { msg: "Something went wrong, please try again.", status: false, code: 400 };
		}
	} catch (error) {
		console.error("Error while sending OTP:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = sendOtpForVerification;
