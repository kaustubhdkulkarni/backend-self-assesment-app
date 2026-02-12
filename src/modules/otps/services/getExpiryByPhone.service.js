const { otpType } = require('../../../config/enums');
const { db, Op, sequelize } = require('../../../db/db');
const moment = require('moment');
const generateOtp = require('../../../utilities/generateOtp');

const getExpiryByPhone = async (phoneNumber, email) => {
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
            return { status: false, code: 400, msg: "Unable to get expiry." };
        }
        let user = userExists[0];

        if (!user) {
            return { status: false, code: 404, msg: "Record not found for this phone number." };
        }

        if (user.isAccountLocked) {
			return { status: false, code: 400, msg: `Your account is locked. ${user?.accountLockingReason}.` };
        }

        // if (user.isMobileVerified) {
        //     return { status: true, code: 200, data: "Your phone number is already verified." };
        // }

        const existingOtp = await db.Otps.findOne({
            where: {
                phoneNumber,
                email,
                otpFor: otpType.phoneVerify,
                expiresAt: { [Op.gt]: new Date() } // Ensure OTP has not expired
            },
            order: [['createdAt', 'DESC']]
        });

        if(!existingOtp){
            return { status: false, code: 400, msg: "Record not found for this phone number or expired." };
        }
        return {
            data: { expiry: existingOtp?.expiresAt }, status: true, code: 200
        }

    } catch (error) {
        console.error("Error while get OTP expiry:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getExpiryByPhone;
