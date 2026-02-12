const express = require("express");
const fundraiserRepaymentControllers = require("../modules/fundraiserRepayments/controllers");
const validate = require("../middlewares/validate");
const fundraiserRepaymentValidation = require("../modules/fundraiserRepayments/fundraiserRepayments.validations");
const auth = require("../middlewares/auth");
const router = express.Router();
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");

router
  .route("/calculate-repayment")
  .post(
    auth([roleAccess.user], "Repayment", "main"),
    checkContentType(contentType.applicationJSON),
    fundraiserRepaymentControllers.calculateRepayment
  );

router
  .route("/schedule")
  .post(
    auth([roleAccess.user], "Repayment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(fundraiserRepaymentValidation.scheduleRepaymentForFundraiser),
    fundraiserRepaymentControllers.scheduleRepayment
  );

router
  .route("/schedule/:campaignId")
  .get(
    auth([roleAccess.user], "Repayment", "main"),
    validate(fundraiserRepaymentValidation.getRepayment),
    fundraiserRepaymentControllers.getScheduleRepayment
  );

router
  .route("/all-schedule/")
  .get(
    auth(roleAccess.admin),
    fundraiserRepaymentControllers.getAllScheduleRepayment
  );

router
  .route("/schedule/")
  .put(
    auth([roleAccess.user], "Repayment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(fundraiserRepaymentValidation.updateScheduleRepayment),
    fundraiserRepaymentControllers.updateScheduleRepayment
  );
// User

router
  .route("/get-my-repayment")
  .get(auth(roleAccess.user), fundraiserRepaymentControllers.getMyRepayment);

router
  .route("/update-payment-receipt-manually")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(fundraiserRepaymentValidation.updatePaymentReceiptManually),
    fundraiserRepaymentControllers.updatePaymentReceiptManually
  );

router
  .route("/get-my-installment/:repaymentId")
  .get(auth(roleAccess.user), fundraiserRepaymentControllers.getMyInstallment);

router
  .route("/reject-manual-installment")
  .put(
    auth([roleAccess.user], "Repayment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(fundraiserRepaymentValidation.rejectManualInstallment),
    fundraiserRepaymentControllers.rejectManualInstallment
  );

router
  .route("/refund-manual-installment")
  .put(
    auth([roleAccess.user], "Repayment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(fundraiserRepaymentValidation.refundManualInstallment),
    fundraiserRepaymentControllers.refundManualInstallment
  );

router
  .route("/approve-manual-pay/:campaignId")
  .post(
    auth([roleAccess.user], "Repayment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(fundraiserRepaymentValidation.approveManualPay),
    fundraiserRepaymentControllers.approveManualPay
  );

router
  .route("/fetch-upcoming-repayment")
  .get(
    auth([roleAccess.user], "Repayment", "main"),
    fundraiserRepaymentControllers.fetchUpcomingRepayment
  );
router
  .route("/update-total-repayment")
  .get(
    auth([roleAccess.user], "Repayment", "main"),
    fundraiserRepaymentControllers.updateTotalAmount
  );
router
  .route("/update-late-fee-repayment")
  .get(
    auth([roleAccess.user], "Repayment", "main"),
    fundraiserRepaymentControllers.updateLateFeeAmount
  );

module.exports = router;
