import { Router } from 'express';
import {
  sendFriendRequest,
  respondFriendRequest
} from '../controllers/friend.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkUserExists } from '../middlewares/checkUser.middleware.js';

const router = Router();

// Protect all friend routes
router.use(authenticate, checkUserExists);

// POST /api/friends/requests - Send a friend request
router.post('/requests', sendFriendRequest);

// PATCH /api/friends/requests/:id - Accept or reject a friend request
router.patch('/requests/:id', respondFriendRequest);

export default router;
