import { Router } from 'express';
import { uploadAvatar } from '../controllers/upload.controller.js';
import { uploadAvatarMiddleware } from '../utils/multer.js';

const router = Router();

// POST /api/uploads/avatar - Upload an avatar image
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar);

export default router;
