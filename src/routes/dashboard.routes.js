import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkUserExists } from '../middlewares/checkUser.middleware.js';

const router = Router();

// Protect all dashboard routes with authenticate -> checkUserExists
router.use(authenticate, checkUserExists);

// GET /api/dashboard/summary
router.get('/summary', getDashboardSummary);

export default router;
