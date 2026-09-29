import cron from 'node-cron';
import Notification from '../models/notification.model.js';
import Resource from '../models/resource.model.js';

/**
 * Creates and saves a new notification.
 *
 * @param {Object} data
 * @param {string|mongoose.Types.ObjectId} data.userId
 * @param {string|mongoose.Types.ObjectId} [data.resourceId]
 * @param {string} data.type
 * @param {string} data.title
 * @param {string} data.message
 * @returns {Promise<Object>} The created notification document
 */
export const createNotification = async ({ userId, resourceId, type, title, message }) => {
  return await Notification.create({
    userId,
    resourceId,
    type,
    title,
    message
  });
};

/**
 * Retrieves notifications for a given user.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {Object} [filter={}] Optional extra query filters (e.g. { isRead: false })
 * @returns {Promise<Array>} List of notification documents sorted by newest first
 */
export const getUserNotifications = async (userId, filter = {}) => {
  return await Notification.find({ userId, ...filter }).sort({ createdAt: -1 });
};

/**
 * Marks a single notification as read for a given user.
 *
 * @param {string} id Notification ID
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Object|null>} The updated notification or null if not found
 */
export const markNotificationAsRead = async (id, userId) => {
  const notification = await Notification.findOne({ _id: id, userId });
  if (!notification) {
    return null;
  }
  notification.isRead = true;
  await notification.save();
  return notification;
};

/**
 * Marks all unread notifications as read for a given user.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Object>} Update result
 */
export const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
};

/**
 * Deletes a notification belonging to a specific user.
 *
 * @param {string} id Notification ID
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Object|null>} Deleted notification document or null if not found/not owned
 */
export const deleteNotification = async (id, userId) => {
  return await Notification.findOneAndDelete({ _id: id, userId });
};

/**
 * Checks running resources that have been active for >= thresholdMs (default 5 minutes)
 * without a notification sent yet, creates a 'resource_running_5_minutes' notification
 * for the resource owner, and marks runningNotificationSent = true.
 *
 * - Checks ONLY: status = 'running', startedAt exists, runningNotificationSent = false.
 * - Ignores old running resources without startedAt.
 * - Prevents duplicate notifications atomically.
 *
 * @param {number} [thresholdMs=300000] Running threshold in milliseconds (default: 5 minutes)
 * @returns {Promise<Array>} List of created notifications
 */
export const checkRunningResources = async (thresholdMs = 5 * 60 * 1000) => {
  const cutoffTime = new Date(Date.now() - thresholdMs);

  // Find eligible resources: status=running, startedAt exists and <= cutoffTime, runningNotificationSent=false
  const candidateResources = await Resource.find({
    status: 'running',
    startedAt: { $exists: true, $ne: null, $lte: cutoffTime },
    runningNotificationSent: false
  });

  const createdNotifications = [];

  for (const resource of candidateResources) {
    // Atomically claim the notification to strictly prevent duplicate notifications
    const updated = await Resource.findOneAndUpdate(
      {
        _id: resource._id,
        status: 'running',
        runningNotificationSent: false
      },
      {
        $set: { runningNotificationSent: true }
      },
      { returnDocument: 'after' }
    );

    // If successfully claimed, create the resource_running_5_minutes notification for resource.ownerId
    if (updated) {
      const targetUserId = resource.ownerId || resource.createdBy;
      const resourceName = resource.resourceName || resource.name || 'Resource';

      try {
        const notif = await createNotification({
          userId: targetUserId,
          resourceId: resource._id,
          type: 'resource_running_5_minutes',
          title: 'Resource Running for 5 Minutes',
          message: `Resource "${resourceName}" has been running for 5 minutes.`
        });
        createdNotifications.push(notif);
      } catch (err) {
        // Log non-blocking notification creation error
        console.error(`Failed to create 5-min notification for resource ${resource._id}:`, err.message);
      }
    }
  }

  return createdNotifications;
};

let cronTask = null;

/**
 * Starts the 1-minute recurring cron job to check for running resources.
 *
 * @returns {Object} node-cron scheduled task
 */
export const startResourceRunningCron = () => {
  if (cronTask) {
    return cronTask;
  }

  // Run every 1 minute
  cronTask = cron.schedule('* * * * *', async () => {
    try {
      await checkRunningResources();
    } catch (err) {
      console.error('Error executing resource running cron check:', err.message);
    }
  });

  return cronTask;
};

/**
 * Stops the recurring cron task if active.
 */
export const stopResourceRunningCron = () => {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
  }
};

export default {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  checkRunningResources,
  startResourceRunningCron,
  stopResourceRunningCron
};
