import 'dotenv/config';
import transporter from '../config/nodemailer.js';

// Generic reusable helper to send an email using configured transporter
export const sendEmail = async ({ to, subject, html }) => {
  // Mail options including default sender
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Resource Management <noreply@resourcemanagement.com>',
    to,
    subject,
    html
  };

  // Send email and return the result info
  return await transporter.sendMail(mailOptions);
};
