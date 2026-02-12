const Joi = require("joi")

const addSystemUserRole = {
    body: Joi.object({
        systemUserRoleName: Joi.string().trim()
        .pattern(/^[A-Za-z ]+$/).required().messages({
            'string.pattern.base': 'The "role name" field can only contain letters and spaces.',
            'string.empty': 'The "role name" field cannot be empty.',
            'any.required': 'The "role name" field is required.',
        }),
    })
}

const updateSystemUserRole = {
    params: Joi.object({
        roleId: Joi.string().trim().required().messages({
            'string.empty': 'The "id" field cannot be empty.',
            'any.required': 'The "id" field is required.',
        }),
    }),
    body: Joi.object({
        systemUserRoleName: Joi.string().trim().pattern(/^[A-Za-z ]+$/).messages({
            'string.pattern.base': 'The "role name" field can only contain letters and spaces.',
            'string.empty': 'The "role name" field cannot be empty.',
        }),
    })
}

const deleteSystemUserRole = {
    params: Joi.object({
        roleId: Joi.string().trim().required().messages({
            'string.empty': 'The "id" field cannot be empty.',
            'any.required': 'The "id" field is required.',
        }),
    }),
}




module.exports = {
    addSystemUserRole,
    updateSystemUserRole,
    deleteSystemUserRole
}