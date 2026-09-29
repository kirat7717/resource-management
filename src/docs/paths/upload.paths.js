/**
 * @openapi
 * /api/uploads/avatar:
 *   post:
 *     summary: Upload avatar image
 *     description: Uploads a user avatar image (jpg, jpeg, png, webp; max 2MB) and returns its accessible public URL.
 *     tags:
 *       - Uploads
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file to upload
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: http://localhost:5000/uploads/avatars/avatar-1711234567-123456.jpg
 *       400:
 *         description: Invalid image file type or file size exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Avatar file size exceeds the 2MB limit
 */
