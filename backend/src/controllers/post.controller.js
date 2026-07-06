import { upload } from "../middlewares/upload.js";
import { z } from "zod";
import Post from "../models/Post.js";
import Follow from "../models/Follow.js";
import Like from "../models/Like.js";
import User from "../models/User.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// ── Zod schemas ───────────────────────────────────────────────────────────────
export const createPostSchema = z.object({
  caption: z.string().max(2200).optional().default(""),
  type: z.enum(["post", "reel"]).optional().default("post"),
});

// ── Helper: enrich posts with like data and follow status ──────────────────────
const enrichPosts = async (posts, currentUserId) => {
  if (!posts.length) return [];

  const postIds = posts.map((p) => p._id);
  const authorIds = posts.map((p) => p.author?._id || p.author).filter(Boolean);

  const [likeCounts, userLikes, followedUsers] = await Promise.all([
    Like.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]),
    currentUserId
      ? Like.find({ post: { $in: postIds }, user: currentUserId }).select("post")
      : Promise.resolve([]),
    currentUserId
      ? Follow.find({ follower: currentUserId, following: { $in: authorIds } }).select("following")
      : Promise.resolve([]),
  ]);

  const likeCountMap = Object.fromEntries(likeCounts.map((l) => [l._id.toString(), l.count]));
  const likedSet = new Set(userLikes.map((l) => l.post.toString()));
  const followedSet = new Set(followedUsers.map((f) => f.following.toString()));

  return posts.map((post) => {
    const obj = post.toObject ? post.toObject() : post;
    const authorId = obj.author?._id || obj.author;
    return {
      ...obj,
      likeCount: likeCountMap[obj._id.toString()] || 0,
      likedByMe: likedSet.has(obj._id.toString()),
      isFollowing: authorId ? followedSet.has(authorId.toString()) : false,
    };
  });
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/posts
 * Create a new post. Expects multipart/form-data with `image` file + `caption`.
 */
export const createPost = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "Image is required", 400);

    // Build image URL — in production swap for Cloudinary secure_url
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const post = await Post.create({
      author: req.user._id,
      imageUrl,
      caption: req.body.caption || "",
      type: req.body.type || "post",
    });

    const populated = await post.populate("author", "username name avatarUrl");
    return sendSuccess(res, populated, "Post created", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/posts/feed
 * Paginated feed: posts from users the current user follows + own posts.
 */
export const getFeed = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // Get IDs of users the current user follows
    const following = await Follow.find({ follower: req.user._id }).select("following");
    const followingIds = following.map((f) => f.following);

    // If the user doesn't follow anyone, show posts from ALL users (public feed).
    // Otherwise, show their own posts + posts from users they follow.
    const filter = followingIds.length > 0
      ? { author: { $in: [req.user._id, ...followingIds] } }
      : {};

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username name avatarUrl"),
      Post.countDocuments(filter),
    ]);

    const enriched = await enrichPosts(posts, req.user._id);

    return sendSuccess(res, {
      posts: enriched,
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
 * GET /api/posts/:id
 * Single post with like data.
 */
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username name avatarUrl");
    if (!post) return sendError(res, "Post not found", 404);

    const [enriched] = await enrichPosts([post], req.user?._id);
    return sendSuccess(res, enriched);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:userId/posts
 * All posts by a specific user (paginated).
 */
export const getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return sendError(res, "User not found", 404);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username name avatarUrl"),
      Post.countDocuments({ author: req.params.userId }),
    ]);

    const enriched = await enrichPosts(posts, req.user?._id);

    return sendSuccess(res, {
      posts: enriched,
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
 * DELETE /api/posts/:id
 * Owner-only delete.
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return sendError(res, "Post not found", 404);

    if (post.author.toString() !== req.user._id.toString()) {
      return sendError(res, "Forbidden — you do not own this post", 403);
    }

    await post.deleteOne();

    // Cascade delete likes and comments for this post
    await Promise.all([
      Like.deleteMany({ post: post._id }),
      // Comment cascade is handled in comment.controller.js but safe to also do here
    ]);

    return sendSuccess(res, null, "Post deleted");
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/posts
 * Public list of posts or reels (for Explore / Reels page).
 * Supports optional `type` query parameter ('post' or 'reel').
 */
export const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username name avatarUrl"),
      Post.countDocuments(filter),
    ]);

    const enriched = await enrichPosts(posts, req.user?._id);

    return sendSuccess(res, {
      posts: enriched,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};
