import mongoose from 'mongoose';
import FriendRequest from '../models/friendRequest.model.js';
import User from '../models/user.model.js';
import { createNotification } from '../services/notification.service.js';
import {
  sendFriendRequestSchema,
  respondFriendRequestSchema
} from '../validations/friend.validation.js';

/**
 * POST /api/friends/requests
 * Sends a friend request with pending status.
 */
export const sendFriendRequest = async (req, res) => {
  try {
    const { error, value } = sendFriendRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { recipientId } = value;

    // Do not allow sending to yourself
    if (req.user._id.toString() === recipientId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send a friend request to yourself'
      });
    }

    // Verify recipient user exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found'
      });
    }

    // Check if already friends
    const existingAccepted = await FriendRequest.findOne({
      $or: [
        { sender: req.user._id, recipient: recipientId },
        { sender: recipientId, recipient: req.user._id }
      ],
      status: 'accepted'
    });

    if (existingAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Users are already friends'
      });
    }

    // Check for duplicate pending request
    const existingPending = await FriendRequest.findOne({
      $or: [
        { sender: req.user._id, recipient: recipientId },
        { sender: recipientId, recipient: req.user._id }
      ],
      status: 'pending'
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'A pending friend request already exists between these users'
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: req.user._id,
      recipient: recipientId,
      status: 'pending'
    });

    // Create notification for the recipient
    try {
      await createNotification({
        userId: recipientId,
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${req.user.name} sent you a friend request.`
      });
    } catch (notifErr) {
      // Non-blocking notification error
    }

    return res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      data: friendRequest
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending the friend request'
    });
  }
};

/**
 * PATCH /api/friends/requests/:id
 * Recipient can accept or reject a pending friend request.
 */
export const respondFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid friend request ID'
      });
    }

    const { error, value } = respondFriendRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const friendRequest = await FriendRequest.findById(id);
    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Only the recipient can accept or reject
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can respond to this friend request'
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Friend request has already been processed'
      });
    }

    friendRequest.status = value.status;
    await friendRequest.save();

    // If accepted or rejected, send notification to the sender
    if (value.status === 'accepted') {
      try {
        await createNotification({
          userId: friendRequest.sender,
          type: 'friend_request_accepted',
          title: 'Friend Request Accepted',
          message: `${req.user.name} accepted your friend request.`
        });
      } catch (notifErr) {
        // Non-blocking notification error
      }
    } else if (value.status === 'rejected') {
      try {
        await createNotification({
          userId: friendRequest.sender,
          type: 'friend_request_rejected',
          title: 'Friend Request Rejected',
          message: `${req.user.name} rejected your friend request.`
        });
      } catch (notifErr) {
        // Non-blocking notification error
      }
    }

    return res.status(200).json({
      success: true,
      message: `Friend request ${value.status} successfully`,
      data: friendRequest
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while responding to the friend request'
    });
  }
};

/**
 * GET /api/friends/requests/pending
 * Retrieves pending friend requests received by the authenticated user.
 * Supports optional pagination (?page=1&limit=10) and search (?search=...) by sender's name or email.
 */
export const getPendingFriendRequests = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const query = {
      recipient: req.user._id,
      status: 'pending'
    };

    if (search) {
      const matchingSenders = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const matchingSenderIds = matchingSenders.map((u) => u._id);
      query.sender = { $in: matchingSenderIds };
    }

    const total = await FriendRequest.countDocuments(query);
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    const requests = await FriendRequest.find(query)
      .populate('sender', 'name email avatar organizationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedRequests = requests.map((fr) => ({
      id: fr._id,
      status: fr.status,
      createdAt: fr.createdAt,
      sender: fr.sender
        ? {
            id: fr.sender._id,
            name: fr.sender.name,
            email: fr.sender.email,
            avatar: fr.sender.avatar || '',
            organizationName: fr.sender.organizationName || ''
          }
        : null
    }));

    return res.status(200).json({
      success: true,
      message: 'Pending friend requests retrieved successfully',
      data: {
        requests: formattedRequests,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving pending friend requests'
    });
  }
};
