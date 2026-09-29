/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with JSON payload containing user details and sends a 6-digit email verification code.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - workEmail
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alex Rivera
 *                 description: User full name (2-50 characters)
 *               workEmail:
 *                 type: string
 *                 format: email
 *                 example: alex@company.com
 *                 description: Work email address
 *               organizationName:
 *                 type: string
 *                 example: Acme Cloud Fleet
 *                 description: Optional organization or team name
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *                 description: User password (minimum 6 characters)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *                 description: Must match password
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *                 description: Optional phone number
 *               avatar:
 *                 type: string
 *                 example: http://localhost:5000/uploads/avatars/avatar-12345.jpg
 *                 description: Optional avatar URL uploaded via /api/uploads/avatar
 *     responses:
 *       201:
 *         description: User registered successfully. A verification code has been sent to your email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully. A verification code has been sent to your email.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 660c2134567890abcdef1234
 *                         name:
 *                           type: string
 *                           example: Alex Rivera
 *                         workEmail:
 *                           type: string
 *                           example: alex@company.com
 *                         phone:
 *                           type: string
 *                           example: "9876543210"
 *                         avatar:
 *                           type: string
 *                           example: http://localhost:5000/uploads/avatars/avatar-12345.jpg
 *                         organizationName:
 *                           type: string
 *                           example: Acme Cloud Fleet
 *                         status:
 *                           type: string
 *                           example: active
 *                         isVerified:
 *                           type: boolean
 *                           example: false
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: confirmPassword must match password
 *       409:
 *         description: Duplicate email conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: A user with this email already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while creating the user account
 *
 * /api/user/verify-email-otp:
 *   post:
 *     summary: Verify email address using OTP
 *     description: Verifies user email address using the 6-digit OTP code sent to user's work email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workEmail
 *               - otp
 *             properties:
 *               workEmail:
 *                 type: string
 *                 format: email
 *                 example: alex@company.com
 *                 description: Work email address of the registered user
 *               otp:
 *                 type: string
 *                 example: "482913"
 *                 description: 6-digit verification code sent via email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Validation error, expired code, invalid code, or already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid verification code
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No user found with this email address
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while verifying the email code
 *
 * /api/user/resend-verification:
 *   post:
 *     summary: Resend email verification OTP
 *     description: Generates a new 6-digit verification code and sends it to the user's work email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workEmail
 *             properties:
 *               workEmail:
 *                 type: string
 *                 format: email
 *                 example: alex@company.com
 *                 description: Work email address of the registered user
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code sent successfully
 *       400:
 *         description: Validation error or email already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email is already verified
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No user found with this email address
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while resending verification code
 *
 * /api/user/login:
 *   post:
 *     summary: Log in user
 *     description: Authenticates a user with work email and password. Requires verified email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workEmail
 *               - password
 *             properties:
 *               workEmail:
 *                 type: string
 *                 format: email
 *                 example: alex@company.com
 *                 description: Work email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 660c2134567890abcdef1234
 *                         name:
 *                           type: string
 *                           example: Alex Rivera
 *                         email:
 *                           type: string
 *                           example: alex@company.com
 *                         workEmail:
 *                           type: string
 *                           example: alex@company.com
 *                         phone:
 *                           type: string
 *                           example: "9876543210"
 *                         avatar:
 *                           type: string
 *                           example: http://localhost:5000/uploads/avatars/avatar-12345.jpg
 *                         organizationName:
 *                           type: string
 *                           example: Acme Cloud Fleet
 *                         status:
 *                           type: string
 *                           example: active
 *                         isVerified:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjBjMjEzNDU2Nzg5MGFiY2RlZjEyMzQiLCJpYXQiOjE3MTEyMzQ1NjcsImV4cCI6MTcxMTMyMDk2N30.exampleSignature
 *                       description: JWT bearer access token for authenticating protected requests
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Work email is required
 *       401:
 *         description: Invalid credentials or unverified email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred during login
 *
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieves the profile of the currently authenticated user using Bearer JWT.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 660c2134567890abcdef1234
 *                         name:
 *                           type: string
 *                           example: Alex Rivera
 *                         email:
 *                           type: string
 *                           example: alex@company.com
 *                         workEmail:
 *                           type: string
 *                           example: alex@company.com
 *                         phone:
 *                           type: string
 *                           example: "9876543210"
 *                         avatar:
 *                           type: string
 *                           example: http://localhost:5000/uploads/avatars/avatar-12345.jpg
 *                         organizationName:
 *                           type: string
 *                           example: Acme Cloud Fleet
 *                         status:
 *                           type: string
 *                           example: active
 *                         isVerified:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Authentication error (missing, invalid, or expired token, or user not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving user profile
 *   patch:
 *     summary: Update current user profile
 *     description: Updates authenticated user profile details. Only allowed fields (name, organizationName, phone, avatar) can be updated.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alex Rivera
 *                 description: User full name (2-50 characters)
 *               organizationName:
 *                 type: string
 *                 example: Acme Cloud Fleet
 *                 description: Organization or team name
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *                 description: Phone number
 *               avatar:
 *                 type: string
 *                 example: http://localhost:5000/uploads/avatars/avatar-12345.jpg
 *                 description: Avatar image URL
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 660c2134567890abcdef1234
 *                         name:
 *                           type: string
 *                           example: Alex Rivera
 *                         email:
 *                           type: string
 *                           example: alex@company.com
 *                         workEmail:
 *                           type: string
 *                           example: alex@company.com
 *                         phone:
 *                           type: string
 *                           example: "9876543210"
 *                         avatar:
 *                           type: string
 *                           example: http://localhost:5000/uploads/avatars/avatar-12345.jpg
 *                         organizationName:
 *                           type: string
 *                           example: Acme Cloud Fleet
 *                         status:
 *                           type: string
 *                           example: active
 *                         isVerified:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error (empty body, unknown fields, or invalid values)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: At least one field must be provided for update
 *       401:
 *         description: Authentication error (missing, invalid, or expired token, or user not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating profile
 *
 * /api/user/change-password:
 *   patch:
 *     summary: Change user password
 *     description: Changes the authenticated user's password and sends a confirmation email upon success.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPassword123
 *                 description: Current user password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *                 description: New password (minimum 6 characters)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *                 description: Must match newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Validation error (missing fields, password too short, or passwords do not match)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: confirmPassword must match newPassword
 *       401:
 *         description: Authentication error (missing token or incorrect current password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Current password is incorrect
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while changing password
 *
 * /api/user/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     description: Sends a password reset link to the user's email if an account exists with that address.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workEmail
 *             properties:
 *               workEmail:
 *                 type: string
 *                 format: email
 *                 example: alex@company.com
 *                 description: Work email address of the account
 *     responses:
 *       200:
 *         description: Safe response indicating reset link has been sent if account exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: If an account with that email exists, a password reset link has been sent.
 *       400:
 *         description: Validation error (invalid email format or missing email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please enter a valid work email address
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while processing password reset request
 *
 * /api/user/reset-password:
 *   post:
 *     summary: Reset password with token
 *     description: Resets the user's password using the token received via password reset email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890
 *                 description: Password reset token
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewSecretPassword123
 *                 description: New password (minimum 6 characters)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewSecretPassword123
 *                 description: Must match newPassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid/expired token or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or expired password reset token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while resetting password
 */



