import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    // Resource name
    resourceName: {
      type: String,
      trim: true
    },
    // Compatibility alias for existing APIs
    name: {
      type: String,
      trim: true
    },
    // Reference to ResourceType
    resourceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResourceType',
      index: true
    },
    // Compatibility string type
    type: {
      type: String,
      trim: true
    },
    // Reference to Subscription
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      index: true
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      index: true
    },
    // Reference to ResourceGroup
    resourceGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResourceGroup',
      index: true
    },
    resourceGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResourceGroup',
      index: true
    },
    // Reference to Region
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      index: true
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      index: true
    },
    // Description
    description: {
      type: String,
      trim: true,
      default: ''
    },
    // Hardware Profile ObjectId
    hardwareProfile: {
      type: mongoose.Schema.Types.ObjectId
    },
    // Storage configuration
    storage: {
      type: {
        type: String,
        trim: true,
        default: 'standard-ssd'
      },
      sizeGb: {
        type: Number
      }
    },
    // Network configuration
    network: {
      publicIpEnabled: {
        type: Boolean,
        default: false
      }
    },
    // High Availability configuration
    highAvailability: {
      zoneRedundancy: {
        type: Boolean,
        default: false
      }
    },
    // Tags
    tags: [
      {
        key: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
        _id: false
      }
    ],
    // Creator reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    // Compatibility owner reference
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    // Lifecycle status
    status: {
      type: String,
      enum: ['provisioning', 'running', 'stopped', 'active', 'failed'],
      default: 'provisioning'
    }
  },
  {
    timestamps: true
  }
);

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
