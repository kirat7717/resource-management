import { Router } from 'express';
import {
  sendFriendRequest,
  respondFriendRequest,
  getPendingFriendRequests
} from '../controllers/friend.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkUserExists } from '../middlewares/checkUser.middleware.js';

const router = Router();

// Protect all friend routes
router.use(authenticate, checkUserExists);

// GET /api/friends/requests/pending - Get pending friend requests received by logged-in user
router.get('/requests/pending', getPendingFriendRequests);

// POST /api/friends/requests - Send a friend request
router.post('/requests', sendFriendRequest);

// PATCH /api/friends/requests/:id - Accept or reject a friend request
router.patch('/requests/:id', respondFriendRequest);

export default router;
