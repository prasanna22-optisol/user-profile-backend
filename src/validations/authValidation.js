import Joi from "joi";

export const RegisterValidation = Joi.object({
    password:Joi.string().min(4).required(),
    confirmPassword:Joi.string().min(4).required(),
    email:Joi.string().email().required(),
    fullName:Joi.string().required(),
    mobileNumber:Joi.string().required().length(10),
    designation:Joi.string().required(),
})

export const LoginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
})