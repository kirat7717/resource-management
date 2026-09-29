import 'dotenv/config';
import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken, generateOtp } from '../utils/token.js';
import { generateAccessToken } from '../utils/jwt.js';
import {
  registerSchema,
  resendVerificationSchema,
  verifyOtpSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/auth.validation.js';
import {
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordChangeEmail,
  sendPasswordResetEmail
} from '../emails/user.email.js';

// Register new user controller
export const registerUser = async (req, res) => {
  try {
    // 1. Validate request body directly with Joi schema
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // 2. Extract validated fields
    const {
      name,
      workEmail,
      password,
      phone,
      avatar,
      organizationName
    } = value;

    // 3. Check whether email already exists
    const existingUser = await User.findOne({ email: workEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // 4. Hash plain password
    const hashedPassword = await hashPassword(password);

    // 5. Generate 6-digit OTP with 1 minute expiry
    const { otp, expiresAt: otpExpires } = generateOtp(1);

    // 6. Create and save new user document (isVerified: false)
    const newUser = await User.create({
      name,
      email: workEmail,
      password: hashedPassword,
      phone: phone || '',
      avatar: avatar || '',
      organizationName: organizationName || '',
      status: 'active',
      isVerified: false,
      emailVerificationOtp: otp,
      emailVerificationOtpExpires: otpExpires
    });

    // 7. Send OTP verification email asynchronously in the background (non-blocking)
    sendOtpEmail({
      email: newUser.email,
      name: newUser.name,
      otp
    }).catch((emailError) => {
      console.error(`Failed to send registration OTP email to ${newUser.email}:`, emailError.message);
    });

    // 8. Explicitly build safe user response object (no sensitive fields or OTP fields)
    const user = {
      id: newUser._id,
      name: newUser.name,
      workEmail: newUser.email,
      phone: newUser.phone,
      avatar: newUser.avatar,
      organizationName: newUser.organizationName,
      status: newUser.status,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    // 9. Return successful response immediately
    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Verification code is being sent to your email.',
      data: {
        user
      }
    });
  } catch (err) {
    // Return clean 500 error without exposing stack trace or internals
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the user account'
    });
  }
};

// Verify user email address using OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    // 1. Validate request body with Joi schema
    const { error, value } = verifyOtpSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { workEmail, otp } = value;

    // 2. Find user by email
    const user = await User.findOne({ email: workEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // 3. Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // 4. Check if OTP exists
    if (!user.emailVerificationOtp || !user.emailVerificationOtpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new code.'
      });
    }

    // 5. Check if OTP has expired
    if (user.emailVerificationOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      });
    }

    // 6. Check if OTP matches
    if (user.emailVerificationOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // 7. On success: update isVerified and clear OTP fields
    user.isVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpires = null;
    await user.save();

    // 8. Return clean success response without exposing OTP
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while verifying the email code'
    });
  }
};

// Resend email verification OTP
export const resendVerification = async (req, res) => {
  try {
    // 1. Validate email using Joi schema
    const { error, value } = resendVerificationSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { workEmail } = value;

    // 2. Find user by email
    const user = await User.findOne({ email: workEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // 3. Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // 4. Generate new 6-digit OTP and 1-minute expiry
    const { otp: newOtp, expiresAt: newExpires } = generateOtp(1);

    user.emailVerificationOtp = newOtp;
    user.emailVerificationOtpExpires = newExpires;
    await user.save();

    // 5. Send OTP email via user.email.js
    try {
      await sendOtpEmail({
        email: user.email,
        name: user.name,
        otp: newOtp
      });
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please try again.'
      });
    }

    // 6. Return success response without exposing OTP
    return res.status(200).json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resending verification code'
    });
  }
};

// Login user controller
export const loginUser = async (req, res) => {
  try {
    // 1. Validate request body with Joi schema
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { workEmail, password } = value;

    // 2. Find user by work email (matches database email field)
    const user = await User.findOne({ email: workEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 3. Compare plain password with stored hash
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 4. Require verified email (isVerified)
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your work email address before logging in'
      });
    }

    // 5. Generate access token
    const accessToken = generateAccessToken({ userId: user._id });

    // 6. Explicitly build safe user response object (no sensitive fields or OTP fields)
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      workEmail: user.email,
      phone: user.phone,
      avatar: user.avatar,
      organizationName: user.organizationName,
      status: user.status,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // 7. Return successful response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: safeUser,
        accessToken
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

// Get current user profile controller
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is attached by checkUserExists middleware with sensitive fields excluded
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      workEmail: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar,
      organizationName: req.user.organizationName,
      status: req.user.status,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user profile'
    });
  }
};

// Update user profile controller
export const updateUserProfile = async (req, res) => {
  try {
    // 1. Validate request body directly with Joi schema
    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // 2. Update only allowed fields provided in req.body
    const allowedFields = ['name', 'organizationName', 'phone', 'avatar'];
    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        req.user[field] = value[field];
      }
    });

    // 3. Save updated user document
    await req.user.save();

    // 4. Return safe user profile data (no password or tokens)
    const safeUser = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      workEmail: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar,
      organizationName: req.user.organizationName,
      status: req.user.status,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: safeUser
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating profile'
    });
  }
};

// Change user password controller
export const changePassword = async (req, res) => {
  try {
    // 1. Validate request body with Joi schema
    const { error, value } = changePasswordSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { currentPassword, newPassword } = value;

    // 2. Fetch user with password field from MongoDB
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // 3. Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // 4. Hash and save new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    // 5. Send notification email only after successful save
    try {
      await sendPasswordChangeEmail({
        email: user.email,
        name: user.name
      });
    } catch (emailErr) {
      // Continue since password update succeeded in database
    }

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while changing password'
    });
  }
};

// Forgot password controller
export const forgotPassword = async (req, res) => {
  try {
    // 1. Validate request body with Joi schema
    const { error, value } = forgotPasswordSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { workEmail } = value;
    const safeResponseMessage = 'If an account with that email exists, a password reset link has been sent.';

    // 2. Find user by email
    const user = await User.findOne({ email: workEmail });

    // 3. Return safe response without revealing whether account exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: safeResponseMessage
      });
    }

    // 4. Generate password reset token using existing utility
    const expiresInMinutes = Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES) || 15;
    const { token: resetToken, expiresAt: resetExpires } = generateToken(expiresInMinutes);

    // 5. Save token and expiry
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // 6. Build reset URL using BACKEND_URL
    const backendUrl = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const resetUrl = `${backendUrl}/api/user/reset-password?token=${resetToken}`;

    // 7. Send password reset email
    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl
      });
    } catch (emailErr) {
      // Continue without breaking safe response
    }

    return res.status(200).json({
      success: true,
      message: safeResponseMessage
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing password reset request'
    });
  }
};

// Reset password controller
export const resetPassword = async (req, res) => {
  try {
    // 1. Validate request body with Joi schema
    const { error, value } = resetPasswordSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token, newPassword } = value;

    // 2. Find user by passwordResetToken
    const user = await User.findOne({ passwordResetToken: token });

    // 3. Validate token exists, expiry exists, and current time is before expiry
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    // 4. Hash the new password using existing hashPassword utility
    const hashedPassword = await hashPassword(newPassword);

    // 5. Save new password and clear reset fields
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    // 6. Send password change notification email
    try {
      await sendPasswordChangeEmail({
        email: user.email,
        name: user.name
      });
    } catch (emailErr) {
      // Continue without failing the successful password reset
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting password'
    });
  }
};


