/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     description: Retrieves dashboard summary metrics, resource type distribution, region distribution, and recent activity.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
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
 *                   example: Dashboard summary retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     metrics:
 *                       type: object
 *                       properties:
 *                         totalResources:
 *                           type: integer
 *                           example: 12
 *                         runningResources:
 *                           type: integer
 *                           example: 8
 *                         stoppedResources:
 *                           type: integer
 *                           example: 3
 *                         errorsOrDegraded:
 *                           type: integer
 *                           example: 1
 *                     resourceTypeDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: Virtual Machine
 *                           count:
 *                             type: integer
 *                             example: 5
 *                     regionDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           regionId:
 *                             type: string
 *                             example: 660c2134567890abcdef1357
 *                           region:
 *                             type: string
 *                             example: Mumbai
 *                           count:
 *                             type: integer
 *                             example: 5
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 660c2134567890abcdef9001
 *                           action:
 *                             type: string
 *                             enum: [create, start, stop, delete]
 *                             example: start
 *                           resourceId:
 *                             type: string
 *                             example: 660c2134567890abcdef8001
 *                           details:
 *                             type: object
 *                             example:
 *                               previousStatus: stopped
 *                               newStatus: running
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-09-25T11:45:00.000Z
 *       401:
 *         description: Unauthorized - missing or invalid token
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
 *         description: Internal server error
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
 *                   example: An error occurred while retrieving dashboard summary
 */
