const express = require("express");
const requestToRepaymentController = require("../modules/requestToRepayment/controllers/index");
const requestToRepaymentValidation = require("../modules/requestToRepayment/requestToRepayment.validations");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

router
  .route("/add")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(requestToRepaymentValidation.addRequestToRepayment),
    requestToRepaymentController.addRequestToRepayment
  );

router
  .route("/get-all")
  .get(
    auth([roleAccess.user], "Repayment Request", "main"),
    requestToRepaymentController.getAllRequestToRepayment
  );

module.exports = router;
