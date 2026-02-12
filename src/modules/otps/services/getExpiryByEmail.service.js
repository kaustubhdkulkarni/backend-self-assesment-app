const { otpType } = require('../../../config/enums');
const { db } = require('../../../db/db');
const moment = require('moment');
const generateOtp = require('../../../utilities/generateOtp');
const { Op, Sequelize } = require('sequelize');

const getExpiryByEmail = async (email) => {
    try {
        const userExists = await db.Users.findAll({
            where: {
                email:email
            }, raw: true
        });

        if (userExists?.length > 1) {
            return { status: false, code: 400, msg: "Unable to get expiry." };
        }
        let user = userExists[0];

        if (!user) {
            return { status: false, code: 404, msg: "Record not found for this email." };
        }

        if (user.isAccountLocked) {
			return { status: false, code: 400, msg: `Your account is locked. ${user?.accountLockingReason}.` };
        }

        // if (user.isEmailVerified) {
        //     return { status: true, code: 200, data: "Your email is already verified." };
        // }

        const existingOtp = await db.Otps.findOne({
            where: {
                email,
                otpFor: otpType.emailVerify,
                expiresAt: { [Op.gt]: new Date() } // Ensure OTP has not expired
            },
            order: [['createdAt', 'DESC']]
        });

        if(!existingOtp){
            return { status: false, code: 400, msg: "Record not found for this email or expired." };
        }
        return {
            data: { expiry: existingOtp?.expiresAt }, status: true, code: 200
        }

    } catch (error) {
        console.error("Error while get OTP expiry:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getExpiryByEmail;
