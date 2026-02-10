const Joi = require("joi");
const {
  objectId,
} = require("../../validations/custom.validation");


const addValidation = {
  body: Joi.object().keys({
    domainName: Joi.string().required().messages({
      "string.empty": `Location is required`,
      "any.required": `Location is required`,
    }),
    shippingLineId: Joi.string().required().messages({
      "string.empty": `Shipping Line is required`,
      "any.required": `Shipping Line is required`,
    }),
    documentUrl: Joi.string().required().messages({
      "string.empty": `Document Url is required`,
      "any.required": `Document Url is required`,
    }),
    documentType: Joi.string().required().messages({
      "string.empty": `Document Type is required`,
      "any.required": `Document Type is required`,
    }),
    stageType: Joi.string().required().messages({
      "string.empty": `Stage Type is required`,
      "any.required": `Stage Type is required`,
    }),
    bookingNo: Joi.string().allow("").allow(null).messages({
      "string.empty": `Document Number is required`,
      "any.required": `Document Number is required`,
    }),
    documentNo: Joi.string().required().messages({
      "string.empty": `Document Number is required`,
      "any.required": `Document Number is required`,
    }),
    assignToUserId: Joi.string().messages({
      "string.empty": `Assign To User Id is required`,
      "any.required": `Assign To User Id is required`,
    }),
  }),
};

const listValidation = {
  query: Joi.object().keys({
    limit: Joi.number().allow("", null),
    page: Joi.number().allow("", null),
    search: Joi.string().allow("", null),
  }),
};

const updateFieldValidation = {
  param: Joi.object().keys({
    documentId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    fieldName: Joi.any().required(),
  }).unknown(true),
};

const deleteFieldValidation = {
  param: Joi.object().keys({
    documentId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    itemId: Joi.any().required(),
  }).unknown(true),
};

const processExtractedFields = {
  param: Joi.object().keys({
    documentId: Joi.string().required(),
  })
};

const getSingleValidation = {
  param: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  addValidation,
  listValidation,
  updateFieldValidation,
  deleteFieldValidation,
  getSingleValidation,
  processExtractedFields
};
