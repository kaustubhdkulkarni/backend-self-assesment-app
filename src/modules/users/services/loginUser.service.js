const bcrypt = require('bcryptjs');
const moment = require("moment")
const { db, Op, sequelize } = require('../../../db/db');
const tokenServices = require("../../tokens/tokens.services");
const otpServices = require("../../otps/services");
const decryptPassword = require('../../../utilities/decryptPassword');
const { accountLockedMail } = require('../../../utilities/emailService');
const { roles, gccCountryPhoneCodes, otpOnMobileSendCountryCodes } = require('../../../config/enums');


const loginUser = async ({ body }) => {
	try {
		// if (!body?.phone || body.phone === undefined) {
		// 	return {
		// 		status: false, code: 400,
		// 		msg: "Please register with valid phone"
		// 	}
		// }
		if (!body?.email || body.email === undefined) {
			return {
				status: false, code: 400,
				msg: "Please register with valid email"
			}
		}
		// const userExists = await db.Users.scope('withPassword').findAll({
		// 	where: {
		// 		[Op.and]: [
		// 			{ active: true }, // Ensure user is active
		// 			{
		// 				[Op.or]: [
		// 					// 🚫 Restrict: Same email, same phone (Not Allowed)
		// 					{
		// 						[Op.and]: [
		// 							{ email: body.email },
		// 							{
		// 								[Op.or]: [
		// 									{ phone: body.phone }, // Exact match
		// 									sequelize.where(
		// 										sequelize.fn("REPLACE", sequelize.col("phone"), "+", ""),
		// 										body.phone.replace("+", "")
		// 									), // Match ignoring `+`
		// 								],
		// 							},
		// 						],
		// 					},
		// 					// 🚫 Restrict: Same email, different phone (Not Allowed)
		// 					{
		// 						[Op.and]: [
		// 							{ email: body.email },
		// 							{
		// 								[Op.not]: {
		// 									[Op.or]: [
		// 										{ phone: body.phone }, // Exact match
		// 										sequelize.where(
		// 											sequelize.fn("REPLACE", sequelize.col("phone"), "+", ""),
		// 											body.phone.replace("+", "")
		// 										), // Match ignoring `+`
		// 									],
		// 								},
		// 							}, // Different phone
		// 						],
		// 					},
		// 				],
		// 			},
		// 		]
		// 	},
		// 	include: [
		// 		{
		// 			model: db.SubRoles,
		// 			as: "subRoleObj",
		// 			attributes: ['subRoleName'],
		// 			require: false
		// 		},
		// 		{
		// 			model: db.AccreditationRequests,
		// 			as: "accreditationRequestObj",
		// 			attributes: ["isAccredited", "accreditationRequestStatus"]
		// 		}
		// 	],
		// 	// raw: true
		// });

		const userExists = await db.Users.scope('withPassword').findAll({
			where: { active: true, email: body.email },
			include: [
				{
					model: db.SubRoles,
					as: "subRoleObj",
					attributes: ['subRoleName'],
					require: false
				},
				{
					model: db.AccreditationRequests,
					as: "accreditationRequestObj",
					attributes: ["isAccredited", "accreditationRequestStatus"]
				}
			],
			// raw: true
		});
		if (userExists?.length > 1) {
			return { status: false, code: 400, msg: "We found multiple records for details provided." };
		}

		let user = userExists[0];


		if (user && user.isAccountDeleted) {
			return {
				status: false,
				code: 400,
				msg: "Account not found."
			}
		}

		if (!user) {
			return {
				msg: `User with email ${body?.email} not found`,
				status: false,
				code: 404
			};
		}

		if (user?.role !== roles?.user) {
			return {
				status: false,
				code: 404,
				msg: "User not found"
			};
		}

		if (!user?.phone || user.phone === undefined) {
			return {
				status: false, code: 400,
				msg: "Phone number not exists for this account"
			}
		}

		if (user?.isAccountLocked) {
			return {
				status: false, code: 400,
				msg: user?.accountLockingReason
			}
		}
		const decryptedPassword = await decryptPassword(body?.password);
		let matchPassword = await bcrypt.compare(decryptedPassword, user?.password);

		if (!matchPassword) {
			if (user?.loginAttempts >= process.env.MAX_LOGIN_ATTENPT) {
				return {
					status: false, code: 400,
					msg: user?.accountLockingReason
				}
			} else {
				await db.Users.increment(
					{ loginAttempts: 1 },
					{ where: { id: user?.id } }
				)
				if (user?.loginAttempts + 1 >= process.env.MAX_LOGIN_ATTENPT) {
					let lockTime = moment().add(Number(process.env.LOCKING_PERIOD_IN_DAYS), 'days').toDate();
					let updatedUser = await user.update(
						{
							isAccountLocked: true,
							lockedUntil: lockTime,
							accountLockingReason: `Your account has been locked after multiple failed login attempts. Please wait until ${moment(lockTime).format('lll')} or contact support to regain access.`
						},
					)
					await accountLockedMail(updatedUser)

					return {
						status: false, code: 400,
						msg: updatedUser?.accountLockingReason
					}
				}
			}
			return { status: false, code: 400, msg: "Incorrect email or password" }
		}
		if (user?.loginAttempts) {
			await user.update({
				loginAttempts: 0,
				isAccountLocked: false,
				lockedUntil: null,
				accountLockingReason: ""
			})
		}

		let sendOtpToPhoneResult = null;
		let sendOTPToMailResult = null;
		let otpResults = null;
		let otpCode = null;
		let gccCountry = false;
		if (!user.isMobileVerified || !user.isEmailVerified) {
			if (otpOnMobileSendCountryCodes.some(code => user?.phone.startsWith(code) || user?.phone.startsWith('+' + code))) {
				sendOtpToPhoneResult = await otpServices.sendOtpForVerification(user.phone, user?.email);
				if (!sendOtpToPhoneResult?.status) {
					if (sendOtpToPhoneResult?.data?.otpCode) {
						delete sendOtpToPhoneResult.data.otpCode;
					}
					return sendOtpToPhoneResult
				}

				if (sendOtpToPhoneResult?.data?.otpCode) {
					otpCode = sendOtpToPhoneResult.data.otpCode;
					delete sendOtpToPhoneResult.data.otpCode;
				}
				gccCountry = true;
				otpResults = sendOtpToPhoneResult?.data;
			}
			if (true) {
				sendOTPToMailResult = await otpServices.sendOTPForVerificationEmail(
					user?.email,
					otpCode
				);
				if (!sendOTPToMailResult?.status) {
					return sendOTPToMailResult;
				}
				otpResults = otpResults ? otpResults : sendOTPToMailResult?.data;
			}
		}

		if (otpResults) {
			if (gccCountry) {
				return {
					data: otpResults?.user ? {
						phone: otpResults.user?.phone,
						email: otpResults.user?.email,
						msg: `${otpResults ? otpResults.msg : ""}`
					} : otpResults,
					status: true,
					code: 200
				}
			}
			return {
				data: otpResults?.user ? {
					email: otpResults.user?.email,
					phone: otpResults.user?.phone,
					msg: `${otpResults ? otpResults.msg : ""}`
				} : otpResults,
				status: true,
				code: 200
			}
		}
		const tokens = await tokenServices.generateAuthTokens(user);

		delete user?.dataValues?.password;
		return { data: { user, tokens }, status: true, code: 200 }
	} catch (error) {
		console.error("Error while login User:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = loginUser;
