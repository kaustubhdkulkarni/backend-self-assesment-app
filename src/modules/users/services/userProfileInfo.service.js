const { db } = require("../../../db/db");
const { subRoles, accountType } = require("../../../config/enums");

const userProfileInfo = async (user) => {
    try {
        const foundUser = await db.Users.findOne({
            where: { active: true, id: user?.id },
            include: [
                {
                    model: db.SubRoles,
                    as: "subRoleObj",
                    attributes: ["subRoleName"],
                    required: false,
                },
            ],
        });

        if (!foundUser) {
            return {
                data: "User Not Found",
                status: false,
                code: 404,
            };
        }

        let totalSections = 0;
        let completedSections = 0;

        const subRoleName = foundUser?.subRoleObj?.subRoleName;

        if (foundUser?.accountType === accountType.fundraiser) {
            const generalInfo = await db.GeneralInformations.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (generalInfo?.isGeneralInformationCompleted) completedSections++;

            const contactDetails = await db.ContactDetails.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (contactDetails?.isContactDetailsCompleted) completedSections++;

            const financialDetails = await db.FinancialDetails.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (financialDetails?.isFinancialDetailCompleted)
                completedSections++;

            const commercialInfo = await db.CommercialInformation.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (commercialInfo?.isCommercialInfoCompleted) completedSections++;

            const bankDetails = await db.BankDetails.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (bankDetails?.isBankDetailCompleted) completedSections++;

            const companyManagement = await db.CompanyManagement.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (companyManagement?.isCompanyManagementCompleted)
                completedSections++;

            const uploadDocument = await db.Documents.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
        }

        if (subRoleName === subRoles?.regularInvestor) {
            const generalInfo = await db.GeneralInformations.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (generalInfo?.isGeneralInformationCompleted) completedSections++;

            const contactDetails = await db.ContactDetails.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (contactDetails?.isContactDetailsCompleted) completedSections++;

            const uploadDocument = await db.Documents.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
        }

        if (subRoleName === subRoles?.businessInvestor) {
            const generalInfo = await db.GeneralInformations.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (generalInfo?.isGeneralInformationCompleted) completedSections++;

            const contactDetails = await db.ContactDetails.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (contactDetails?.isContactDetailsCompleted) completedSections++;

            const ownershipDetails = await db.OwnershipInformation.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (ownershipDetails?.isOwnershipInformationCompleted)
                completedSections++;

            const uploadDocument = await db.Documents.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
        }

        if (subRoleName === subRoles?.sophisticatedInvestor) {
            const generalInfo = await db.GeneralInformations.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (generalInfo?.isGeneralInformationCompleted) completedSections++;

            const contactDetails = await db.ContactDetails.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (contactDetails?.isContactDetailsCompleted) completedSections++;

            const uploadDocument = await db.Documents.findOne({
                where: { userId: user?.id },
            });
            totalSections++;
            if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
        }

        const completionPercentage =
            totalSections > 0
                ? Math.round((completedSections / totalSections) * 100)
                : 0;

        return {
            data: {
                userId: user?.id,
                subRoleName,
                profileCompletionPercentage: completionPercentage,
            },
            status: true,
            code: 200,
        };
    } catch (error) {
        console.error("Error while getting user profile info:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = userProfileInfo;
