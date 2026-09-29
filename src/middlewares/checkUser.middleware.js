import User from '../models/user.model.js';

export const checkUserExists = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;  
   
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Find user in MongoDB and exclude password, OTP, and sensitive token fields
    const user = await User.findById(userId).select(
      '-password -emailVerificationOtp -emailVerificationOtpExpires -passwordResetToken -passwordResetExpires'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach safe user document to req.user
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'User lookup error'
    });
  }
};

export default checkUserExists;
