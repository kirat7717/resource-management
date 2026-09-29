import { Router } from 'express';
import {
  getSubscriptions,
  getResourceGroups,
  getResourceTypes,
  getRegions,
  getHardwareProfiles,
  getTagSuggestions
} from '../controllers/lookup.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkUserExists } from '../middlewares/checkUser.middleware.js';

const router = Router();

// Protect all lookup routes with authenticate
router.use(authenticate);

// GET /api/subscriptions
router.get('/subscriptions', getSubscriptions);

// GET /api/resource-groups
router.get('/resource-groups', getResourceGroups);

// GET /api/resource-types
router.get('/resource-types', getResourceTypes);

// GET /api/regions
router.get('/regions', getRegions);

// GET /api/hardware-profiles
router.get('/hardware-profiles', getHardwareProfiles);

// GET /api/tag-suggestions
router.get('/tag-suggestions', getTagSuggestions);

export default router;
