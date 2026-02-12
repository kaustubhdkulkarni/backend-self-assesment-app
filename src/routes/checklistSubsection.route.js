const express = require("express");

const checklistSubsectionController = require("../modules/checklist/checkListSubsections/controllers");
const validate = require("../middlewares/validate");
const checklistSubsectionValidation = require("../modules/checklist/checkListSubsections/checkListSubsections.validations");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");

const router = express.Router();

router
  .route("/")
  .post(
    auth([roleAccess.user], "Due Diligence", "main"),
    checkContentType(contentType.applicationJSON),
    validate(checklistSubsectionValidation.createChecklistSubsection),
    checklistSubsectionController.createChecklistSubsection
  );

router
  .route("/:checklistSubsectionId")
  .put(
    auth([roleAccess.user], "Due Diligence", "main"),
    checkContentType(contentType.applicationJSON),
    validate(checklistSubsectionValidation.updateChecklistSubsection),
    checklistSubsectionController?.updateChecklistSubsection
  );

router
  .route("/:checklistSubsectionId")
  .delete(
    auth([roleAccess.user], "Due Diligence", "main"),
    validate(checklistSubsectionValidation.deleteChecklistSubsection),
    checklistSubsectionController.deleteChecklistSubsection
  );

module.exports = router;
