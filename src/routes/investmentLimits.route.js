const express = require("express");
const investmentLimitControllers = require("../modules/investmentLimits/controllers");
const investmentLimitsValidation = require("../modules/investmentLimits/investmentLimits.validation");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");

const router = express.Router();

router
  .route("/")
  .post(
    auth([roleAccess.user], "Investment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(investmentLimitsValidation.addInvestmentLimits),
    investmentLimitControllers.addInvestmentLimits
  );

router
  .route("/")
  .get(
    auth([roleAccess.user], "Investment", "main"),
    investmentLimitControllers.getAllInvestmentLimits
  );

router
  .route("/:subRoleId")
  .put(
    auth([roleAccess.user], "Investment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(investmentLimitsValidation.updateInvestmentLimit),
    investmentLimitControllers.updateInvestmentLimits
  );

router
  .route("/:subRoleId")
  .delete(
    auth([roleAccess.user], "Investment", "main"),
    validate(investmentLimitsValidation.deleteInvestmentLimit),
    investmentLimitControllers.deleteInvestmentLimits
  );

// for users

router
  .route("/get-my-investmentLimit")
  .get(
    auth(roleAccess.user),
    investmentLimitControllers.getInvestmentLimitsBySubRoleId
  );

module.exports = router;
