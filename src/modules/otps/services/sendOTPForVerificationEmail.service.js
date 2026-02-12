const { otpType } = require('../../../config/enums');
const { db, Op } = require('../../../db/db');
const moment = require('moment');
const generateOtp = require('../../../utilities/generateOtp');
const { sendOtpAccountVerification } = require("../../../utilities/emailService")
const MAX_OTP_ATTEMPTS = 3;
const OTP_EXPIRATION_MINUTES = process.env.EMAIL_VERIFY_OTP_EXPIRATION_MINUTES || 5; // Default to 15 minutes if not set

const sendOTPForVerificationEmail = async (email, otpCodeNumber) => {
	try {
		const userExists = await db.Users.findAll({
			where: {
				email,
				active: true
			},
			raw: true
		});

		if (userExists.length > 1) {
			return { status: false, code: 400, msg: "Multiple records found for the provided email." };
		}

		let user = userExists[0];

		if (!user) {
			return { status: false, code: 404, msg: "No record found for this email." };
		}

		if (user?.isAccountLocked) {
			return { status: false, code: 400, msg: `Your account is locked. ${user?.accountLockingReason}.` };
		}
		if (user.isMobileVerified && user.isEmailVerified){
			return { status: true, code: 200, data: "Your account is already verified." }
		} 
		// if (user?.isEmailVerified) {
		// 	return { status: true, code: 200, data: "Your email is already verified." };
		// }

		const oneHourAgo = moment().subtract(1, 'hour').toDate();

		// Check the number of OTP requests in the last hour
		const recentOtpAttempts = await db.Otps.count({
			where: {
				email,
				otpFor: otpType.emailVerify,
				createdAt: { [Op.gte]: oneHourAgo }
			}
		});

		if (recentOtpAttempts >= MAX_OTP_ATTEMPTS) {
			return { status: false, code: 400, msg: "Too many OTP requests in the last hour. Please try again later." };
		}

		// Check if an unexpired OTP already exists
		const existingOtp = await db.Otps.findOne({
			where: {
				email,
				otpFor: otpType.emailVerify,
				expiresAt: { [Op.gt]: new Date() } // Ensure OTP has not expired
			},
			order: [['createdAt', 'DESC']]
		});

		if (existingOtp) {
			return {
				status: true,
				code: 200,
				data: {
					user,
					msg: `An OTP has already been sent to verify your email.`
				}
			};
		}

		if (otpCodeNumber) {
			await sendOtpAccountVerification(user, otpCodeNumber);
			return {
				status: true,
				code: 200,
				data: {
					user,
					msg: `An OTP has been sent to verify your email.`
				}
			};
		}

		const otpCode =  generateOtp();
		const expiresAt = moment().add(OTP_EXPIRATION_MINUTES, 'minutes').toDate();

		const newOtp = await db.Otps.create({
			email,
			otpCode,
			otpFor: otpType.emailVerify,
			expiresAt
		});

		// Send OTP via email
		if (newOtp) {
			await sendOtpAccountVerification(user, otpCode); // Function to send OTP email
			return {
				status: true,
				code: 200,
				data: {
					user,
					msg: `An OTP has been sent to verify your email.`
				}
			};
		} else {
			return { msg: "Something went wrong, please try again.", status: false, code: 400 };
		}
	} catch (error) {
		console.error("Error while sending OTP:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = sendOTPForVerificationEmail;
