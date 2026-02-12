const { otpType, investmentStatus } = require('../../../config/enums');
const { db, Op } = require('../../../db/db');
const moment = require('moment');

const getSignContractOtpExpiry = async (investmentId, userId) => {
    try {
        // Verify investment exists and belongs to user
        const investment = await db.Investment.findOne({
            where: {
                id: investmentId,
                investorId: userId,
                investmentStatus: investmentStatus.SIGN_CONTRACT
            },
            raw: true
        });

        if (!investment) {
            return { status: false, code: 404, msg: "Investment not found." };
        }

        // Get user details
        const user = await db.Users.findOne({
            where: {
                id: userId,
                active: true
            },
            raw: true
        });

        if (!user) {
            return { status: false, code: 404, msg: "User not found." };
        }

        if (user.isAccountLocked) {
            return { status: false, code: 400, msg: `Your account is locked. ${user?.accountLockingReason}.` };
        }

        // Find the most recent valid OTP for sign_investment_contract
        const existingOtp = await db.Otps.findOne({
            where: {
                email: user.email,
                otpFor: otpType.signInvestmentContract, // Use your enum value
                expiresAt: { [Op.gt]: new Date() } // Ensure OTP has not expired
            },
            order: [['createdAt', 'DESC']]
        });

        if (!existingOtp) {
            return { status: false, code: 400, msg: "OTP not found or expired." };
        }

        return {
            data: { expiry: existingOtp?.expiresAt }, 
            status: true, 
            code: 200
        };

    } catch (error) {
        console.error("Error while getting sign contract OTP expiry:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports =  getSignContractOtpExpiry
