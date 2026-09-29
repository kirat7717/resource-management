import mongoose from 'mongoose';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../services/notification.service.js';

/**
 * Formats a notification document for API responses.
 *
 * @param {Object} notification
 * @returns {Object}
 */
export const formatNotification = (notification) => ({
  id: notification._id,
  userId: notification.userId,
  resourceId: notification.resourceId,
  type: notification.type,
  title: notification.title,
  message: notification.message,
  isRead: notification.isRead,
  createdAt: notification.createdAt,
  updatedAt: notification.updatedAt
});

/**
 * GET /api/notifications
 * Retrieves all notifications for the authenticated user.
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.auth?.userId || req.auth?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const filter = {};
    if (req.query.unreadOnly === 'true' || req.query.isRead === 'false') {
      filter.isRead = false;
    } else if (req.query.isRead === 'true') {
      filter.isRead = true;
    }

    const notifications = await getUserNotifications(userId, filter);
    const formatted = notifications.map(formatNotification);

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications: formatted
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving notifications'
    });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read.
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.auth?.userId || req.auth?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await markNotificationAsRead(id, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: formatNotification(notification)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the notification'
    });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications as read for the authenticated user.
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.auth?.userId || req.auth?.id;

    const result = await markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating notifications'
    });
  }
};

/**
 * DELETE /api/notifications/:id
 * Deletes a notification belonging to the authenticated user.
 */
export const deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.auth?.userId || req.auth?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const deleted = await deleteNotification(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the notification'
    });
  }
};
