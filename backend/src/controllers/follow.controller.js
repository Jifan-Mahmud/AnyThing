import User from "../models/User.js";
import Follow from "../models/Follow.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/follow/:userId
 * Follow a user. Returns 409 if already following.
 */
export const followUser = async (req, res, next) => {
  try {
    const targetId = req.params.userId;

    // Cannot follow yourself
    if (targetId === req.user._id.toString()) {
      return sendError(res, "You cannot follow yourself", 400);
    }

    // Target user must exist
    const target = await User.findById(targetId);
    if (!target) return sendError(res, "User not found", 404);

    // Create follow (will throw 11000 on duplicate — caught by errorHandler)
    await Follow.create({ follower: req.user._id, following: targetId });

    return sendSuccess(res, null, `You are now following @${target.username}`, 201);
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, "You are already following this user", 409);
    }
    next(err);
  }
};

/**
 * DELETE /api/follow/:userId
 * Unfollow a user.
 */
export const unfollowUser = async (req, res, next) => {
  try {
    const result = await Follow.findOneAndDelete({
      follower: req.user._id,
      following: req.params.userId,
    });

    if (!result) return sendError(res, "You are not following this user", 404);

    return sendSuccess(res, null, "Unfollowed successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:userId/followers
 * List all users that follow userId (paginated).
 */
export const getFollowers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      Follow.find({ following: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("follower", "username name avatarUrl bio"),
      Follow.countDocuments({ following: req.params.userId }),
    ]);

    return sendSuccess(res, {
      users: followers.map((f) => f.follower),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:userId/following
 * List all users that userId follows (paginated).
 */
export const getFollowing = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      Follow.find({ follower: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("following", "username name avatarUrl bio"),
      Follow.countDocuments({ follower: req.params.userId }),
    ]);

    return sendSuccess(res, {
      users: following.map((f) => f.following),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};
