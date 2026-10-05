/**
 * @openapi
 * /api/users/discover:
 *   get:
 *     summary: Discover users
 *     description: Returns a list of registered users excluding the authenticated user, along with friendship status.
 *     tags:
 *       - Friends & Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query matching name, email, or organizationName
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
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           organizationName:
 *                             type: string
 *                           friendStatus:
 *                             type: string
 *                             enum: [none, pending, accepted, rejected]
 *                           friendRequestId:
 *                             type: string
 *                             nullable: true
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *       401:
 *         description: Authentication required
 *
 * /api/friends/requests:
 *   post:
 *     summary: Send a friend request
 *     description: Sends a friend request to another user.
 *     tags:
 *       - Friends & Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: Valid MongoDB ObjectId of recipient user
 *                 example: 660c2134567890abcdef1234
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *       400:
 *         description: Validation error or duplicate request
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Recipient user not found
 *
 * /api/friends/requests/{id}:
 *   patch:
 *     summary: Respond to a friend request
 *     description: Recipient can accept or reject a pending friend request.
 *     tags:
 *       - Friends & Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Friend request ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Friend request responded successfully
 *       400:
 *         description: Invalid input or already processed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not the recipient of the request
 *       404:
 *         description: Friend request not found
 */
