import multer from 'multer';
import path from 'path';

// Destination folder for avatar uploads
const uploadDir = 'uploads/avatars';

// Multer disk storage configuration
const storage = multer.diskStorage({
  // Specify destination folder
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // Generate a simple unique filename
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${uniqueSuffix}${extension}`);
  }
});

// File filter to allow only image files: jpg, jpeg, png, webp
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const isExtValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = allowedExtensions.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only jpg, jpeg, png, and webp are allowed.'));
  }
};

// Multer upload setup with 2MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Simple middleware to handle avatar upload and return 400 on error
export const uploadAvatarMiddleware = (req, res, next) => {
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ])(req, res, (err) => {
    // Handle file size limit error
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Avatar file size exceeds the 2MB limit'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // Handle file type error from fileFilter
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    // Assign req.file from either avatar or image field
    if (req.files) {
      if (req.files.avatar && req.files.avatar.length > 0) {
        req.file = req.files.avatar[0];
      } else if (req.files.image && req.files.image.length > 0) {
        req.file = req.files.image[0];
      }
    }

    next();
  });
};
