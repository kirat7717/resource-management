/**
 * @openapi
 * /api/resources:
 *   get:
 *     summary: Get all resources
 *     description: Retrieves a paginated list of resources owned by the authenticated user with search, filtering, and sorting support.
 *     tags:
 *       - Resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query matching resource name or description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [provisioning, running, stopped, active, failed]
 *         description: Filter by resource status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by resource type
 *       - in: query
 *         name: subscriptionId
 *         schema:
 *           type: string
 *         description: Filter by subscription ObjectId
 *       - in: query
 *         name: resourceGroupId
 *         schema:
 *           type: string
 *         description: Filter by resource group ObjectId
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: string
 *         description: Filter by region ObjectId
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, type, status, createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction (asc or desc)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page (maximum 100)
 *     responses:
 *       200:
 *         description: Resources retrieved successfully
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
 *                   example: Resources retrieved successfully
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
 *                             example: 660c2134567890abcdef9999
 *                           name:
 *                             type: string
 *                             example: prod-api-gateway-01
 *                           type:
 *                             type: string
 *                             example: vm
 *                           subscriptionId:
 *                             type: string
 *                             example: 660c2134567890abcdef4321
 *                           resourceGroupId:
 *                             type: string
 *                             example: 660c2134567890abcdef1234
 *                           regionId:
 *                             type: string
 *                             example: 660c2134567890abcdef5678
 *                           description:
 *                             type: string
 *                             example: Production API gateway resource
 *                           ownerId:
 *                             type: string
 *                             example: 660c2134567890abcdef0000
 *                           status:
 *                             type: string
 *                             example: provisioning
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                           example: 25
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPrevPage:
 *                           type: boolean
 *                           example: false
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
 *                   example: An error occurred while retrieving resources
 *   post:
 *     summary: Create a new resource
 *     description: Creates a new resource document. Form 1 requires resourceName, resourceType, subscription, resourceGroup, and region. Later-form fields (hardwareProfile, storage, network, highAvailability, tags) are optional at POST, supporting both initial Form 1 creation and complete single-step creation.
 *     tags:
 *       - Resources
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceName
 *               - resourceType
 *               - subscription
 *               - resourceGroup
 *               - region
 *             properties:
 *               resourceName:
 *                 type: string
 *                 example: prod-api-gateway-01
 *                 description: The name of the resource
 *               resourceType:
 *                 type: string
 *                 example: 660c2134567890abcdef1111
 *                 description: Valid MongoDB ObjectId of an active ResourceType
 *               subscription:
 *                 type: string
 *                 example: 660c2134567890abcdef4321
 *                 description: Valid MongoDB ObjectId of an active Subscription
 *               resourceGroup:
 *                 type: string
 *                 example: 660c2134567890abcdef1234
 *                 description: Valid MongoDB ObjectId of an active ResourceGroup
 *               region:
 *                 type: string
 *                 example: 660c2134567890abcdef5678
 *                 description: Valid MongoDB ObjectId of an active Region
 *               description:
 *                 type: string
 *                 example: Production API gateway resource
 *                 description: Optional description of the resource
 *               hardwareProfile:
 *                 type: string
 *                 example: 660c2134567890abcdef2222
 *                 description: Valid MongoDB ObjectId of the hardware profile
 *               storage:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: premium-nvme-ssd
 *                     description: Storage disk type
 *                   sizeGb:
 *                     type: number
 *                     example: 256
 *                     description: Storage capacity in gigabytes (positive number)
 *               network:
 *                 type: object
 *                 properties:
 *                   publicIpEnabled:
 *                     type: boolean
 *                     example: true
 *                     description: Whether a public IP address is assigned
 *               highAvailability:
 *                 type: object
 *                 properties:
 *                   zoneRedundancy:
 *                     type: boolean
 *                     example: true
 *                     description: Whether zone redundancy is enabled
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - key
 *                     - value
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: Environment
 *                     value:
 *                       type: string
 *                       example: Production
 *     responses:
 *       201:
 *         description: Resource created successfully
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
 *                   example: Resource created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 660c2134567890abcdef9999
 *                     resourceName:
 *                       type: string
 *                       example: prod-api-gateway-01
 *                     resourceType:
 *                       type: string
 *                       example: 660c2134567890abcdef1111
 *                     subscription:
 *                       type: string
 *                       example: 660c2134567890abcdef4321
 *                     resourceGroup:
 *                       type: string
 *                       example: 660c2134567890abcdef1234
 *                     region:
 *                       type: string
 *                       example: 660c2134567890abcdef5678
 *                     description:
 *                       type: string
 *                       example: Production API gateway resource
 *                     hardwareProfile:
 *                       type: string
 *                       example: 660c2134567890abcdef2222
 *                     storage:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: premium-nvme-ssd
 *                         sizeGb:
 *                           type: number
 *                           example: 256
 *                     network:
 *                       type: object
 *                       properties:
 *                         publicIpEnabled:
 *                           type: boolean
 *                           example: true
 *                     highAvailability:
 *                       type: object
 *                       properties:
 *                         zoneRedundancy:
 *                           type: boolean
 *                           example: true
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                             example: Environment
 *                           value:
 *                             type: string
 *                             example: Production
 *                     status:
 *                       type: string
 *                       example: provisioning
 *                     createdBy:
 *                       type: string
 *                       example: 660c2134567890abcdef0000
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or inactive Subscription/ResourceGroup/ResourceType/Region
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
 *                   example: Subscription is not active
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
 *       404:
 *         description: Subscription, ResourceGroup, ResourceType, or Region not found
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
 *                   example: Subscription not found
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
 *                   example: An error occurred while creating the resource
 *
 * /api/resources/{id}:
 *   get:
 *     summary: Get resource by ID
 *     description: Retrieves a single cloud resource by ID owned by the authenticated user.
 *     tags:
 *       - Resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the resource
 *     responses:
 *       200:
 *         description: Resource retrieved successfully
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
 *                   example: Resource retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 660c2134567890abcdef9999
 *                     name:
 *                       type: string
 *                       example: prod-api-gateway-01
 *                     type:
 *                       type: string
 *                       example: vm
 *                     subscriptionId:
 *                       type: string
 *                       example: 660c2134567890abcdef4321
 *                     resourceGroupId:
 *                       type: string
 *                       example: 660c2134567890abcdef1234
 *                     regionId:
 *                       type: string
 *                       example: 660c2134567890abcdef5678
 *                     description:
 *                       type: string
 *                       example: Production API gateway resource
 *                     ownerId:
 *                       type: string
 *                       example: 660c2134567890abcdef0000
 *                     status:
 *                       type: string
 *                       example: provisioning
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid resource ID
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
 *                   example: Invalid resource ID
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
 *       404:
 *         description: Resource not found or belongs to another user
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
 *                   example: Resource not found
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
 *                   example: An error occurred while retrieving the resource
 *   patch:
 *     summary: Progressively update a resource (Forms 2 & 3)
 *     description: Updates configuration fields on an existing resource document. Used by Form 2 (hardwareProfile, storage) and Form 3 (network, highAvailability, tags). Protected fields (_id, ownerId, createdBy, createdAt, updatedAt, status) cannot be modified.
 *     tags:
 *       - Resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the resource to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resourceName:
 *                 type: string
 *                 example: prod-api-gateway-01
 *               resourceType:
 *                 type: string
 *                 example: 660c2134567890abcdef1111
 *               subscription:
 *                 type: string
 *                 example: 660c2134567890abcdef4321
 *               resourceGroup:
 *                 type: string
 *                 example: 660c2134567890abcdef1234
 *               region:
 *                 type: string
 *                 example: 660c2134567890abcdef5678
 *               description:
 *                 type: string
 *                 example: Production API gateway resource
 *               hardwareProfile:
 *                 type: string
 *                 example: 660c2134567890abcdef2222
 *                 description: Valid MongoDB ObjectId of the hardware profile (Form 2)
 *               storage:
 *                 type: object
 *                 description: Storage disk options (Form 2)
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: premium-nvme-ssd
 *                   sizeGb:
 *                     type: number
 *                     example: 256
 *               network:
 *                 type: object
 *                 description: Network settings (Form 3)
 *                 properties:
 *                   publicIpEnabled:
 *                     type: boolean
 *                     example: true
 *               highAvailability:
 *                 type: object
 *                 description: High availability settings (Form 3)
 *                 properties:
 *                   zoneRedundancy:
 *                     type: boolean
 *                     example: true
 *               tags:
 *                 type: array
 *                 description: Resource tags (Form 3)
 *                 items:
 *                   type: object
 *                   required:
 *                     - key
 *                     - value
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: Environment
 *                     value:
 *                       type: string
 *                       example: Production
 *     responses:
 *       200:
 *         description: Resource updated successfully
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
 *                   example: Resource updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error, invalid ObjectId, or attempt to modify protected fields
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
 *                   example: Field "status" is not allowed
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
 *       404:
 *         description: Resource not found or belongs to another user
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
 *                   example: Resource not found
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
 *                   example: An error occurred while updating the resource
 *   delete:
 *     summary: Delete a resource
 *     description: Permanently deletes a cloud resource owned by the authenticated user.
 *     tags:
 *       - Resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the resource to delete
 *     responses:
 *       200:
 *         description: Resource deleted successfully
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
 *                   example: Resource deleted successfully
 *       400:
 *         description: Invalid resource ID
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
 *                   example: Invalid resource ID
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
 *       404:
 *         description: Resource not found or belongs to another user
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
 *                   example: Resource not found
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
 *                   example: An error occurred while deleting the resource
 *
 * /api/resources/{id}/start:
 *   post:
 *     summary: Start a resource
 *     description: Starts a cloud resource owned by the authenticated user from any status. Idempotent if already running.
 *     tags:
 *       - Resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the resource to start
 *     responses:
 *       200:
 *         description: Resource started successfully or already running
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
 *                   example: Resource started successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 660c2134567890abcdef9999
 *                     name:
 *                       type: string
 *                       example: prod-api-gateway-01
 *                     type:
 *                       type: string
 *                       example: vm
 *                     subscriptionId:
 *                       type: string
 *                       example: 660c2134567890abcdef4321
 *                     resourceGroupId:
 *                       type: string
 *                       example: 660c2134567890abcdef1234
 *                     regionId:
 *                       type: string
 *                       example: 660c2134567890abcdef5678
 *                     description:
 *                       type: string
 *                       example: Production API gateway resource
 *                     ownerId:
 *                       type: string
 *                       example: 660c2134567890abcdef0000
 *                     status:
 *                       type: string
 *                       example: running
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid resource ID
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
 *                   example: Invalid resource ID
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
 *       404:
 *         description: Resource not found or belongs to another user
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
 *                   example: Resource not found
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
 *                   example: An error occurred while starting the resource
 *
 * /api/resources/{id}/stop:
 *   post:
 *     summary: Stop a resource
 *     description: Stops a cloud resource owned by the authenticated user from any status. Idempotent if already stopped.
 *     tags:
 *       - Resources
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the resource to stop
 *     responses:
 *       200:
 *         description: Resource stopped successfully or already stopped
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
 *                   example: Resource stopped successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 660c2134567890abcdef9999
 *                     name:
 *                       type: string
 *                       example: prod-api-gateway-01
 *                     type:
 *                       type: string
 *                       example: vm
 *                     subscriptionId:
 *                       type: string
 *                       example: 660c2134567890abcdef4321
 *                     resourceGroupId:
 *                       type: string
 *                       example: 660c2134567890abcdef1234
 *                     regionId:
 *                       type: string
 *                       example: 660c2134567890abcdef5678
 *                     description:
 *                       type: string
 *                       example: Production API gateway resource
 *                     ownerId:
 *                       type: string
 *                       example: 660c2134567890abcdef0000
 *                     status:
 *                       type: string
 *                       example: stopped
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid resource ID
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
 *                   example: Invalid resource ID
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
 *       404:
 *         description: Resource not found or belongs to another user
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
 *                   example: Resource not found
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
 *                   example: An error occurred while stopping the resource
 */

