import mongoose from 'mongoose';

const resourceShareSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    permission: {
      type: String,
      enum: ['viewer', 'editor'],
      default: 'viewer',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const ResourceShare = mongoose.model('ResourceShare', resourceShareSchema);

export default ResourceShare;
