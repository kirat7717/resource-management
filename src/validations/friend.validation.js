import Joi from 'joi';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const sendFriendRequestSchema = Joi.object({
  recipientId: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .required()
    .messages({
      'string.empty': 'recipientId is required',
      'string.pattern.base': 'recipientId must be a valid MongoDB ObjectId',
      'any.required': 'recipientId is required'
    })
});

export const respondFriendRequestSchema = Joi.object({
  status: Joi.string()
    .valid('accepted', 'rejected')
    .required()
    .messages({
      'string.empty': 'status is required',
      'any.only': 'status must be either accepted or rejected',
      'any.required': 'status is required'
    })
});
