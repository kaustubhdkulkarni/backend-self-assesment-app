const httpStatus = require("http-status");
const catchAsync = require("../../utilities/catchAsync");
const sendResponse = require("../../utilities/responseHandler");
const authService = require("./auth.services");
const pick = require("../../utilities/pick");

const renewToken = catchAsync(async (req, res) => {
  let { refreshToken = "" } = await pick(req?.body, ["refreshToken"]);

  let tokens = await authService.renewToken(refreshToken);
  res.send({ ...tokens });
});

const registerAdmin = catchAsync(async (req, res) => {
  let body = req?.body || {};

  let addResult = await authService.registerAdmin({ body });

  if (addResult?.status) {
    sendResponse(
      res,
      addResult?.code == 201 ? httpStatus.CREATED : httpStatus.OK,
      addResult?.data,
      null
    );
  } else {
    sendResponse(
      res,
      addResult?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : addResult?.code == 401
        ? httpStatus.UNAUTHORIZED
        : addResult?.code == 404
        ? httpStatus.NOT_FOUND
        : httpStatus.BAD_REQUEST,
      null,
      addResult?.msg
    );
  }
});

const createBackofficeUser = catchAsync(async (req, res) => {
  let body = req?.body || {};

  let addResult = await authService.createBackofficeUser({ body });

  if (addResult?.status) {
    sendResponse(
      res,
      addResult?.code == 201 ? httpStatus.CREATED : httpStatus.OK,
      addResult?.data,
      null
    );
  } else {
    sendResponse(
      res,
      addResult?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : addResult?.code == 401
        ? httpStatus.UNAUTHORIZED
        : addResult?.code == 404
        ? httpStatus.NOT_FOUND
        : httpStatus.BAD_REQUEST,
      null,
      addResult?.msg
    );
  }
});

const updateSystemUserRole = catchAsync(async (req, res) => {
  const { roleId } = req.params;
  const { modulePermissions } = req.body;

  const updateResult = await authService.updateSystemUserRole(
    roleId,
    modulePermissions
  );

  if (updateResult?.status) {
    sendResponse(res, httpStatus.OK, updateResult?.data, null);
  } else {
    sendResponse(
      res,
      updateResult?.code === 404
        ? httpStatus.NOT_FOUND
        : updateResult?.code === 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : httpStatus.BAD_REQUEST,
      null,
      updateResult?.msg
    );
  }
});

const loginAdmin = catchAsync(async (req, res) => {
  let body = req?.body || {};

  let loginResult = await authService.loginAdmin({ body });

  if (loginResult?.status) {
    sendResponse(res, httpStatus.OK, loginResult?.data, null);
  } else {
    sendResponse(
      res,
      loginResult?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : loginResult?.code == 404
        ? httpStatus.NOT_FOUND
        : loginResult?.code == 401
        ? httpStatus.UNAUTHORIZED
        : httpStatus.BAD_REQUEST,
      null,
      loginResult?.msg
    );
  }
});

const verifyEmailController = async (req, res) => {
  const { token } = req.query;

  const result = await authService.verifyEmail(token);
  if (result?.status) {
    sendResponse(res, httpStatus.OK, result?.data, null);
  } else {
    sendResponse(
      res,
      result?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : result?.code == 404
        ? httpStatus.NOT_FOUND
        : result?.code == 401
        ? httpStatus.UNAUTHORIZED
        : httpStatus.BAD_REQUEST,
      null,
      result?.msg
    );
  }
};
const resendEmailController = async (req, res) => {
  const { token } = req.body;

  const result = await authService.resendVerificationEmail(token);
  if (result?.status) {
    sendResponse(res, httpStatus.OK, result?.data, null);
  } else {
    sendResponse(
      res,
      result?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : result?.code == 404
        ? httpStatus.NOT_FOUND
        : result?.code == 401
        ? httpStatus.UNAUTHORIZED
        : httpStatus.BAD_REQUEST,
      null,
      result?.msg
    );
  }
};

const forgotPassword = catchAsync(async (req, res) => {
  let email = req?.body?.email;
  let addResult = await authService.forgotPassword(email);
  if (addResult?.status) {
    sendResponse(
      res,
      addResult?.code == 201 ? httpStatus.CREATED : httpStatus.OK,
      addResult?.data,
      null
    );
  } else {
    sendResponse(
      res,
      addResult?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : addResult?.code == 401
        ? httpStatus.UNAUTHORIZED
        : addResult?.code == 404
        ? httpStatus.NOT_FOUND
        : httpStatus.BAD_REQUEST,
      null,
      addResult?.msg
    );
  }
});

const verifyForgotPasswordToken = catchAsync(async (req, res) => {
  const { token } = pick(req.params, ["token"]);
  let result = await authService.verifyForgotPasswordToken(token);

  if (result?.status) {
    sendResponse(res, httpStatus.OK, result?.data, null);
  } else {
    sendResponse(
      res,
      result?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : result?.code == 404
        ? httpStatus.NOT_FOUND
        : result?.code == 401
        ? httpStatus.UNAUTHORIZED
        : httpStatus.BAD_REQUEST,
      null,
      result?.msg
    );
  }
});

const resetUserPassword = catchAsync(async (req, res) => {
  const { token } = pick(req.params, ["token"]);
  const { password } = pick(req.body, ["password"]);

  let updateResult = await authService.resetUserPassword({ token, password });

  if (updateResult?.status) {
    sendResponse(res, httpStatus.OK, updateResult?.data, null);
  } else {
    sendResponse(
      res,
      updateResult?.code == 500
        ? httpStatus.INTERNAL_SERVER_ERROR
        : updateResult?.code == 404
        ? httpStatus.NOT_FOUND
        : updateResult?.code == 401
        ? httpStatus.UNAUTHORIZED
        : updateResult?.code == 403
        ? httpStatus.FORBIDDEN
        : httpStatus.BAD_REQUEST,
      null,
      updateResult?.msg
    );
  }
});

module.exports = {
  renewToken,
  registerAdmin,
  loginAdmin,
  verifyEmailController,
  resendEmailController,
  forgotPassword,
  verifyForgotPasswordToken,
  resetUserPassword,
  createBackofficeUser,
  updateSystemUserRole,
};
