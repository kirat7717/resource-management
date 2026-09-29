import mongoose from 'mongoose';

const hardwareProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    cpu: {
      type: Number,
      required: true,
      min: 1
    },
    ramGb: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const HardwareProfile = mongoose.model('HardwareProfile', hardwareProfileSchema);
export default HardwareProfile;
