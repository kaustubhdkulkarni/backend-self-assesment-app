const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utilities/apiErrors");
const { roleRights, roles } = require("../config/enums");
const logger = require("../config/logger");

const verifyCallback =
  (
    req,
    resolve,
    reject,
    requiredRights,
    requiredModuleKey,
    requiredPermissionType
  ) =>
  async (err = "", user, info = "") => {
    if (err || info || !user) {
      logger.error("Authentication error:", err || info);
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }

    req.user = user;
    if (requiredRights.length) {
      const userRights = roleRights.get(user?.role);
      if (!userRights) {
        logger.error("Role rights not defined for role:", user?.role);
        return reject(
          new ApiError(httpStatus.FORBIDDEN, "Role rights not defined")
        );
      }

      if (!Array.isArray(requiredRights)) {
        requiredRights = requiredRights ? [requiredRights] : [];
      }

      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );

      if (!hasRequiredRights) {
        logger.error(
          "This account don't have required rights or user mismatch:",
          {
            requiredRights,
            userRights,
            userId: user?.d,
            userIdFromToken: user?.id,
          }
        );
        return reject(
          new ApiError(
            httpStatus.FORBIDDEN,
            "This account don't have required rights or user mismatch"
          )
        );
      }
    }

    if (requiredModuleKey && user.role !== roles.superAdmin) {
      try {
        const modulePermissions =
          typeof user.modulePermissions === "string"
            ? JSON.parse(user.modulePermissions)
            : user.modulePermissions;

        const modulePerm = modulePermissions?.[requiredModuleKey];

        if (
          !modulePerm ||
          typeof modulePerm !== "object" ||
          modulePerm[requiredPermissionType] !== true
        ) {
          logger.error("Permission denied on module", {
            module: requiredModuleKey,
            permissionType: requiredPermissionType,
            user: user?.id,
            modulePerm,
          });
          return reject(
            new ApiError(
              httpStatus.FORBIDDEN,
              `No ${requiredPermissionType} access to ${requiredModuleKey} module`
            )
          );
        }
      } catch (parseErr) {
        logger.error(
          "Failed to parse modulePermissions:",
          user.modulePermissions
        );
        return reject(
          new ApiError(
            httpStatus.BAD_REQUEST,
            "Invalid modulePermissions format"
          )
        );
      }
    }

    resolve();
  };

const auth =
  (
    requiredRights = [],
    requiredModuleKey = null,
    requiredPermissionType = "main"
  ) =>
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        passport.authenticate(
          "jwt",
          { session: false },
          verifyCallback(
            req,
            resolve,
            reject,
            requiredRights,
            requiredModuleKey,
            requiredPermissionType
          )
        )(req, res, next);
      });
      return next();
    } catch (err) {
      logger.error("Error in auth middleware:", err);
      next(err);
    }
  };

module.exports = auth;
