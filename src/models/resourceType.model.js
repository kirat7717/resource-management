import mongoose from 'mongoose';

const resourceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    description: {
      type: String,
      trim: true,
      default: ''
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

const ResourceType = mongoose.model('ResourceType', resourceTypeSchema);
export default ResourceType;
