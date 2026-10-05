/**
 * @openapi
 * /api/resources/shared-with-me:
 *   get:
 *     summary: Get resources shared with me
 *     description: Retrieves all cloud resources shared with the authenticated user, including permission level (viewer or editor). Supports pagination and search.
 *     tags:
 *       - Resource Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search matching resource name or owner name
 *     responses:
 *       200:
 *         description: Shared resources retrieved successfully
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
 *                   example: Shared resources retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           permission:
 *                             type: string
 *                             enum: [viewer, editor]
 *                           sharedAt:
 *                             type: string
 *                             format: date-time
 *                           owner:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *       401:
 *         description: Authentication required
 *
 * /api/resources/shared-by-me:
 *   get:
 *     summary: Get resources shared by me
 *     description: Retrieves all cloud resources owned by the authenticated user that have been shared with other users, including recipient details and permission. Supports pagination and search.
 *     tags:
 *       - Resource Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search matching resource name or shared-with user name
 *     responses:
 *       200:
 *         description: Resources shared by you retrieved successfully
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
 *                   example: Resources shared by you retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           shareId:
 *                             type: string
 *                           permission:
 *                             type: string
 *                             enum: [viewer, editor]
 *                           sharedAt:
 *                             type: string
 *                             format: date-time
 *                           sharedWith:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                               organizationName:
 *                                 type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *       401:
 *         description: Authentication required
 *
 * /api/resources/{id}/shares:
 *   post:
 *     summary: Share a resource with a friend
 *     description: Resource owner shares a resource with an accepted friend as viewer or editor.
 *     tags:
 *       - Resource Sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Valid MongoDB ObjectId of friend user
 *                 example: 660c2134567890abcdef1234
 *               permission:
 *                 type: string
 *                 enum: [viewer, editor]
 *                 default: viewer
 *                 example: viewer
 *     responses:
 *       201:
 *         description: Resource shared successfully
 *       400:
 *         description: Cannot share with yourself, not friends, or duplicate share
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only the resource owner can share
 *       404:
 *         description: Resource or user not found
 */
