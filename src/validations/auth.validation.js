import Joi from 'joi';

// Joi schema for validating user registration request
export const registerSchema = Joi.object({
  // Name is required (2 to 50 characters)
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  // Work email must be a valid email format
  workEmail: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Work email is required',
      'string.email': 'Please enter a valid work email address',
      'any.required': 'Work email is required'
    }),
  // Organization or team name (optional)
  organizationName: Joi.string()
    .trim()
    .max(100)
    .allow('', null)
    .optional(),
  // Password minimum 6 characters
  password: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  // confirmPassword must match password
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'Confirm password is required',
    'any.only': 'confirmPassword must match password',
    'any.required': 'Confirm password is required'
  }),
  // Phone is optional string
  phone: Joi.string().trim().allow('', null).optional(),
  // Avatar is optional URL string (uploaded via separate upload API)
  avatar: Joi.string().trim().allow('', null).optional()
});

// Joi schema for validating resend verification email request
export const resendVerificationSchema = Joi.object({
  workEmail: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Work email is required',
      'string.email': 'Please enter a valid work email address',
      'any.required': 'Work email is required'
    })
});

// Joi schema for validating verify email OTP request
export const verifyOtpSchema = Joi.object({
  workEmail: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Work email is required',
      'string.email': 'Please enter a valid work email address',
      'any.required': 'Work email is required'
    }),
  otp: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must be a 6-digit number',
      'any.required': 'OTP is required'
    })
});

// Joi schema for validating user login request
export const loginSchema = Joi.object({
  workEmail: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Work email is required',
      'string.email': 'Please enter a valid work email address',
      'any.required': 'Work email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

// Joi schema for validating user profile update request
export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  organizationName: Joi.string()
    .trim()
    .max(100)
    .allow('', null),
  phone: Joi.string()
    .trim()
    .allow('', null),
  avatar: Joi.string()
    .trim()
    .allow('', null)
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update'
  });

// Joi schema for validating change password request
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
    'any.required': 'Current password is required'
  }),
  newPassword: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
    'string.empty': 'Confirm password is required',
    'any.only': 'confirmPassword must match newPassword',
    'any.required': 'Confirm password is required'
  })
});

// Joi schema for validating forgot password request
export const forgotPasswordSchema = Joi.object({
  workEmail: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Work email is required',
      'string.email': 'Please enter a valid work email address',
      'any.required': 'Work email is required'
    })
});

// Joi schema for validating reset password request
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Reset token is required',
    'any.required': 'Reset token is required'
  }),
  newPassword: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
    'string.empty': 'Confirm password is required',
    'any.only': 'confirmPassword must match newPassword',
    'any.required': 'Confirm password is required'
  })
});
