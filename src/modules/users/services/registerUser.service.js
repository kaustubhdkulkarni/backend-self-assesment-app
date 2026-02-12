const { db, sequelize, Op } = require("../../../db/db");
const otpServices = require("../../otps/services");
const civilExists = require("../../../utilities/civilExists");
const decryptPassword = require("../../../utilities/decryptPassword");
const { sendWelcomeEmailToUser } = require("../../../utilities/emailService");
const {
  residenceTypeOptions,
  gccCountryPhoneCodes,
  accountType,
  otpOnMobileSendCountryCodes,
} = require("../../../config/enums");
const logger = require("../../../config/logger");


const registerUser = async (body) => {
  try {

    // return {
    //     status: false,
    //     code: 200,
    //     msg: "The system is temporarily unavailable due to maintenance. We’ll be back online shortly. We appreciate your patience.",
    //   };

    if (!body?.phone || body.phone === undefined) {
      return {
        status: false,
        code: 400,
        msg: "Please register with valid Phone Number",
      };
    }
    if (!body?.email || body.email === undefined) {
      logger.warn(`Registration failed: Invalid email provided`);
      return {
        status: false,
        code: 400,
        msg: "Please register with valid email",
      };
    }

    if (body.civilNumber) {
      let checkCivilExist = await civilExists(body?.civilNumber, null);
      if (!checkCivilExist?.status) {
        return { status: false, code: 400, msg: checkCivilExist?.msg };
      }
    }

    const conditions = [
      { active: true },
      {
        [Op.or]: [
          // Same email and phone
          {
            [Op.and]: [
              { email: body.email },
              {
                [Op.or]: [
                  { phone: body.phone },
                  sequelize.where(
                    sequelize.fn("REPLACE", sequelize.col("phone"), "+", ""),
                    body.phone.replace("+", "")
                  ),
                ],
              },
            ],
          },
          // Same email but different phone
          {
            [Op.and]: [
              { email: body.email },
              {
                [Op.not]: {
                  [Op.or]: [
                    { phone: body.phone },
                    sequelize.where(
                      sequelize.fn("REPLACE", sequelize.col("phone"), "+", ""),
                      body.phone.replace("+", "")
                    ),
                  ],
                },
              },
            ],
          },
          {
            [Op.or]: [
              { phone: body.phone },
              sequelize.where(
                sequelize.fn("REPLACE", sequelize.col("phone"), "+", ""),
                body.phone.replace("+", "")
              ),
            ],
          },
          ...(body?.civilNumber ? [{ civilNumber: body.civilNumber }] : []),
        ],
      },
    ];

    const userExists = await db.Users.findAll({
      where: {
        [Op.and]: conditions,
      },
      raw: true,
    });

    if (userExists?.length > 0) {
      for (const user of userExists) {
        if (user.email === body.email) {
          logger.warn(`Registration failed: Email already exists - ${body.email}`);
          return {
            status: false,
            code: 400,
            msg: "An account with this email already exists.",
          };
        }
        if (user.phone?.replace("+", "") === body.phone?.replace("+", "")) {
          logger.warn(`Registration failed: Phone already exists - ${body.phone}`);
          return {
            status: false,
            code: 400,
            msg: "An account with this phone number already exists.",
          };
        }
        if (body.civilNumber && user.civilNumber === body.civilNumber) {
          logger.warn(`Registration failed: Civil number already exists - ${body.civilNumber}`);
          return {
            status: false,
            code: 400,
            msg: "An account with this civil number already exists.",
          };
        }
      }
    }

    let civilData = null;
  let getCivilData = null;
    const isOman =
      body?.country?.toLowerCase() === 'oman' ||
      body?.nationality?.toLowerCase() === 'oman' ||
      body?.countryCode === '+968'||
      body?.phone?.startsWith('+968') ||  // ✅ Check phone code
      body?.phone?.startsWith('968');     // ✅ Without + sign
      ;

    if (body.civilNumber && isOman && body.accountType === accountType.investor) {
      try {
        logger.info("Body: ", body);
         getCivilData = await getCivilDetails({
          civilNumber: body.civilNumber,
        });
        if (getCivilData?.status && getCivilData?.data) {
          civilData = getCivilData.data;
          logger.info(`Successfully fetched civil data for ${body?.email}`);
        } else {
          logger.error(`Civil data fetch failed for ${body?.email}: ${getCivilData?.msg || "Invalid civil data"}`);
        }
      } catch (err) {
        logger.error(`Error fetching civil data from Malaa API: for ${body?.email}`, err);
        // return {
        //   status: false,
        //   code: 500,
        //   msg: "Something went wrong while fetching civil data. Please contact support",
        // };
      }
    }

    let residenceIDType = residenceTypeOptions.RESIDENT_ID;

    if (civilData?.nationality?.toLowerCase().includes("omani")) {
      residenceIDType = residenceTypeOptions.NATIONAL_ID;
    }

    const nameMiddleParts = [
      civilData?.nameTwo,
      civilData?.nameThree,
      civilData?.nameFour,
      civilData?.nameFive,
    ].filter(Boolean);

    const decryptedPassword = await decryptPassword(body?.password);

    // Fixed data preparation with proper fallbacks
    const userData = {
      ...body,
      firstName: body?.firstName || civilData?.nameOne || "",
      middleName: body?.middleName || nameMiddleParts.join(" ") || "",
      lastName: body?.lastName || civilData?.nameSix || "",
      gender: body?.gender || civilData?.gender || null, // Fixed: use null instead of empty string
      dateOfBirth: body?.dateOfBirth || civilData?.dateOfBirth || null, // Fixed: use null instead of empty string
      password: decryptedPassword,
    };

    // ✅ Create new user
    let newUser;
    try {
      newUser = await db.Users.create(userData);
      logger.info(`User created successfully with ID: ${newUser.id}, email: ${body?.email}`);
    } catch (error) {
      logger.error(`Error creating user for ${body?.email}:`, error);
      return {
        status: false,
        code: 500,
        msg: "Error creating user account. Please try again.",
      };
    }

    // ✅ Create general information for investors
    if (newUser.accountType === accountType.investor) {
      const investorData = {
        residenceIDNumber: civilData?.civilNumber,
        residenceIDType,
        firstName: civilData?.nameOne || body?.firstName,
        middleName: nameMiddleParts.join(" ") || body?.middleName,
        lastName: civilData?.nameSix || body?.lastName,
        email: body?.email || null,
        contactNumber: body?.phone || null,
        gender:  civilData?.gender|| body?.gender  || null, // Fixed: consistent with user creation
        birthDate: civilData?.dateOfBirth || body?.dateOfBirth  || null, // Fixed: consistent with user creation
        nationality: civilData?.nationality,
        expiryDateOfID: civilData?.expiryDateOfID,
        birthPlace: civilData?.birthCountry,
        residenceCountry: civilData?.currentCountry,
        residenceIDCountry:  civilData?.nationality?.toLowerCase() ==="omani" ? "om" : null,
        occupation: civilData?.occupation,
        occupationEmploymentType: civilData?.occupationEmploymentType,
        userId: newUser.id,
        isGeneralInformationCompleted: civilData?.nationality ? true: false,
      };

        try {
    await db.GeneralInformations.create(investorData);
    logger.info(`General information added successfully for userId: ${newUser.id}`);
  } catch (error) {
    logger.error("Error while inserting general information directly:", error);
  }  
    //  await addInvestorGeneralInfo(newUser, investorData);
    }

    if (newUser) {
      const { dataValues } = newUser;

      let otpResults = null;
      let gccCountry = false;
      let otpCode= null
      if (
        otpOnMobileSendCountryCodes.some(
          (code) =>
            dataValues?.phone.startsWith(code) ||
            dataValues?.phone.startsWith("+" + code)
        ) 
      ) {
        let sendOtpToPhoneResult = await otpServices.sendOtpForVerification(
          dataValues?.phone,
          dataValues?.email
        );

        // ✔️ Remove OTP code only from the final response going to frontend



        if (!sendOtpToPhoneResult?.status) {
          if (sendOtpToPhoneResult?.data?.otpCode) {
    delete sendOtpToPhoneResult.data.otpCode;
  }
          return sendOtpToPhoneResult;
        }

        if (sendOtpToPhoneResult?.data?.otpCode) {
  otpCode= sendOtpToPhoneResult?.data?.otpCode
  delete sendOtpToPhoneResult.data.otpCode;
}
        gccCountry = true;
        otpResults = sendOtpToPhoneResult?.data;
      } 
      if(true) {
        let sendOTPToMailResult = await otpServices.sendOTPForVerificationEmail(
          dataValues?.email,
          otpCode
        );
        if (!sendOTPToMailResult?.status) {
          return sendOTPToMailResult;
        }
        otpResults =  otpResults ? otpResults: sendOTPToMailResult?.data;
      }
      if (!otpResults) {
        return {
          msg: "Something went wrong, please try again.",
          status: false,
          code: 400,
        };
      }
      const { password, ...userWithoutPassword } = dataValues;
      if (!userWithoutPassword?.isWelcomeEmailSent) {
        await db.Users.update(
          { isWelcomeEmailSent: true },
          { where: { id: userWithoutPassword?.id } }
        );
        await sendWelcomeEmailToUser({ userObj: userWithoutPassword });
      }
      return {
        data: otpResults?.user
          ? {
              user: userWithoutPassword,
              msg: `User registered successfully. ${otpResults?.msg}`,
            }
          : {
              user: userWithoutPassword,
              msg: `User registered successfully. ${otpResults}`,
            },
        status: true,
        code: 201,
      };
    } else {
      return {
        msg: "Something went wrong, please try again.",
        status: false,
        code: 400,
      };
    }
  } catch (error) {
    console.error("Error while adding User:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = registerUser;