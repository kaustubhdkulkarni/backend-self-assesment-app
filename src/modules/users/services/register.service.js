const { db, sequelize, Op } = require("../../../db/db");
const otpServices = require("../../otps/services");
const civilExists = require("../../../utilities/civilExists");
const decryptPassword = require("../../../utilities/decryptPassword");
const { sendWelcomeEmailToUser } = require("../../../utilities/emailService");
const {
  residenceTypeOptions,
  accountType,
  otpOnMobileSendCountryCodes,
} = require("../../../config/enums");
const logger = require("../../../config/logger");


const registerUser = async (body) => {
  try {
    logger.info(`Registration attempt for email: ${body?.email}, phone: ${body?.phone}`);



  //  return {
  //       status: false,
  //       code: 200,
  //       msg: "The system is temporarily unavailable due to maintenance. We’ll be back online shortly. We appreciate your patience.",
  //     };

    // ✅ Validate phone number
    if (!body?.phone || body.phone === undefined) {
      logger.warn(`Registration failed: Invalid phone number for email ${body?.email}`);
      return {
        status: false,
        code: 400,
        msg: "Please register with valid Phone Number",
      };
    }

    // ✅ Validate email
    if (!body?.email || body.email === undefined) {
      logger.warn(`Registration failed: Invalid email provided`);
      return {
        status: false,
        code: 400,
        msg: "Please register with valid email",
      };
    }

    // ✅ Check civil number existence
    if (body.civilNumber) {
      try {
        let checkCivilExist = await civilExists(body?.civilNumber, null);
        if (!checkCivilExist?.status) {
          logger.warn(`Civil number check failed for ${body?.email}: ${checkCivilExist?.msg}`);
          return { status: false, code: 400, msg: checkCivilExist?.msg };
        }
      } catch (error) {
        logger.error(`Error checking civil number existence for ${body?.email}:`, error);
        return {
          status: false,
          code: 500,
          msg: "Error validating civil number. Please try again.",
        };
      }
    }

    // ✅ Check for existing users
    const conditions = [
      { active: true },
      {
        [Op.or]: [
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

    let userExists;
    try {
      userExists = await db.Users.findAll({
        where: { [Op.and]: conditions },
        raw: true,
      });
    } catch (error) {
      logger.error(`Database error checking user existence for ${body?.email}:`, error);
      return {
        status: false,
        code: 500,
        msg: "Database error. Please try again.",
      };
    }

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

    // ✅ Check if user is from Oman
    let civilData = null;

    
    let getCivilData = null;
    const isOman =
      body?.country?.toLowerCase() === "oman" ||
      body?.nationality?.toLowerCase() === "oman" ||
      body?.countryCode === "+968" ||
      body?.phone?.startsWith("+968") ||
      body?.phone?.startsWith("968");

    // ✅ Fetch civil details for Omani investors
  


 



    // ✅ Decrypt password
    let decryptedPassword;
    try {
      decryptedPassword = await decryptPassword(body?.password);
    } catch (error) {
      logger.error(`Error decrypting password for ${body?.email}:`, error);
      return {
        status: false,
        code: 500,
        msg: "Error processing password. Please try again.",
      };
    }

    // ✅ Prepare user data
    const userData = {
      ...body,
      firstName: body?.firstName || firstName || "",
      middleName: body?.middleName || middleName || "",
      lastName: body?.lastName || lastName || "",
      gender: body?.gender || civilData?.gender || null,
      dateOfBirth: body?.dateOfBirth || civilData?.dateOfBirth || null,
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
        firstName: malaaHasName ? firstName : (body?.firstName || ""),
        middleName: malaaHasName ? middleName : (body?.middleName || ""),
        lastName: malaaHasName ? lastName : (body?.lastName || ""),
        gender:  civilData?.gender  || body?.gender ||  null,
        dateOfBirth:  civilData?.dateOfBirth  || body?.dateOfBirth  || null,
        nationality: civilData?.nationality,
        expiryDateOfID: civilData?.expiryDateOfID,
        birthCountry: civilData?.birthCountry,
        currentCountry: civilData?.currentCountry,
        occupation: civilData?.occupation,
        occupationEmploymentType: civilData?.occupationEmploymentType,
        userId: newUser.id,
        isGeneralInformationCompleted: civilData?.nationality ?true: false,
      };

      try {
        await db.GeneralInformations.create(investorData, { validate: false });
        logger.info(`General information added successfully for userId: ${newUser.id}`);
      } catch (error) {
        logger.error(`Error creating general information for userId ${newUser.id}:`, error);
        // Continue registration even if general info creation fails
      }
    }

    if (newUser) {
      const { dataValues } = newUser;

      // ✅ Send OTP
      let otpResults = null;
      let gccCountry = false;
      let otpCode = null;

      try {
        if (
          otpOnMobileSendCountryCodes.some(
            (code) =>
              dataValues?.phone.startsWith(code) ||
              dataValues?.phone.startsWith("+" + code)
          )
        ) {
          logger.info(`Sending OTP to phone for user: ${dataValues?.email}`);
          let sendOtpToPhoneResult = await otpServices.sendOtpForVerification(
            dataValues?.phone,
            dataValues?.email
          );
          if (!sendOtpToPhoneResult?.status) {
            if (sendOtpToPhoneResult?.data?.otpCode) {
            delete sendOtpToPhoneResult.data.otpCode;
        }
            logger.error(`Failed to send OTP to phone for ${dataValues?.email}: ${sendOtpToPhoneResult?.msg}`);
            return sendOtpToPhoneResult;
          }

            if (sendOtpToPhoneResult?.data?.otpCode) {
          otpCode = sendOtpToPhoneResult.data.otpCode;
          delete sendOtpToPhoneResult.data.otpCode;
      }

          gccCountry = true;
          otpResults = sendOtpToPhoneResult?.data;
          logger.info(`OTP sent successfully to phone for ${dataValues?.email}`);
        } 
        if(true) {
          logger.info(`Sending OTP to email for user: ${dataValues?.email}`);
          let sendOTPToMailResult = await otpServices.sendOTPForVerificationEmail(
            dataValues?.email,
             otpCode
          );
          if (!sendOTPToMailResult?.status) {
            logger.error(`Failed to send OTP to email for ${dataValues?.email}: ${sendOTPToMailResult?.msg}`);
            return sendOTPToMailResult;
          }
          otpResults = otpResults ? otpResults: sendOTPToMailResult?.data;
          logger.info(`OTP sent successfully to email for ${dataValues?.email}`);
        }
      } catch (error) {
        logger.error(`Error sending OTP for ${dataValues?.email}:`, error);
        return {
          status: false,
          code: 500,
          msg: "Error sending verification code. Please try again.",
        };
      }

      if (!otpResults) {
        logger.error(`OTP results are null for ${dataValues?.email}`);
        return {
          msg: "Something went wrong, please try again.",
          status: false,
          code: 400,
        };
      }

      // ✅ Remove password from response
      const { password, ...userWithoutPassword } = dataValues;

      // ✅ Send welcome email
      if (!userWithoutPassword?.isWelcomeEmailSent) {
        try {
          await db.Users.update(
            { isWelcomeEmailSent: true },
            { where: { id: userWithoutPassword?.id } }
          );
          await sendWelcomeEmailToUser({ userObj: userWithoutPassword });
          logger.info(`Welcome email sent successfully to ${userWithoutPassword?.email}`);
        } catch (error) {
          logger.error(`Error sending welcome email to ${userWithoutPassword?.email}:`, error);
          // Continue registration even if welcome email fails
        }
      }

      logger.info(`User registration completed successfully for ${userWithoutPassword?.email}`);
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
      logger.error(`User object is null after creation for ${body?.email}`);
      return {
        msg: "Something went wrong, please try again.",
        status: false,
        code: 400,
      };
    }
  } catch (error) {
    logger.error(`Unexpected error during user registration for ${body?.email}:`, error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = registerUser;
