import { Router } from 'express';
import {
  registerUser,
  verifyEmailOtp,
  resendVerification,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkUserExists } from '../middlewares/checkUser.middleware.js';

const router = Router();

// POST /api/user/register - Register a new user
router.post('/register', registerUser);

// POST /api/user/verify-email-otp - Verify email address using OTP
router.post('/verify-email-otp', verifyEmailOtp);

// POST /api/user/resend-verification - Resend email verification OTP
router.post('/resend-verification', resendVerification);

// POST /api/user/login - User login
router.post('/login', loginUser);

// POST /api/user/forgot-password - Send password reset email
router.post('/forgot-password', forgotPassword);

// POST /api/user/reset-password - Reset password using token
router.post('/reset-password', resetPassword);

// GET /api/user/profile - Get current user profile (protected)
router.get('/profile', authenticate, checkUserExists, getCurrentUser);

// PATCH /api/user/profile - Update current user profile (protected)
router.patch('/profile', authenticate, checkUserExists, updateUserProfile);

// PATCH /api/user/change-password - Change current user password (protected)
router.patch('/change-password', authenticate, checkUserExists, changePassword);

export default router;
