/**
 * @openapi
 * /api/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     description: Retrieves available cloud subscriptions (shared/static lookup data).
 *     tags:
 *       - Lookups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 660c2134567890abcdef1234
 *                       name:
 *                         type: string
 *                         example: Production
 *       401:
 *         description: Authentication required or invalid/missing token
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
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
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
 *                   example: Failed to retrieve subscriptions
 *
 * /api/resource-groups:
 *   get:
 *     summary: Get all resource groups
 *     description: Retrieves resource groups (shared/static lookup data), optionally filtered by subscriptionId.
 *     tags:
 *       - Lookups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subscriptionId
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional subscription ID to filter resource groups
 *     responses:
 *       200:
 *         description: List of resource groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 660c2134567890abcdef5678
 *                       name:
 *                         type: string
 *                         example: Production-RG
 *                       subscriptionId:
 *                         type: string
 *                         example: 660c2134567890abcdef1234
 *       401:
 *         description: Authentication required or invalid/missing token
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
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
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
 *                   example: Failed to retrieve resource groups
 *
 * /api/resource-types:
 *   get:
 *     summary: Get all resource types
 *     description: Retrieves available cloud resource types (shared/static lookup data).
 *     tags:
 *       - Lookups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resource types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 660c2134567890abcdef2468
 *                       name:
 *                         type: string
 *                         example: Virtual Machine
 *       401:
 *         description: Authentication required or invalid/missing token
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
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
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
 *                   example: Failed to retrieve resource types
 *
 * /api/regions:
 *   get:
 *     summary: Get all regions
 *     description: Retrieves available cloud regions (shared/static lookup data).
 *     tags:
 *       - Lookups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of regions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 660c2134567890abcdef1357
 *                       name:
 *                         type: string
 *                         example: East US
 *       401:
 *         description: Authentication required or invalid/missing token
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
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
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
 *                   example: Failed to retrieve regions
 *
 * /api/hardware-profiles:
 *   get:
 *     summary: Get all hardware profiles
 *     description: Retrieves available hardware profiles / VM sizing options (shared/static lookup data).
 *     tags:
 *       - Lookups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hardware profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 660c2134567890abcdef9876
 *                       name:
 *                         type: string
 *                         example: Standard B2s (Burstable)
 *                       code:
 *                         type: string
 *                         example: standard-b2s
 *                       cpu:
 *                         type: integer
 *                         example: 2
 *                       ramGb:
 *                         type: integer
 *                         example: 4
 *       401:
 *         description: Authentication required or invalid/missing token
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
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
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
 *                   example: Failed to retrieve hardware profiles
 *
 * /api/tag-suggestions:
 *   get:
 *     summary: Get all tag suggestions
 *     description: Retrieves available active key-value tag suggestions for resource creation (shared/static lookup data).
 *     tags:
 *       - Lookups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tag suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 660c2134567890abcdef1111
 *                       key:
 *                         type: string
 *                         example: Environment
 *                       value:
 *                         type: string
 *                         example: Production
 *       401:
 *         description: Authentication required or invalid/missing token
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
 *                   example: Access denied. No token provided.
 *       500:
 *         description: Server error
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
 *                   example: Failed to retrieve tag suggestions
 */
