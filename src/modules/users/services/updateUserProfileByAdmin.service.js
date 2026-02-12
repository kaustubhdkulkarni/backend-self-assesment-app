const httpStatus = require("http-status");
const { accountType, subRoles, kycDocStatus, kycType } = require("../../../config/enums");
const { db } = require("../../../db/db");


/**
 * ============================================
 * HELPER FUNCTIONS
 * ============================================
 */


/**
 * Fetch user with all necessary details
 */
const fetchUserWithDetails = async (userId) => {
    return await db.Users.findOne({
        where: { id: userId },
        include: [
            {
                model: db.SubRoles,
                as: 'subRoleObj',
                attributes: ['id', 'subRoleName']
            },
            {
                model: db.KYC,
                as: 'kycDetailObj',
                attributes: ['isMalaasKYCVerified', 'isSmileIDKYCVerified', 'isManualKYCVerified']
            }
        ]
    });
};


/**
 * Check if user's KYC is fully verified
 */
const isAutomaticMalaKycVerified = (user) => {
    const kyc = user?.kycDetailObj;
    return Boolean(
        kyc?.isMalaasKYCVerified &&
        !kyc?.isManualKYCVerified
    );
};


/**
 * Check if user can update KYC (Regular/Sophisticated Investors only)
 */
const canUpdateKyc = (user) => {
    const isInvestor = user?.accountType === accountType.investor;
    const subRole = user?.subRoleObj?.subRoleName;

    return isInvestor && (
        subRole === subRoles.regularInvestor ||
        subRole === subRoles.sophisticatedInvestor
    );
};


/**
 * Check if user can update KYB (Business Investors/Fundraisers only)
 */
const canUpdateKyb = (user) => {
    const isBusinessInvestor =
        user?.accountType === accountType.investor &&
        user?.subRoleObj?.subRoleName === subRoles.businessInvestor;

    const isFundraiser = user?.accountType === accountType.fundraiser;

    return isBusinessInvestor || isFundraiser;
};


/**
 * ============================================
 * UPDATE KYC/KYB TABLE
 * ============================================
 */


/**
 * Update KYC table when verification status changes
 * Creates record if not present
 */
const updateKycTable = async (userId, isKycVerified, adminUser) => {
    try {
        // Find or create KYC record
        const [kycRecord, created] = await db.KYC.findOrCreate({
            where: { userId },
            defaults: {
                userId,
                isManualKYCVerified: false,
                isMalaasKYCVerified: false,
                isSmileIDKYCVerified: false,
            }
        });
        // Update KYC table
        await db.KYC.update(
            {
                isManualKYCVerified: isKycVerified,
                isMalaasKYCVerified: isKycVerified,
                isSmileIDKYCVerified: isKycVerified,
                remarks: isKycVerified
                    ? "User KYC verified successfully by admin"
                    : "User KYC verification revoked by admin",
                actionBy: adminUser?.id || adminUser?.email
            },
            { where: { userId } }
        );

        return { status: true };

    } catch (error) {
        console.error("Error updating KYC table:", error);
        return { status: false, error: error.message };
    }
};


/**
 * Update KYB in same KYC table when verification status changes
 * Creates record if not presentisMalaasKYCAutomaticVerified
 */
const updateKybTable = async (userId, isKybVerified, adminUser) => {
    try {
        // Find or create KYC record
        const [kycRecord, created] = await db.KYC.findOrCreate({
            where: { userId },
            defaults: {
                userId,
                isManualKYBVerified: false,
                isMalaasKYCVerified: false,
                isSmileIDKYCVerified: false,
            }
        });

        // Update KYB fields in KYC table (same table)
        const result = await db.KYC.update(
            {
                isManualKYBVerified: isKybVerified,
                isMalaasKYCVerified: false,
                isSmileIDKYCVerified: false,
                kycType: kycType.manual,
                crDocStatus: isKybVerified ? kycDocStatus.Approved : kycDocStatus.Pending,
                financialStatementStatus: isKybVerified ? kycDocStatus.Approved : kycDocStatus.Pending,
                companyProfileStatus: isKybVerified ? kycDocStatus.Approved : kycDocStatus.Pending,
                remarks: isKybVerified
                    ? "User KYB verified successfully by admin"
                    : "User KYB verification revoked by admin",
                actionBy: adminUser?.id || adminUser?.email
            },
            { where: { userId } }
        );

        return { status: true };

    } catch (error) {
        console.error("Error updating KYB in KYC table:", error);
        return { status: false, error: error.message };
    }
};


/**
 * ============================================
 * MAIN SERVICE FUNCTION
 * ============================================
 */


/**
 * Update user profile - Simplified version
 */
const updateUserProfileByAdmin = async ({
    userId,
    firstName,
    middleName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    civilNumber,
    active,
    isAccountLocked,
    isMobileVerified,
    isEmailVerified,
    isKycVerified,
    isKybVerified,
    adminUser
}) => {
    try {
        // ====================================
        // STEP 1: Fetch User
        // ====================================
        const user = await fetchUserWithDetails(userId);

        if (!user) {
            return {
                status: false,
                code: httpStatus.NOT_FOUND,
                msg: "User not found."
            };
        }

        const updatePayload = {};

        // ====================================
        // STEP 2: Profile Fields Validation
        // ====================================
        const profileFields = {
            firstName, middleName, lastName, phone,
            dateOfBirth, gender, civilNumber
        };

        const hasProfileUpdate = Object.values(profileFields).some(val => val !== undefined);

        if (hasProfileUpdate) {
            // Check if KYC is fully verified
            if (isAutomaticMalaKycVerified(user)) {
                return {
                    status: false,
                    code: httpStatus.BAD_REQUEST,
                    msg: "Profile fields cannot be updated when the user's mala KYC is automatically verified."
                };
            }

            // Add profile fields to payload
            Object.entries(profileFields).forEach(([key, value]) => {
                if (value !== undefined) updatePayload[key] = value;
            });
        }

        // ====================================
        // STEP 3: System Fields (Always Allowed)
        // ====================================
        if (active !== undefined) {
            updatePayload.active = active;
        }

        // Account Lock/Unlock handling
        if (isAccountLocked !== undefined) {
            updatePayload.isAccountLocked = isAccountLocked;

            // Reverse case: Unlock account
            if (isAccountLocked === false) {
                updatePayload.lockedUntil = null;
                updatePayload.accountLockingReason = null;
                updatePayload.failedLoginAttempts = 0;
            }
        }

        // Mobile verification
        if (isMobileVerified !== undefined) {
            updatePayload.isMobileVerified = isMobileVerified;
        }

        // Email verification
        if (isEmailVerified !== undefined) {
            updatePayload.isEmailVerified = isEmailVerified;
        }

        // ====================================
        // STEP 4: KYC Verification Handling
        // ====================================
        if (isKycVerified !== undefined) {
            // Check role permission
            if (!canUpdateKyc(user)) {
                return {
                    status: false,
                    code: httpStatus.BAD_REQUEST,
                    msg: "isKycVerified can only be updated for regular or sophisticated investors."
                };
            }

            // Check if already fully verified
            if (isAutomaticMalaKycVerified(user)) {
                return {
                    status: false,
                    code: httpStatus.BAD_REQUEST,
                    msg: "KYC status cannot be updated when the KYC is automatically verified."
                };
            }

            // Update KYC table (creates if not exists)
            const kycResult = await updateKycTable(userId, isKycVerified, adminUser);

            if (!kycResult.status) {
                return {
                    status: false,
                    code: httpStatus.INTERNAL_SERVER_ERROR,
                    msg: `Failed to update KYC: ${kycResult.error}`
                };
            }

            // Update user table
            updatePayload.isKycVerified = isKycVerified;
        }

        // ====================================
        // STEP 5: KYB Verification Handling
        // ====================================
        if (isKybVerified !== undefined) {
            // Check role permission
            if (!canUpdateKyb(user)) {
                return {
                    status: false,
                    code: httpStatus.BAD_REQUEST,
                    msg: "isKybVerified can only be updated for business investors or fundraisers."
                };
            }
            // Update KYB in KYC table (creates if not exists)
            const kybResult = await updateKybTable(userId, isKybVerified, adminUser);

            if (!kybResult.status) {
                return {
                    status: false,
                    code: httpStatus.INTERNAL_SERVER_ERROR,
                    msg: `Failed to update KYB: ${kybResult.error}`
                };
            }

            // Update user table
            updatePayload.isKybVerified = isKybVerified;
        }

        // ====================================
        // STEP 6: Check if anything to update
        // ====================================
        if (Object.keys(updatePayload).length === 0) {
            return {
                status: false,
                code: httpStatus.BAD_REQUEST,
                msg: "No valid fields to update."
            };
        }

        // ====================================
        // STEP 7: Update User Table
        // ====================================
        await db.Users.update(updatePayload, { where: { id: userId } });

        // ====================================
        // STEP 8: Return Success
        // ====================================
        return {
            status: true,
            code: httpStatus.OK,
            msg: "User profile updated successfully.",
            data: {
                userId,
                updatedFields: Object.keys(updatePayload),
                updates: updatePayload
            }
        };

    } catch (error) {
        console.error("Error in updateUserProfileByAdmin:", error);
        return {
            status: false,
            code: httpStatus.INTERNAL_SERVER_ERROR,
            msg: "An error occurred while updating user profile.",
            error: error.message
        };
    }
};


module.exports = updateUserProfileByAdmin;
