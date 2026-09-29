import 'dotenv/config';
import { sendEmail } from '../utils/sendEmail.js';

// Send professional welcome email to new user
export const sendWelcomeEmail = async ({ email, name, dashboardUrl }) => {
  const subject = 'Welcome to Resource Management Dashboard';
  const loginUrl = dashboardUrl || process.env.FRONTEND_URL;

  // Professional HTML welcome email template
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Resource Management Dashboard</h1>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${name || 'User'}!</h2>
        <p>Thank you for signing up for Resource Management Dashboard. Your account has been created and is ready to use.</p>
        <p>You can manage your projects, resources, and allocations all in one place.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${loginUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Login to Dashboard
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If you have any questions or need assistance, feel free to reach out to our team.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Resource Management Dashboard. All rights reserved.
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    html
  });
};

// Send email verification OTP to user
export const sendOtpEmail = async ({ email, name, otp }) => {
  const subject = 'Your Email Verification Code';

  // Professional HTML OTP email template
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Resource Management</h1>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #1f2937; margin-top: 0;">Hello ${name || 'there'},</h2>
        <p>Thank you for signing up with Resource Management. Please use the verification code below to verify your work email address:</p>
        <div style="margin: 24px 0; text-align: center;">
          <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #2563eb; background-color: #eff6ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #93c5fd;">
            ${otp}
          </span>
        </div>
        <p style="color: #ef4444; font-size: 14px; font-weight: 500;">This code is valid for 1 minute only.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If you did not request this verification code, please ignore this email.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Resource Management. All rights reserved.
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    html
  });
};

// Send password change confirmation email to user
export const sendPasswordChangeEmail = async ({ email, name }) => {
  const subject = 'Password Changed Successfully';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name || 'User'},</h2>
      <p>Your password was successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    html
  });
};

// Send password reset email to user
export const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  const subject = 'Password Reset Request';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name || 'User'},</h2>
      <p>We received a request to reset your password.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    html
  });
};
