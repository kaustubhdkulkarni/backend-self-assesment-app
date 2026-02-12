const httpStatus = require("http-status");
const tokenService = require("../tokens/tokens.services");
const userService = require("../users/services");
const otpServices = require("../otps/services");
const { tokenTypes } = require("../../config/tokens");
const ApiError = require("../../utilities/apiErrors");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { db, sequelize } = require("../../db/db");
const { Op, where, Sequelize } = require("sequelize");
const { roles } = require("../../config/enums");
const tokenServices = require("../tokens/tokens.services");
const { saveToken } = require("../tokens/tokens.services");
const {
  sendSignupEmailForBackofficeUsers,
  accountLockedMail,
} = require("../../utilities/emailService");
const decryptPassword = require("../../utilities/decryptPassword");
const EMAIL_JWT_EXPIRATION_MINUTES =
  process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || 60;

const renewToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );

    const user = await userService.getUserById(refreshTokenDoc.userId);

    if (!user) {
      throw new Error();
    }

    await db.Tokens.destroy({ where: { token: refreshToken } });

    // Generate new auth tokens (access and refresh tokens)
    const newTokens = await tokenService.generateAuthTokens(user);
    return newTokens;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

const registerAdmin = async ({ body }) => {
  try {
    let adminExists = await db.Users.findAll({
      where: { role: roles.superAdmin },
      raw: true,
    });
    if (adminExists?.length) {
      return {
        status: false,
        code: 400,
        msg: "Registration denied: An admin account already exists. Please contact support if you believe this is an error.",
      };
    }
    if (!body?.phone || body.phone === undefined) {
      return {
        status: false,
        code: 400,
        msg: "Please register with valid Phone Number",
      };
    }
    if (!body?.email || body.email === undefined) {
      return {
        status: false,
        code: 400,
        msg: "Please register with valid email",
      };
    }
    const userExists = await db.Users.findAll({
      where: {
        [Op.or]: [
          { email: body.email, active: true },
          { phone: body.phone, active: true },
          {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn("REPLACE", Sequelize.col("phone"), "+", ""),
                body.phone.replace("+", "")
              ),
              { active: true },
            ],
          },
        ],
      },
      raw: true,
    });

    if (userExists?.length > 1) {
      return {
        status: false,
        code: 400,
        msg: "We found multiple records for details provided.",
      };
    }

    let user = userExists[0];
    if (user) {
      return {
        status: false,
        code: 400,
        msg: "An account already exists with details given, please use a different details.",
      };
    }

    const newUser = await db.Users.create({
      ...body,
      isMobileVerified: true,
      isEmailVerified: true,
      role: roles.superAdmin,
    });

    if (newUser) {
      // let sendOtpResult = await otpServices.sendOtpForVerification(newUser.phone);
      // if (!sendOtpResult?.status) {
      // 	return sendOtpResult
      // }

      // let sendTokenResult = await tokenService.sendTokenForVerification(newUser);
      // if (!sendTokenResult?.status) {
      // 	return sendTokenResult
      // }

      const { dataValues } = newUser;
      const { password, ...userWithoutPassword } = dataValues;
      return {
        data: userWithoutPassword,
        status: true,
        code: 201,
      };
      // return {
      // 	data: sendOtpResult?.data?.user ? {
      // 		user: userWithoutPassword,
      // 		msg: `Admin registered successfully. ${sendOtpResult ? sendOtpResult?.data?.msg : ""} ${sendTokenResult ? sendTokenResult?.data : ""}`
      // 	}
      // 		: {
      // 			user: userWithoutPassword,
      // 			msg: `Admin registered successfully. ${sendOtpResult ? sendOtpResult?.data : ""} ${sendTokenResult ? sendTokenResult?.data : ""}`
      // 		},
      // 	status: true,
      // 	code: 201
      // }
    } else {
      return {
        msg: "Something went wrong, please try again.",
        status: false,
        code: 400,
      };
    }
  } catch (error) {
    console.error("Error while register admin:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const createBackofficeUser = async ({ body }) => {
  const transaction = await sequelize.transaction();
  try {
    const userExists = await db.Users.findAll({
      where: {
        [Op.or]: [
          { email: body.email, active: true },
          { phone: body.phone, active: true },
          {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn("REPLACE", Sequelize.col("phone"), "+", ""),
                body.phone.replace("+", "")
              ),
              { active: true },
            ],
          },
        ],
      },
      raw: true,
    });

    if (userExists?.length > 1) {
      await transaction.rollback(); // <--- FIXED: Close connection
      return {
        status: false,
        code: 400,
        msg: "We found multiple records for details provided.",
      };
    }

    let user = userExists[0];
    if (user) {
      await transaction.rollback(); // <--- FIXED: Close connection
      return {
        status: false,
        code: 400,
        msg: "An account already exists with details given, please use a different details.",
      };
    }

    const systemUserRole = await db.SystemUserRoles.findOne({
      where: { id: body?.systemUserRoleId },
    });

    if (!systemUserRole) {
      await transaction.rollback(); // <--- FIXED: Close connection
      return {
        status: false,
        code: 404,
        msg: "Role not found in the records.",
      };
    }

    const decryptedPassword = await decryptPassword(body?.password);

    const newUser = await db.Users.create(
      {
        ...body,
        password: decryptedPassword,
        isMobileVerified: true,
        isEmailVerified: true,
      },
      { transaction }
    );

    if (newUser) {
      const { dataValues } = newUser;
      const { password, ...userWithoutPassword } = dataValues;
      await sendSignupEmailForBackofficeUsers(
        userWithoutPassword,
        decryptedPassword
      );
      await transaction.commit();
      return {
        data: `System user registered successfully.`,
        status: true,
        code: 201,
      };
    } else {
      await transaction.rollback();
      return {
        msg: "Something went wrong, please try again.",
        status: false,
        code: 400,
      };
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error while register admin:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const updateSystemUserRole = async (roleId, modulePermissions) => {
  try {
    const role = await db.SystemUserRoles.findByPk(roleId);

    if (!role) {
      return {
        status: false,
        code: 404,
        msg: "Role not found",
      };
    }

    role.modulePermissions = modulePermissions;
    await role.save();

    return {
      status: true,
      code: 200,
      data: "Permissions updated successfully",
    };
  } catch (error) {
    console.error("Error updating system user role:", error);
    return {
      status: false,
      code: 500,
      msg: "Internal server error",
    };
  }
};

const loginAdmin = async ({ body }) => {
  try {
    if (!body?.email || body.email === undefined) {
      return {
        status: false,
        code: 400,
        msg: "Please register with valid email",
      };
    }
    const userExists = await db.Users.scope("withPassword").findAll({
      where: {
        [Op.or]: [{ email: body.email, active: true }],
      },
      include: [
        {
          model: db.SubRoles,
          as: "subRoleObj",
          attributes: ["subRoleName"],
          require: false,
        },
        {
          model: db.SystemUserRoles,
          as: "systemUserRoleObj",
          attributes: ["id", "systemUserRoleName", "modulePermissions"],
          required: false,
        },
      ],
    });
    if (userExists?.length > 1) {
      return {
        status: false,
        code: 400,
        msg: "We found multiple records for details provided.",
      };
    }
    let user = userExists[0];
    if (!user) {
      return {
        msg: `User with email ${body?.email} not found`,
        status: false,
        code: 404,
      };
    }

    if (!user?.phone || user.phone === undefined) {
      return {
        status: false,
        code: 400,
        msg: "Phone number not exists for this account.",
      };
    }

    if (user?.isAccountLocked) {
      return {
        status: false,
        code: 400,
        msg: user?.accountLockingReason,
      };
    }

    const decryptedPassword = await decryptPassword(body?.password);
    let matchPassword = await bcrypt.compare(decryptedPassword, user?.password);

    if (!matchPassword) {
      if (user?.role === roles?.admin || user?.role === roles?.backofficeUser) {
        if (user?.loginAttempts >= process.env.MAX_LOGIN_ATTENPT) {
          return {
            status: false,
            code: 400,
            msg: user?.accountLockingReason,
          };
        } else {
          await db.Users.increment(
            { loginAttempts: 1 },
            { where: { id: user?.id } }
          );

          if (user?.loginAttempts + 1 >= process.env.MAX_LOGIN_ATTENPT) {
            let lockTime = moment()
              .add(Number(process.env.LOCKING_PERIOD_IN_DAYS), "days")
              .toDate();
            let updatedUser = await user.update({
              isAccountLocked: true,
              lockedUntil: lockTime,
              accountLockingReason: `Your account has been locked after multiple failed login attempts. Please wait until ${moment(
                lockTime
              ).format("lll")} or contact support to regain access.`,
            });
            await accountLockedMail(updatedUser);

            return {
              status: false,
              code: 400,
              msg: updatedUser?.accountLockingReason,
            };
          }
        }
      }
      return { status: false, code: 400, msg: "Unable to login" };
    }

    if (
      user?.role !== roles.superAdmin &&
      user?.role !== roles?.admin &&
      user?.role !== roles?.backofficeUser
    ) {
      return {
        status: false,
        code: 401,
        msg: "This account don't have required rights.",
      };
    }
    if (user?.loginAttempts) {
      await user.update({
        loginAttempts: 0,
        isAccountLocked: false,
        lockedUntil: null,
        accountLockingReason: "",
      });
    }

    // const { password, ...userWithoutPassword } = user;  // Destructure to exclude password
    delete user?.dataValues?.password;
    const tokens = await tokenService.generateAuthTokens(user);
    return { data: { user: user, tokens }, status: true, code: 200 };
  } catch (error) {
    console.error("Error while login admin or backoffice user:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const verifyEmail = async (token) => {
  try {
    if (!token || token === undefined) {
      return { msg: "Invalid verification link.", status: false, code: 400 };
    }
    let tokenResult = await db.Tokens.findOne({
      where: {
        token,
        type: tokenTypes.VERIFY_EMAIL,
        expires: { [Op.gt]: new Date() }, // Ensure token has not expired
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (!tokenResult) {
      return {
        msg: "Verification link is invalid or expired.",
        status: false,
        code: 400,
      };
    }

    let verifyEmailToken = await tokenService.verifyToken(
      tokenResult.token,
      tokenResult.type
    );

    if (!verifyEmailToken?.dataValues) {
      return verifyEmailToken;
    }

    let checkUser = await db.Users.findOne({
      where: { id: tokenResult?.userId },
    });

    if (!checkUser) {
      return {
        msg: "User not found",
        status: false,
        code: 404,
      };
    }

    await checkUser.update({ isEmailVerified: true });

    await db.Tokens.destroy({
      where: {
        userId: checkUser.id,
        type: tokenTypes.VERIFY_EMAIL,
      },
    });

    return {
      data: "Email verified successfully.",
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error in verifyEmail service:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const resendVerificationEmail = async (token) => {
  try {
    if (!token || token === undefined) {
      return { msg: "Token is required.", status: false, code: 400 };
    }
    let tokenResult = await db.Tokens.findOne({
      where: {
        token,
        type: tokenTypes.VERIFY_EMAIL,
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (!tokenResult) {
      return {
        msg: "Token is not valid.",
        status: false,
        code: 400,
      };
    }

    if (tokenResult && tokenResult.expires > new Date()) {
      return {
        msg: "Token is already valid.",
        status: false,
        code: 400,
      };
    }

    const user = await db.Users.findOne({
      where: {
        id: tokenResult.userId,
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const sendEmailResponse = await tokenServices.sendTokenForVerification(
      user
    );
    if (sendEmailResponse.status && sendEmailResponse.code === 200) {
      return {
        data: "Verification email sent successfully!",
        status: true,
        code: 200,
      };
    }
  } catch (error) {
    console.error("Error in verifyEmail service:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const forgotPassword = async (email) => {
  try {
    if (!email || email === undefined) {
      return {
        status: false,
        code: 400,
        msg: "Please enter valid email",
      };
    }

    const user = await db.Users.findOne({ where: { email } });

    if (!user) {
      return {
        status: false,
        code: 400,
        msg: "No user found with the provided email address.",
      };
    }

    if (user.isAccountLocked === true) {
      return {
        status: false,
        code: 400,
        msg: "Your account is blocked. please contact to support.",
      };
    }

    const resetToken = await tokenServices.generateForgotPasswordToken(user);

    if (resetToken.status && resetToken.code === 200) {
      return {
        status: true,
        code: 200,
        data: resetToken?.data,
      };
    }

    if (!resetToken.status && resetToken.code === 400) {
      return {
        status: false,
        code: 400,
        msg: resetToken?.msg,
      };
    }
  } catch (error) {
    console.error("Error while sending email:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const verifyForgotPasswordToken = async (token) => {
  try {
    if (!token || token === undefined) {
      return { msg: "Invalid verification link.", status: false, code: 400 };
    }
    let tokenResult = await db.Tokens.findOne({
      where: {
        token: token,
        type: tokenTypes.RESET_PASSWORD,
        expires: { [Op.gt]: new Date() },
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (!tokenResult) {
      return {
        msg: "Verification link is invalid or expired.",
        status: false,
        code: 400,
      };
    }
    let verifFotgotToken = await tokenService.verifyToken(
      tokenResult.token,
      tokenResult.type
    );

    if (!verifFotgotToken?.dataValues) {
      return {
        msg:
          verifFotgotToken.msg ||
          "Verification failed. Invalid or expired token.",
        status: false,
        code: verifFotgotToken.code || 401,
      };
    }

    return {
      data: "Forgot token verified successfully.",
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error in verified Forgot token service:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const resetUserPassword = async ({ token, password }) => {
  const transaction = await sequelize.transaction();

  try {
    if (!token || token === undefined) {
      await transaction.rollback(); // <--- FIXED: Close connection
      return { msg: "Invalid verification link.", status: false, code: 400 };
    }
    let tokenResult = await db.Tokens.findOne({
      where: {
        token: token,
        type: tokenTypes.RESET_PASSWORD,
        expires: { [Op.gt]: new Date() },
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (!tokenResult) {
      await transaction.rollback(); // <--- FIXED: Close connection
      return {
        msg: "Verification link is invalid or expired.",
        status: false,
        code: 400,
      };
    }

    let verifiedForgotToken = await tokenService.verifyToken(
      tokenResult.token,
      tokenResult.type
    );

    if (!verifiedForgotToken?.dataValues) {
      await transaction.rollback(); // <--- FIXED: Close connection
      return { msg: "Invalid token.", status: false, code: 400 };
    }

    const userId = verifiedForgotToken?.dataValues?.userId;

    const user = await db.Users.scope("withPassword").findOne({
      where: { id: userId, active: true },
    });

    if (!user) {
      await transaction.rollback(); // <--- FIXED: Close connection
      return { msg: "User not found.", status: false, code: 404 };
    }

    const decryptedPassword = await decryptPassword(password);
    user.password = decryptedPassword;

    await user.save({ transaction });

    await db.Tokens.destroy({
      where: { token: token },
      transaction,
    });

    await transaction.commit();

    return {
      data: "Password reset successfully.",
      status: true,
      code: 200,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error in reset user password service:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

const getAdminDetails = async () => {
  try {
    let adminDetails = await db.Users.findOne({
      where: { role: roles?.superAdmin },
    });

    if (!adminDetails) {
      return {
        status: false,
        code: 404,
        msg: "No admin account found. Please contact support or try again later.",
      };
    }

    return {
      status: true,
      code: 200,
      data: adminDetails,
    };
  } catch (error) {
    console.error("Error while fetching admin details:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = {
  renewToken,
  registerAdmin,
  loginAdmin,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  verifyForgotPasswordToken,
  resetUserPassword,
  createBackofficeUser,
  updateSystemUserRole,
  getAdminDetails,
};