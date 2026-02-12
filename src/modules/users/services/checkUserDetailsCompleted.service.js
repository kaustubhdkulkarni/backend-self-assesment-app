const { db } = require("../../../db/db");
const { subRoles, accountType } = require("../../../config/enums");

const checkUserDetailsCompleted = async (userId) => {
  try {
    const foundUser = await db.Users.findOne({
      where: { active: true, id: userId },
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
        msg: "User Not Found",
        status: false,
        code: 404,
      };
    }

    let totalSections = 0;
    let completedSections = 0;

    const subRoleName = foundUser?.subRoleObj?.subRoleName;

    if (foundUser?.accountType === accountType.fundraiser) {
      const generalInfo = await db.GeneralInformations.findOne({
        where: { userId },
      });
      totalSections++;
      if (generalInfo?.isGeneralInformationCompleted) completedSections++;

      const contactDetails = await db.ContactDetails.findOne({
        where: { userId },
      });
      totalSections++;
      if (contactDetails?.isContactDetailsCompleted) completedSections++;

      const financialDetails = await db.FinancialDetails.findOne({
        where: { userId },
      });
      totalSections++;
      if (financialDetails?.isFinancialDetailCompleted) completedSections++;

      const commercialInfo = await db.CommercialInformation.findOne({
        where: { userId },
      });
      totalSections++;
      if (commercialInfo?.isCommercialInfoCompleted) completedSections++;

      const bankDetails = await db.BankDetails.findOne({
        where: { userId },
      });
      totalSections++;
      if (bankDetails?.isBankDetailCompleted) completedSections++;

      const companyManagement = await db.CompanyManagement.findOne({
        where: { userId },
      });
      totalSections++;
      if (companyManagement?.isCompanyManagementCompleted) completedSections++;

      const uploadDocument = await db.Documents.findOne({
        where: { userId },
      });
      totalSections++;
      if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
    }

    if (subRoleName === subRoles?.regularInvestor) {
      const generalInfo = await db.GeneralInformations.findOne({
        where: { userId },
      });
      totalSections++;
      if (generalInfo?.isGeneralInformationCompleted) completedSections++;

      const contactDetails = await db.ContactDetails.findOne({
        where: { userId },
      });
      totalSections++;
      if (contactDetails?.isContactDetailsCompleted) completedSections++;

      const uploadDocument = await db.Documents.findOne({
        where: { userId },
      });
      totalSections++;
      if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
    }

    if (subRoleName === subRoles?.businessInvestor) {
      const generalInfo = await db.GeneralInformations.findOne({
        where: { userId },
      });
      totalSections++;
      if (generalInfo?.isGeneralInformationCompleted) completedSections++;

      const contactDetails = await db.ContactDetails.findOne({
        where: { userId },
      });
      totalSections++;
      if (contactDetails?.isContactDetailsCompleted) completedSections++;

      const ownershipDetails = await db.OwnershipDetails.findOne({
        where: { userId },
      });
      totalSections++;
      if (ownershipDetails?.isOwnershipInformationCompleted)
        completedSections++;

      const uploadDocument = await db.Documents.findOne({
        where: { userId },
      });
      totalSections++;
      if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
    }

    if (subRoleName === subRoles?.sophisticatedInvestor) {
      const generalInfo = await db.GeneralInformations.findOne({
        where: { userId },
      });
      totalSections++;
      if (generalInfo?.isGeneralInformationCompleted) completedSections++;

      const contactDetails = await db.ContactDetails.findOne({
        where: { userId },
      });
      totalSections++;
      if (contactDetails?.isContactDetailsCompleted) completedSections++;

      const uploadDocument = await db.Documents.findOne({
        where: { userId },
      });
      totalSections++;
      if (uploadDocument?.isDocumentsUploadCompleted) completedSections++;
    }

    const completionPercentage =
      totalSections > 0
        ? Math.round((completedSections / totalSections) * 100)
        : 0;

    if (completionPercentage < 100) {
      return {
        msg: "This user profile details not completed.",
        status: false,
        code: 400,
      };
    }

    const userKYC = await db.KYC.findOne({ where: { userId } });

    let isKYCDone = false;

    if (
      foundUser?.accountType === accountType?.investor &&
      (foundUser?.subRoleObj?.subRoleName === subRoles?.regularInvestor ||
        foundUser?.subRoleObj?.subRoleName ===
          subRoles?.sophisticatedInvestor) &&
      userKYC?.isMalaasKYCVerified &&
      userKYC?.isSmileIDKYCVerified &&
      foundUser?.isKycVerified
    ) {
      isKYCDone = true;
    }

    if (
      ((foundUser?.accountType === accountType?.investor &&
        foundUser?.subRoleObj?.subRoleName === subRoles?.businessInvestor) ||
        foundUser?.accountType === accountType?.fundraiser) &&
      foundUser?.isKybVerified
    ) {
      isKYCDone = true;
    }

    if (!isKYCDone) {
      return {
        msg: "This user KYC not completed.",
        status: false,
        code: 400,
      };
    }

    return {
      status: true,
      code: 200,
      data: "User is valid.",
    };
  } catch (error) {
    console.error("Error while getting user profile completion status:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = checkUserDetailsCompleted;
