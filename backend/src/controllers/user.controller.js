import { uploadToCloudinary } from "../config/cloudinary.js";
import { z } from "zod";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Post from "../models/Post.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// ── Zod schemas ───────────────────────────────────────────────────────────────
export const updateMeSchema = z.object({
  name: z.string().max(60).optional(),
  bio: z.string().max(150).optional(),
  avatarUrl: z.string().url("Invalid avatar URL").or(z.literal("")).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_.]+$/, "Username can only contain letters, numbers, dots and underscores")
    .optional(),
});

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * GET /api/me
 * Returns the currently logged-in user's profile with follower/following counts.
 */
export const getMe = async (req, res, next) => {
  try {
    const [followerCount, followingCount, postCount] = await Promise.all([
      Follow.countDocuments({ following: req.user._id }),
      Follow.countDocuments({ follower: req.user._id }),
      Post.countDocuments({ author: req.user._id }),
    ]);

    return sendSuccess(res, {
      ...req.user.toObject(),
      followerCount,
      followingCount,
      postCount,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:username
 * Public profile — any visitor can view.
 */
export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select("-authUserId");

    if (!user) return sendError(res, "User not found", 404);

    const [followerCount, followingCount, postCount] = await Promise.all([
      Follow.countDocuments({ following: user._id }),
      Follow.countDocuments({ follower: user._id }),
      Post.countDocuments({ author: user._id }),
    ]);

    // If a session exists, check whether the viewer follows this user
    let isFollowing = false;
    if (req.user) {
      isFollowing = !!(await Follow.findOne({ follower: req.user._id, following: user._id }));
    }

    return sendSuccess(res, {
      ...user.toObject(),
      followerCount,
      followingCount,
      postCount,
      isFollowing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/me
 * Update the logged-in user's profile (name, bio, avatarUrl, username).
 */
export const updateMe = async (req, res, next) => {
  try {
    const updates = { ...req.body }; // already validated by zod middleware

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, "avatars");
      updates.avatarUrl = uploadResult.secure_url;
    }

    // Prevent duplicate username
    if (updates.username) {
      const exists = await User.findOne({
        username: updates.username,
        _id: { $ne: req.user._id },
      });
      if (exists) return sendError(res, "Username already taken", 409);
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-authUserId");

    return sendSuccess(res, updated, "Profile updated");
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/search?q=<query>
 * Search users by username (partial match, case-insensitive).
 */
export const searchUsers = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return sendSuccess(res, { users: [], page: 1, limit: 10 }, "Provide a search query");

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const users = await User.find({
      username: { $regex: q, $options: "i" },
    })
      .select("username name avatarUrl bio")
      .skip(skip)
      .limit(limit);

    return sendSuccess(res, { users, page, limit });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/suggested
 * Get suggested users for the logged-in user (users they don't follow yet).
 */
export const getSuggestedUsers = async (req, res, next) => {
  try {
    const following = await Follow.find({ follower: req.user._id }).select("following");
    const followingIds = following.map((f) => f.following);

    const limit = Math.min(20, parseInt(req.query.limit) || 5);
    
    const users = await User.find({
      _id: { $nin: [...followingIds, req.user._id] }
    })
      .select("username name avatarUrl bio")
      .limit(limit);

    return sendSuccess(res, users);
  } catch (err) {
    next(err);
  }
};
