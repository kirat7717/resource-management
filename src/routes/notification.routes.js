import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotificationById
} from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all notification routes using the existing authenticate middleware
router.use(authenticate);

// Fallback to populate req.user if only authenticate was used without checkUserExists
router.use((req, res, next) => {
  if (!req.user && req.auth) {
    req.user = {
      _id: req.auth.userId || req.auth.id || req.auth._id,
      ...req.auth
    };
  }
  next();
});

// GET /api/notifications - Get all notifications for authenticated user
router.get('/', getNotifications);

// PATCH /api/notifications/read-all - Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// PATCH /api/notifications/:id/read - Mark a single notification as read
router.patch('/:id/read', markAsRead);

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', deleteNotificationById);

export default router;
