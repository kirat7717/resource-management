import mongoose from 'mongoose';
import Resource from '../models/resource.model.js';
import ActivityLog from '../models/activityLog.model.js';
import Subscription from '../models/subscription.model.js';
import ResourceGroup from '../models/resourceGroup.model.js';
import ResourceType from '../models/resourceType.model.js';
import Region from '../models/region.model.js';
import User from '../models/user.model.js';
import FriendRequest from '../models/friendRequest.model.js';
import ResourceShare from '../models/resourceShare.model.js';
import { createResourceSchema, updateResourceSchema, shareResourceSchema } from '../validations/resource.validation.js';
import { sendResourceCreatedEmail } from '../emails/resource.email.js';
import { buildSearch } from '../utils/query/search.js';
import { buildFilter } from '../utils/query/filter.js';
import { buildSort } from '../utils/query/sort.js';
import { getPagination, getPaginationMeta } from '../utils/query/pagination.js';
import { createNotification } from '../services/notification.service.js';

/**
 * Simple helper to check access to a resource.
 * Returns { resource, permission: 'owner' | 'editor' | 'viewer' } or null.
 */
export const getResourceAccess = async (resourceId, userId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) return null;

  if (resource.ownerId && resource.ownerId.toString() === userId.toString()) {
    return { resource, permission: 'owner' };
  }

  const share = await ResourceShare.findOne({
    resourceId,
    sharedWith: userId
  });

  if (share) {
    return { resource, permission: share.permission };
  }

  return null;
};

/**
 * GET /api/resources
 * Retrieves a paginated list of resources owned by the authenticated user.
 * Supports search (name, description), filters (status, type, subscriptionId, resourceGroupId, regionId),
 * sorting (name, type, status, createdAt, updatedAt), and pagination (page, limit).
 */
export const getResources = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

    // 1. Search only 'name' and 'description'
    const searchCondition = buildSearch(req.query.search, ['name', 'description']);

    // 2. Filters: allow only status, type, subscriptionId, resourceGroupId, regionId
    const allowedFilters = ['status', 'type', 'subscriptionId', 'resourceGroupId', 'regionId'];
    const filterCondition = buildFilter(req.query, allowedFilters);

    // Validate ObjectId filters safely
    const objectIdFields = ['subscriptionId', 'resourceGroupId', 'regionId'];
    const hasInvalidObjectId = objectIdFields.some(
      (field) => filterCondition[field] && !mongoose.Types.ObjectId.isValid(filterCondition[field])
    );

    if (hasInvalidObjectId) {
      const pagination = getPaginationMeta(0, page, limit);
      return res.status(200).json({
        success: true,
        message: 'Resources retrieved successfully',
        data: {
          resources: [],
          pagination
        }
      });
    }

    // 3. Sorting: allow only name, type, status, createdAt, updatedAt (default: createdAt desc)
    const allowedSortFields = ['name', 'type', 'status', 'createdAt', 'updatedAt'];
    const sortCondition = buildSort(req.query.sortBy, req.query.sortOrder, allowedSortFields);

    // 4. Base query: ownership filter + search + filters
    const query = {
      ownerId: req.user._id,
      ...filterCondition,
      ...searchCondition
    };

    // 5. Total count using countDocuments()
    const totalItems = await Resource.countDocuments(query);

    // 6. Fetch resources
    const resources = await Resource.find(query)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);

    // 7. Explicitly format response items (consistent with POST /api/resources)
    const formattedResources = resources.map((resource) => ({
      id: resource._id,
      name: resource.resourceName || resource.name,
      type: resource.type,
      subscriptionId: resource.subscriptionId || resource.subscription,
      resourceGroupId: resource.resourceGroupId || resource.resourceGroup,
      regionId: resource.regionId || resource.region,
      description: resource.description,
      ownerId: resource.ownerId || resource.createdBy,
      status: resource.status,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt
    }));

    // 8. Pagination metadata
    const pagination = getPaginationMeta(totalItems, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Resources retrieved successfully',
      data: {
        resources: formattedResources,
        pagination
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving resources'
    });
  }
};

/**
 * POST /api/resources
 * Creates a new cloud resource under an active Subscription, ResourceGroup, ResourceType, and Region.
 * Records the authenticated user as the creator and calculates estimated monthly cost.
 */
export const createResource = async (req, res) => {
  try {
    // 1. Validate request body directly with Joi inside the controller
    const { error, value } = createResourceSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const {
      resourceName,
      resourceType,
      subscription,
      resourceGroup,
      region,
      description,
      hardwareProfile,
      storage,
      network,
      highAvailability,
      tags
    } = value;

    // 2. Find and verify active Subscription
    const subDoc = await Subscription.findById(subscription);
    if (!subDoc) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    if (subDoc.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Subscription is not active'
      });
    }

    // 3. Find and verify active ResourceGroup (independent reference ID)
    const rgDoc = await ResourceGroup.findById(resourceGroup);
    if (!rgDoc) {
      return res.status(404).json({
        success: false,
        message: 'Resource group not found'
      });
    }
    if (rgDoc.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Resource group is not active'
      });
    }

    // 4. Find and verify active ResourceType
    const rtDoc = await ResourceType.findById(resourceType);
    if (!rtDoc) {
      return res.status(404).json({
        success: false,
        message: 'Resource type not found'
      });
    }
    if (rtDoc.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Resource type is not active'
      });
    }

    // 5. Find and verify active Region (independent reference ID)
    const regDoc = await Region.findById(region);
    if (!regDoc) {
      return res.status(404).json({
        success: false,
        message: 'Region not found'
      });
    }
    if (regDoc.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Region is not active'
      });
    }

    // 6. Initial status according to existing Resource model
    const initialStatus = 'provisioning';

    // 7. Create resource document with createdBy from req.user._id
    const resourceDoc = {
      resourceName,
      name: resourceName,
      resourceType,
      type: rtDoc.name,
      subscription,
      subscriptionId: subscription,
      resourceGroup,
      resourceGroupId: resourceGroup,
      region,
      regionId: region,
      description: description || '',
      status: initialStatus,
      createdBy: req.user._id,
      ownerId: req.user._id
    };

    if (hardwareProfile) {
      resourceDoc.hardwareProfile = hardwareProfile;
    }
    if (storage) {
      resourceDoc.storage = {
        type: storage.type || 'standard-ssd',
        sizeGb: storage.sizeGb
      };
    }
    if (network) {
      resourceDoc.network = {
        publicIpEnabled: Boolean(network.publicIpEnabled)
      };
    }
    if (highAvailability) {
      resourceDoc.highAvailability = {
        zoneRedundancy: Boolean(highAvailability.zoneRedundancy)
      };
    }
    if (tags && Array.isArray(tags)) {
      resourceDoc.tags = tags;
    }

    const newResource = await Resource.create(resourceDoc);

    // 8. Create ActivityLog entry
    try {
      await ActivityLog.create({
        userId: req.user._id,
        ownerId: req.user._id,
        resourceId: newResource._id,
        action: 'create',
        details: {
          name: newResource.resourceName,
          type: rtDoc.name
        }
      });
    } catch (logErr) {
      // Non-blocking log error
    }

    // 9. Send notification email asynchronously in the background (non-blocking)
    sendResourceCreatedEmail({
      email: req.user.email || req.user.workEmail,
      name: req.user.name,
      resource: {
        _id: newResource._id,
        name: newResource.resourceName,
        type: rtDoc.name,
        status: newResource.status
      }
    }).catch((emailErr) => {
      console.error(`Failed to send resource creation email for resource ${newResource._id}:`, emailErr.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: formatResource(newResource)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the resource'
    });
  }
};

/**
 * Format resource document to safe response object matching existing API response
 * and containing all accumulated fields across creation steps.
 */
export const formatResource = (resource) => {
  const formatted = {
    id: resource._id,
    resourceName: resource.resourceName || resource.name,
    name: resource.resourceName || resource.name,
    resourceType: resource.resourceType,
    type: resource.type,
    subscription: resource.subscription || resource.subscriptionId,
    subscriptionId: resource.subscriptionId || resource.subscription,
    resourceGroup: resource.resourceGroup || resource.resourceGroupId,
    resourceGroupId: resource.resourceGroupId || resource.resourceGroup,
    region: resource.region || resource.regionId,
    regionId: resource.regionId || resource.region,
    description: resource.description || '',
    status: resource.status,
    startedAt: resource.startedAt,
    runningNotificationSent: resource.runningNotificationSent ?? false,
    createdBy: resource.createdBy || resource.ownerId,
    ownerId: resource.ownerId || resource.createdBy,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt
  };

  if (resource.hardwareProfile) {
    formatted.hardwareProfile = resource.hardwareProfile;
  }
  if (resource.storage && (resource.storage.sizeGb !== undefined || resource.storage.type)) {
    formatted.storage = {
      type: resource.storage.type || 'standard-ssd',
      sizeGb: resource.storage.sizeGb
    };
  }
  if (resource.network && resource.network.publicIpEnabled !== undefined) {
    formatted.network = {
      publicIpEnabled: resource.network.publicIpEnabled
    };
  }
  if (resource.highAvailability && resource.highAvailability.zoneRedundancy !== undefined) {
    formatted.highAvailability = {
      zoneRedundancy: resource.highAvailability.zoneRedundancy
    };
  }
  if (resource.tags && Array.isArray(resource.tags)) {
    formatted.tags = resource.tags.map((t) => ({ key: t.key, value: t.value }));
  }

  return formatted;
};

/**
 * GET /api/resources/:id
 * Retrieves a single resource by ID owned by the authenticated user (Form 4 accumulated view).
 */
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    // Check access (owner, viewer, or editor)
    const access = await getResourceAccess(id, req.user._id);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const formatted = formatResource(access.resource);
    formatted.permission = access.permission;

    return res.status(200).json({
      success: true,
      message: 'Resource retrieved successfully',
      data: formatted
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the resource'
    });
  }
};

/**
 * PATCH /api/resources/:id
 * Progressively updates a resource owned by the authenticated user (Forms 2 & 3).
 */
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate MongoDB ObjectId for :id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    // 2. Validate request body against updateResourceSchema
    const { error, value } = updateResourceSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // 3. Find resource by ID and verify access
    const access = await getResourceAccess(id, req.user._id);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (access.permission === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Viewers are not allowed to update this resource'
      });
    }

    const resource = access.resource;

    // 4. Validate reference documents if being updated
    if (value.subscription) {
      const subDoc = await Subscription.findById(value.subscription);
      if (!subDoc) {
        return res.status(404).json({ success: false, message: 'Subscription not found' });
      }
      if (subDoc.status !== 'active') {
        return res.status(400).json({ success: false, message: 'Subscription is not active' });
      }
      resource.subscription = value.subscription;
      resource.subscriptionId = value.subscription;
    }

    if (value.resourceGroup) {
      const rgDoc = await ResourceGroup.findById(value.resourceGroup);
      if (!rgDoc) {
        return res.status(404).json({ success: false, message: 'Resource group not found' });
      }
      if (rgDoc.status !== 'active') {
        return res.status(400).json({ success: false, message: 'Resource group is not active' });
      }
      resource.resourceGroup = value.resourceGroup;
      resource.resourceGroupId = value.resourceGroup;
    }

    if (value.resourceType) {
      const rtDoc = await ResourceType.findById(value.resourceType);
      if (!rtDoc) {
        return res.status(404).json({ success: false, message: 'Resource type not found' });
      }
      if (rtDoc.status !== 'active') {
        return res.status(400).json({ success: false, message: 'Resource type is not active' });
      }
      resource.resourceType = value.resourceType;
      resource.type = rtDoc.name;
    }

    if (value.region) {
      const regDoc = await Region.findById(value.region);
      if (!regDoc) {
        return res.status(404).json({ success: false, message: 'Region not found' });
      }
      if (regDoc.status !== 'active') {
        return res.status(400).json({ success: false, message: 'Region is not active' });
      }
      resource.region = value.region;
      resource.regionId = value.region;
    }

    if (value.hardwareProfile !== undefined) {
      resource.hardwareProfile = value.hardwareProfile;
    }

    if (value.resourceName !== undefined) {
      resource.resourceName = value.resourceName;
      resource.name = value.resourceName;
    }

    if (value.description !== undefined) {
      resource.description = value.description;
    }

    if (value.storage) {
      resource.storage = {
        type: value.storage.type || resource.storage?.type || 'standard-ssd',
        sizeGb: value.storage.sizeGb !== undefined ? value.storage.sizeGb : resource.storage?.sizeGb
      };
    }

    if (value.network) {
      resource.network = {
        publicIpEnabled: value.network.publicIpEnabled !== undefined
          ? Boolean(value.network.publicIpEnabled)
          : (resource.network?.publicIpEnabled ?? false)
      };
    }

    if (value.highAvailability) {
      resource.highAvailability = {
        zoneRedundancy: value.highAvailability.zoneRedundancy !== undefined
          ? Boolean(value.highAvailability.zoneRedundancy)
          : (resource.highAvailability?.zoneRedundancy ?? false)
      };
    }

    if (value.tags !== undefined) {
      resource.tags = value.tags;
    }

    await resource.save();

    // Create Notification for resource_updated if updated by Editor
    if (access.permission === 'editor' && resource.ownerId && resource.ownerId.toString() !== req.user._id.toString()) {
      try {
        const resourceName = resource.resourceName || resource.name || 'Resource';
        await createNotification({
          userId: resource.ownerId,
          resourceId: resource._id,
          type: 'resource_updated',
          title: 'Resource Updated',
          message: `${req.user.name} updated your resource "${resourceName}".`
        });
      } catch (notifErr) {
        // Non-blocking notification error
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: formatResource(resource)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the resource'
    });
  }
};

/**
 * POST /api/resources/:id/start
 * Starts a resource owned by the authenticated user.
 */
export const startResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    // Find resource by ID and verify access
    const access = await getResourceAccess(id, req.user._id);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (access.permission === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Viewers are not allowed to start this resource'
      });
    }

    const resource = access.resource;

    // If status is already running, return safe idempotent success without duplicate activity
    if (resource.status === 'running') {
      return res.status(200).json({
        success: true,
        message: 'Resource is already running',
        data: formatResource(resource)
      });
    }

    const previousStatus = resource.status;
    resource.status = 'running';
    resource.startedAt = new Date();
    resource.runningNotificationSent = false;
    await resource.save();

    // Create ActivityLog for the start action
    await ActivityLog.create({
      userId: req.user._id,
      ownerId: req.user._id,
      resourceId: resource._id,
      action: 'start',
      details: { previousStatus, newStatus: 'running' }
    });

    // Create Notification for resource_started
    try {
      const resourceName = resource.resourceName || resource.name || 'Resource';
      const isEditor = access.permission === 'editor' && resource.ownerId && resource.ownerId.toString() !== req.user._id.toString();

      if (isEditor) {
        await createNotification({
          userId: resource.ownerId,
          resourceId: resource._id,
          type: 'resource_started',
          title: 'Resource Started',
          message: `${req.user.name} started your resource "${resourceName}".`
        });
      } else {
        await createNotification({
          userId: req.user._id,
          resourceId: resource._id,
          type: 'resource_started',
          title: 'Resource Started',
          message: `Resource "${resourceName}" has been started.`
        });
      }
    } catch (notifErr) {
      // Non-blocking notification error
    }

    return res.status(200).json({
      success: true,
      message: 'Resource started successfully',
      data: formatResource(resource)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while starting the resource'
    });
  }
};

/**
 * POST /api/resources/:id/stop
 * Stops a resource owned by the authenticated user.
 */
export const stopResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    // Find resource by ID and verify access
    const access = await getResourceAccess(id, req.user._id);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (access.permission === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Viewers are not allowed to stop this resource'
      });
    }

    const resource = access.resource;

    // If status is already stopped, return safe idempotent success without duplicate activity
    if (resource.status === 'stopped') {
      return res.status(200).json({
        success: true,
        message: 'Resource is already stopped',
        data: formatResource(resource)
      });
    }

    const previousStatus = resource.status;
    resource.status = 'stopped';
    resource.startedAt = null;
    resource.runningNotificationSent = false;
    await resource.save();

    // Create ActivityLog for the stop action
    await ActivityLog.create({
      userId: req.user._id,
      ownerId: req.user._id,
      resourceId: resource._id,
      action: 'stop',
      details: { previousStatus, newStatus: 'stopped' }
    });

    // Create Notification for resource_stopped
    try {
      const resourceName = resource.resourceName || resource.name || 'Resource';
      const isEditor = access.permission === 'editor' && resource.ownerId && resource.ownerId.toString() !== req.user._id.toString();

      if (isEditor) {
        await createNotification({
          userId: resource.ownerId,
          resourceId: resource._id,
          type: 'resource_stopped',
          title: 'Resource Stopped',
          message: `${req.user.name} stopped your resource "${resourceName}".`
        });
      } else {
        await createNotification({
          userId: req.user._id,
          resourceId: resource._id,
          type: 'resource_stopped',
          title: 'Resource Stopped',
          message: `Resource "${resourceName}" has been stopped.`
        });
      }
    } catch (notifErr) {
      // Non-blocking notification error
    }

    return res.status(200).json({
      success: true,
      message: 'Resource stopped successfully',
      data: formatResource(resource)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while stopping the resource'
    });
  }
};

/**
 * DELETE /api/resources/:id
 * Deletes a resource owned by the authenticated user.
 */
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    // Find resource by ID
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Only owner can delete resource
    if (resource.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the resource owner can delete this resource'
      });
    }

    await Resource.deleteOne({ _id: resource._id });
    await ResourceShare.deleteMany({ resourceId: resource._id });

    // Create ActivityLog for the delete action
    await ActivityLog.create({
      userId: req.user._id,
      ownerId: req.user._id,
      resourceId: resource._id,
      action: 'delete',
      details: { name: resource.name, type: resource.type, status: resource.status }
    });

    // Create Notification for resource_deleted
    try {
      const resourceName = resource.resourceName || resource.name || 'Resource';
      await createNotification({
        userId: req.user._id,
        resourceId: resource._id,
        type: 'resource_deleted',
        title: 'Resource Deleted',
        message: `Resource "${resourceName}" has been deleted.`
      });
    } catch (notifErr) {
      // Non-blocking notification error
    }

    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the resource'
    });
  }
};

/**
 * POST /api/resources/:id/shares
 * Shares a resource owned by the authenticated user with an accepted friend.
 */
export const shareResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    const { error, value } = shareResourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Only the resource owner can share
    if (resource.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the resource owner can share this resource'
      });
    }

    const { userId, permission = 'viewer' } = value;

    // Do not allow sharing with yourself
    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot share resource with yourself'
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // User must be an accepted friend
    const friendship = await FriendRequest.findOne({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ],
      status: 'accepted'
    });

    if (!friendship) {
      return res.status(400).json({
        success: false,
        message: 'User must be an accepted friend to share resources'
      });
    }

    // Do not create duplicate shares
    const existingShare = await ResourceShare.findOne({
      resourceId: resource._id,
      sharedWith: userId
    });

    if (existingShare) {
      return res.status(400).json({
        success: false,
        message: 'Resource is already shared with this user'
      });
    }

    const share = await ResourceShare.create({
      resourceId: resource._id,
      ownerId: req.user._id,
      sharedWith: userId,
      permission
    });

    // Create notification for sharedWith user
    try {
      const resourceName = resource.resourceName || resource.name || 'Resource';
      const capPermission = permission === 'editor' ? 'Editor' : 'Viewer';
      await createNotification({
        userId,
        resourceId: resource._id,
        type: 'resource_shared',
        title: 'Resource Shared',
        message: `${req.user.name} shared "${resourceName}" with you as ${capPermission}.`
      });
    } catch (notifErr) {
      // Non-blocking notification error
    }

    return res.status(201).json({
      success: true,
      message: 'Resource shared successfully',
      data: share
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sharing the resource'
    });
  }
};

/**
 * GET /api/resources/shared-with-me
 * Retrieves all resources shared with the authenticated user, including permission.
 * Supports optional pagination (?page=1&limit=10) and search (?search=...) by resource name or owner name.
 */
export const getSharedWithMeResources = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const query = { sharedWith: req.user._id };

    if (search) {
      const matchingOwners = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const matchingOwnerIds = matchingOwners.map((u) => u._id);

      const matchingResources = await Resource.find({
        $or: [
          { resourceName: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const matchingResourceIds = matchingResources.map((r) => r._id);

      query.$or = [
        { resourceId: { $in: matchingResourceIds } },
        { ownerId: { $in: matchingOwnerIds } }
      ];
    }

    const total = await ResourceShare.countDocuments(query);
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    const shares = await ResourceShare.find(query)
      .populate('resourceId')
      .populate('ownerId', 'name email avatar organizationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedResources = shares
      .filter((share) => share.resourceId)
      .map((share) => {
        const formatted = formatResource(share.resourceId);
        formatted.permission = share.permission;
        formatted.sharedAt = share.createdAt;
        formatted.owner = share.ownerId
          ? {
              id: share.ownerId._id,
              name: share.ownerId.name,
              email: share.ownerId.email
            }
          : null;
        return formatted;
      });

    return res.status(200).json({
      success: true,
      message: 'Shared resources retrieved successfully',
      data: {
        resources: formattedResources,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving shared resources'
    });
  }
};

/**
 * GET /api/resources/shared-by-me
 * Retrieves all resources owned by the authenticated user that have been shared with other users.
 * Supports optional pagination (?page=1&limit=10) and search (?search=...) by resource name or shared-with user name.
 */
export const getSharedByMeResources = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const query = { ownerId: req.user._id };

    if (search) {
      const matchingUsers = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const matchingUserIds = matchingUsers.map((u) => u._id);

      const matchingResources = await Resource.find({
        $or: [
          { resourceName: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const matchingResourceIds = matchingResources.map((r) => r._id);

      query.$or = [
        { resourceId: { $in: matchingResourceIds } },
        { sharedWith: { $in: matchingUserIds } }
      ];
    }

    const total = await ResourceShare.countDocuments(query);
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    const shares = await ResourceShare.find(query)
      .populate('resourceId')
      .populate('sharedWith', 'name email avatar organizationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedShares = shares
      .filter((share) => share.resourceId)
      .map((share) => {
        const formatted = formatResource(share.resourceId);
        formatted.shareId = share._id;
        formatted.permission = share.permission;
        formatted.sharedAt = share.createdAt;
        formatted.sharedWith = share.sharedWith
          ? {
              id: share.sharedWith._id,
              name: share.sharedWith.name,
              email: share.sharedWith.email,
              avatar: share.sharedWith.avatar || '',
              organizationName: share.sharedWith.organizationName || ''
            }
          : null;
        return formatted;
      });

    return res.status(200).json({
      success: true,
      message: 'Resources shared by you retrieved successfully',
      data: {
        resources: formattedShares,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving resources shared by you'
    });
  }
};


