import User from '../models/user.model.js';
import FriendRequest from '../models/friendRequest.model.js';
import { getPagination, getPaginationMeta } from '../utils/query/pagination.js';
import { buildSearch } from '../utils/query/search.js';

/**
 * GET /api/users/discover
 * Returns a paginated list of registered users except the logged-in user,
 * along with basic profile info and friend status.
 */
export const getDiscoverUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

    const searchCondition = buildSearch(req.query.search, ['name', 'email', 'organizationName']);

    const query = {
      _id: { $ne: req.user._id },
      ...searchCondition
    };

    const totalItems = await User.countDocuments(query);

    const users = await User.find(query)
      .select('name email avatar organizationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const userIds = users.map((u) => u._id);

    // Find any friend requests between the logged-in user and the returned users
    const friendRequests = await FriendRequest.find({
      $or: [
        { sender: req.user._id, recipient: { $in: userIds } },
        { recipient: req.user._id, sender: { $in: userIds } }
      ]
    });

    // Map other user ID to their friend request
    const requestMap = new Map();
    for (const fr of friendRequests) {
      const otherId = fr.sender.toString() === req.user._id.toString()
        ? fr.recipient.toString()
        : fr.sender.toString();
      requestMap.set(otherId, fr);
    }

    const formattedUsers = users.map((u) => {
      const fr = requestMap.get(u._id.toString());
      let friendStatus = 'none';
      if (fr) {
        friendStatus = fr.status;
      }

      return {
        id: u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatar || '',
        organizationName: u.organizationName || '',
        friendStatus,
        friendRequestId: fr ? fr._id : null
      };
    });

    const pagination = getPaginationMeta(totalItems, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: formattedUsers,
        pagination
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while discovering users'
    });
  }
};
