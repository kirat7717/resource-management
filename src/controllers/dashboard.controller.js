import mongoose from 'mongoose';
import Resource from '../models/resource.model.js';
import ActivityLog from '../models/activityLog.model.js';
import { DASHBOARD_DATA } from '../data/dashboard.data.js';

/**
 * GET /api/dashboard/summary
 * Retrieves dashboard summary metrics, distributions, and recent activity.
 * Returns predefined data directly without database queries.
 */
export const getDashboardSummary = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: DASHBOARD_DATA
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving dashboard summary'
    });
  }
};

/**
 * Database-backed Dashboard implementation.
 * Kept intact for potential future use, but not exposed in Swagger.
 */
export const getDbDashboardSummary = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const [metricsResult, resourceTypeDistribution, regionDistribution, rawActivities] =
      await Promise.all([
        // 1. Metric cards: total, running, stopped, and errorsOrDegraded
        Resource.aggregate([
          { $match: { ownerId } },
          {
            $group: {
              _id: null,
              totalResources: { $sum: 1 },
              runningResources: {
                $sum: { $cond: [{ $eq: ['$status', 'running'] }, 1, 0] }
              },
              stoppedResources: {
                $sum: { $cond: [{ $eq: ['$status', 'stopped'] }, 1, 0] }
              }
            }
          }
        ]),

        // 2. Resource type distribution grouped by Resource.type
        Resource.aggregate([
          { $match: { ownerId } },
          {
            $group: {
              _id: '$type',
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              type: '$_id',
              count: '$count'
            }
          },
          { $sort: { count: -1, type: 1 } }
        ]),

        // 3. Region distribution grouped by regionId with region name from Region collection
        Resource.aggregate([
          { $match: { ownerId } },
          {
            $group: {
              _id: '$regionId',
              count: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'regions',
              localField: '_id',
              foreignField: '_id',
              as: 'regionInfo'
            }
          },
          {
            $unwind: {
              path: '$regionInfo',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 0,
              regionId: { $toString: '$_id' },
              region: { $ifNull: ['$regionInfo.name', 'Unknown'] },
              count: '$count'
            }
          },
          { $sort: { count: -1, region: 1 } }
        ]),

        // 4. Recent activity: latest 10 activities for authenticated user (newest first)
        ActivityLog.find({
          $or: [{ ownerId }, { userId: ownerId }],
          action: { $in: ['create', 'start', 'stop', 'delete'] }
        })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ]);

    const metrics = {
      totalResources: metricsResult[0]?.totalResources || 0,
      runningResources: metricsResult[0]?.runningResources || 0,
      stoppedResources: metricsResult[0]?.stoppedResources || 0,
      errorsOrDegraded: 0
    };

    const recentActivity = rawActivities.map((act) => ({
      id: act._id,
      action: act.action,
      resourceId: act.resourceId,
      details: act.details || {},
      createdAt: act.createdAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: {
        metrics,
        resourceTypeDistribution,
        regionDistribution,
        recentActivity
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving dashboard summary'
    });
  }
};
