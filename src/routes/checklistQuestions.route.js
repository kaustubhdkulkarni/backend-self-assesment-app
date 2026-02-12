const express = require("express");
const checklistQuestionController = require("../modules/checklist/checkListQuestions/controllers");
const validate = require("../middlewares/validate");
const checklistQuestionValidation = require("../modules/checklist/checkListQuestions/checkListQuestions.validations");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

router
  .route("/")
  .post(
    auth([roleAccess.user], "Due Diligence", "main"),
    checkContentType(contentType.applicationJSON),
    validate(checklistQuestionValidation.createChecklistQuestion),
    checklistQuestionController?.createChecklistQuestion
  );
router
  .route("/:checklistQuestionId")
  .put(
    auth([roleAccess.user], "Due Diligence", "main"),
    checkContentType(contentType.applicationJSON),
    validate(checklistQuestionValidation.updateChecklistQuestionById),
    checklistQuestionController?.updateChecklistQuestionById
  );
router
  .route("/:checklistQuestionId")
  .delete(
    auth([roleAccess.user], "Due Diligence", "main"),
    validate(checklistQuestionValidation.deleteChecklistQuestionById),
    checklistQuestionController?.deleteChecklistQuestionById
  );

module.exports = router;
