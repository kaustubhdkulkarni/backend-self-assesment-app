const { subRoles, accountType } = require("../../../config/enums");
const { db } = require("../../../db/db");

const getUserByIdForAdmin = async (userId) => {
  try {
    const userList = await db.Users.findAll({
      where: {
        id: userId,
        // role: "user"
      },
      include: [
        {
          model: db.SubRoles,
          as: "subRoleObj",
          attributes: ["id", "subRoleName"],
          required: false,
        },
        {
          model: db.SystemUserRoles,
          as: "systemUserRoleObj",
          attributes: ["id", "systemUserRoleName", "modulePermissions"],
          required: false,
        },
         {
          model: db.KYC,
          as: "kycDetailObj",
          attributes: [
            "id",
            "isMalaasKYCVerified",
            "isSmileIDKYCVerified",
            "isManualKYCVerified",
            "civilNumber",
            "kycType"
          ],
          required: false,
        },
      ],
    });

     const processedUserList = userList.map(user => {
      const userJson = user.toJSON();
      
      // Check if user is a regular or sophisticated investor
      const isEligibleInvestor = 
        userJson?.accountType === accountType?.investor && 
        (
          userJson?.subRoleObj?.subRoleName === subRoles.regularInvestor ||
          userJson?.subRoleObj?.subRoleName === subRoles.sophisticatedInvestor
        );

      if (isEligibleInvestor && userJson.kycDetailObj) {
        const kycDetail = userJson.kycDetailObj;
        
        // Add Malaas KYC automatic verification flag
        // Condition: isMalaasKYCVerified is true AND isManualKYCVerified is false
        userJson.kycDetailObj.isMalaasKYCAutomaticVerified = 
          kycDetail.isMalaasKYCVerified === true && 
          kycDetail.isManualKYCVerified === false;

        // Add SmileID KYC automatic verification flag
        // Condition: isSmileIDKYCVerified is true AND isManualKYCVerified is false
        userJson.kycDetailObj.isSmileIDKYCAutomaticVerified  = 
          kycDetail.isSmileIDKYCVerified === true && 
          kycDetail.isManualKYCVerified === false;
      }

      return userJson;
    });

    return {
      data: processedUserList,
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error while getting users:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = getUserByIdForAdmin;
