import { Router } from 'express';
import { getDiscoverUsers } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkUserExists } from '../middlewares/checkUser.middleware.js';

const router = Router();

// Protect all user routes
router.use(authenticate, checkUserExists);

// GET /api/users/discover
router.get('/discover', getDiscoverUsers);

export default router;
