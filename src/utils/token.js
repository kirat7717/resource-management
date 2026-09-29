import crypto from 'crypto';

// Generate a secure random hex token and calculate its expiry date
export const generateToken = (expiresInMinutes = 60) => {
  // Generate 32 bytes random string as hex
  const token = crypto.randomBytes(32).toString('hex');

  // Calculate future expiry date
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return {  
    token,
    expiresAt
  };
};

// Generate a 6-digit numeric OTP and calculate its expiry date
export const generateOtp = (expiresInMinutes = 1) => {
  // Generate random 6-digit string (100000 - 999999)
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Calculate future expiry date
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return {
    otp,
    expiresAt
  };
};
