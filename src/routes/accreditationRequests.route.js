const express = require("express");
const accreditationRequestsControllers = require("../modules/AccreditationRequests/controllers");
const validate = require("../middlewares/validate");
const accreditationRequestsValidation = require("../modules/AccreditationRequests/accreditationsRequests.validation");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

router
  .route("/")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(accreditationRequestsValidation.accreditationRequests),
    accreditationRequestsControllers.accreditationRequests
  );
router
  .route("/get-my-request")
  .get(
    auth(roleAccess.user),
    accreditationRequestsControllers.getMyAccreditationRequest
  );

router
  .route("/get-current-request")
  .get(
    auth(roleAccess.user),
    accreditationRequestsControllers.getCurrentRequest
  );

router
  .route("/get-all-request")
  .get(
    auth(roleAccess.admin),
    accreditationRequestsControllers.getAllAccreditationRequest
  );

router
  .route("/get-request/:requestId")
  .get(
    auth([roleAccess.user], "Accreditations Requests", "main"),
    validate(accreditationRequestsValidation.getAccreditationRequestById),
    accreditationRequestsControllers.getAccreditationRequestById
  );

router
  .route("/approve-request/:requestId")
  .put(
    auth([roleAccess.user], "Accreditations Requests", "main"),
    checkContentType(contentType.applicationJSON),
    validate(accreditationRequestsValidation.approveAccreditationRequest),
    accreditationRequestsControllers.approveAccreditationRequest
  );

router
  .route("/reject-request/:requestId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(accreditationRequestsValidation.rejectAccreditationRequest),
    accreditationRequestsControllers.rejectAccreditationRequest
  );

module.exports = router;
