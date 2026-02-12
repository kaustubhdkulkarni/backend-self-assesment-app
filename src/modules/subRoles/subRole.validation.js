const Joi = require('joi');
const { subRoles } = require('../../config/enums');

const addSubRole = {
    body: Joi.object({
        subRoleName: Joi.string().trim().valid(...Object.values(subRoles)).required().messages({
            'string.empty': `The 'sub role name' field cannot be empty.`,
            'any.required': `The 'sub role name' field is required. Please include it in your request.`,
            'any.only': `The 'sub role name' field must be one of ${Object.values(subRoles).join(", ")}.`,
        }),
        description: Joi.string().trim().allow('').optional().messages({
            'string.empty': `The 'description' field is optional.`,
        }),
    }),
};

const updateSubrole = {
    params: Joi.object({
        subRoleId: Joi.string().trim().guid({ version: 'uuidv4' }).required().messages({
            'string.empty': 'The "Sub Role Id" field cannot be empty.',
            'string.guid': 'The "Sub Role Id" must be a valid UUID.',
            'any.required': 'The "Sub Role Id" field is required. Please include it in your request.',
        }),
    }),
    body: Joi.object({
        subRoleName: Joi.string().trim().valid(...Object.values(subRoles)).optional().messages({
            'string.empty': `The "Sub Role Name" field cannot be empty.`,
            'any.only': `The "Sub Role Name" field must be one of: ${Object.values(subRoles).join(", ")}.`,
        }),
        description: Joi.string().trim().optional().allow(null, ''),
    }),
};


module.exports = {
    addSubRole,
    updateSubrole
}