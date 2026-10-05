import { Router } from 'express';
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  startResource,
  stopResource,
  deleteResource,
  shareResource,
  getSharedWithMeResources,
  getSharedByMeResources
} from '../controllers/resource.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkUserExists } from '../middlewares/checkUser.middleware.js';

const router = Router();

// Protect all resource routes with authenticate -> checkUserExists
router.use(authenticate, checkUserExists);

// GET /api/resources/shared-with-me - Get all resources shared with the authenticated user (MUST be before /:id)
router.get('/shared-with-me', getSharedWithMeResources);

// GET /api/resources/shared-by-me - Get all resources shared by the authenticated user (MUST be before /:id)
router.get('/shared-by-me', getSharedByMeResources);

// GET /api/resources - Get all resources with search, filter, sort, pagination
router.get('/', getResources);

// GET /api/resources/:id - Get a single resource by ID
router.get('/:id', getResourceById);

// POST /api/resources - Create a new resource (Form 1 / complete)
router.post('/', createResource);

// POST /api/resources/:id/shares - Share a resource with an accepted friend
router.post('/:id/shares', shareResource);

// PATCH /api/resources/:id - Progressively update a resource (Forms 2 & 3)
router.patch('/:id', updateResource);

// POST /api/resources/:id/start - Start a resource
router.post('/:id/start', startResource);

// POST /api/resources/:id/stop - Stop a resource
router.post('/:id/stop', stopResource);

// DELETE /api/resources/:id - Delete a resource
router.delete('/:id', deleteResource);

export default router;
