const express = require("express");
const checklistSectionController = require("../modules/checklist/checkListSections/controllers");
const validate = require("../middlewares/validate");
const checklistSectionValidation = require("../modules/checklist/checkListSections/checkListSections.validations");
const auth = require("../middlewares/auth");
const router = express.Router();
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");

router
  .route("/")
  .post(
    auth([roleAccess.user], "Due Diligence", "main"),
    checkContentType(contentType.applicationJSON),
    validate(checklistSectionValidation.createChecklistSection),
    checklistSectionController?.createChecklistSection
  );
router
  .route("/:checklistSectionId")
  .put(
    auth([roleAccess.user], "Due Diligence", "main"),
    checkContentType(contentType.applicationJSON),
    validate(checklistSectionValidation.updateChecklistSection),
    checklistSectionController?.updateChecklistSection
  );
router
  .route("/:checklistSectionId")
  .delete(
    auth([roleAccess.user], "Due Diligence", "main"),
    validate(checklistSectionValidation.deleteChecklistSection),
    checklistSectionController?.deleteChecklistSection
  );
router
  .route("/")
  .get(
    auth([roleAccess.user], "Due Diligence", "main"),
    checklistSectionController?.getAllChecklistSectionsWithQuestions
  );

module.exports = router;
