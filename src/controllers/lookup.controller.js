import Subscription from '../models/subscription.model.js';
import ResourceGroup from '../models/resourceGroup.model.js';
import ResourceType from '../models/resourceType.model.js';
import Region from '../models/region.model.js';
import HardwareProfile from '../models/hardwareProfile.model.js';
import TagSuggestion from '../models/tagSuggestion.model.js';

/**
 * GET /api/subscriptions
 * Retrieves all active cloud subscriptions (shared/static lookup data).
 */
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      status: { $ne: 'inactive' }
    }).sort({ name: 1 });

    const data = subscriptions.map((s) => ({
      id: s._id,
      name: s.name
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscriptions'
    });
  }
};

/**
 * GET /api/resource-groups
 * Retrieves resource groups (shared/static lookup data), optionally filtered by subscriptionId.
 */
export const getResourceGroups = async (req, res) => {
  try {
    const query = {
      status: { $ne: 'inactive' }
    };

    if (req.query.subscriptionId) {
      query.subscriptionId = req.query.subscriptionId;
    }

    const resourceGroups = await ResourceGroup.find(query).sort({ name: 1 });

    const data = resourceGroups.map((rg) => ({
      id: rg._id,
      name: rg.name,
      subscriptionId: rg.subscriptionId
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resource groups'
    });
  }
};

/**
 * GET /api/resource-types
 * Retrieves all active cloud resource types (shared/static lookup data).
 */
export const getResourceTypes = async (req, res) => {
  try {
    const resourceTypes = await ResourceType.find({
      status: { $ne: 'inactive' }
    }).sort({ name: 1 });

    const data = resourceTypes.map((rt) => ({
      id: rt._id,
      name: rt.name
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resource types'
    });
  }
};

/**
 * GET /api/regions
 * Retrieves all active cloud regions (shared/static lookup data).
 */
export const getRegions = async (req, res) => {
  try {
    const regions = await Region.find({
      status: { $ne: 'inactive' }
    }).sort({ name: 1 });

    const data = regions.map((r) => ({
      id: r._id,
      name: r.name
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve regions'
    });
  }
};

/**
 * GET /api/hardware-profiles
 * Retrieves all active hardware profiles (shared/static lookup data).
 */
export const getHardwareProfiles = async (req, res) => {
  try {
    const hardwareProfiles = await HardwareProfile.find({
      status: { $ne: 'inactive' }
    }).sort({ cpu: 1, ramGb: 1 });

    const data = hardwareProfiles.map((hp) => ({
      id: hp._id,
      name: hp.name,
      code: hp.code,
      cpu: hp.cpu,
      ramGb: hp.ramGb
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve hardware profiles'
    });
  }
};

/**
 * GET /api/tag-suggestions
 * Retrieves all active tag suggestions (shared/static lookup data).
 */
export const getTagSuggestions = async (req, res) => {
  try {
    const tagSuggestions = await TagSuggestion.find({
      isActive: true
    }).sort({ key: 1, value: 1 });

    const data = tagSuggestions.map((ts) => ({
      id: ts._id,
      key: ts.key,
      value: ts.value
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tag suggestions'
    });
  }
};


