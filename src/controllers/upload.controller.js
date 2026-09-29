import 'dotenv/config';

// Controller to handle single avatar upload
export const uploadAvatar = (req, res) => {
  // Check if file exists in request
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an avatar image file'
    });
  }

  // Use BACKEND_URL from environment and remove trailing slash to prevent double slashes
  const baseUrl = (process.env.NGROK_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
  const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;

  // Send success response with uploaded image URL
  return res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      url: avatarUrl
    }
  });
};
