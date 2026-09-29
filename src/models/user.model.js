import mongoose from 'mongoose';

// User database schema
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: true,
      trim: true
    },
    // User email address (must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    // Hashed user password
    password: {
      type: String,
      required: true
    },
    // Contact phone number
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    // Avatar image URL (saved as a public URL string)
    avatar: {
      type: String,
      default: ''
    },
    // Organization or team name
    organizationName: {
      type: String,
      trim: true,
      default: ''
    },
    // Account status: active, inactive, or pending
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active'
    },
    // Verification status
    isVerified: {
      type: Boolean,
      default: false
    },
    // Email verification OTP fields
    emailVerificationOtp: {
      type: String,
      default: null
    },
    emailVerificationOtpExpires: {
      type: Date,
      default: null
    },
    // Password reset fields (for future implementation)
    passwordResetToken: {
      type: String,
      default: null
    },
    passwordResetExpires: {
      type: Date,
      default: null
    }
  },
  {
    // Automatically creates createdAt and updatedAt fields
    timestamps: true
  }
);

// Create Mongoose User model
const User = mongoose.model('User', userSchema);

export default User;
