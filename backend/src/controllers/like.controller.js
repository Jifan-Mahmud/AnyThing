import Like from "../models/Like.js";
import Post from "../models/Post.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// ── Helper: get likeCount + likedByMe for a post ─────────────────────────────
const getLikeData = async (postId, userId) => {
  const [likeCount, liked] = await Promise.all([
    Like.countDocuments({ post: postId }),
    userId ? Like.findOne({ post: postId, user: userId }) : null,
  ]);
  return { likeCount, likedByMe: !!liked };
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/posts/:postId/like
 * Like a post. Returns updated likeCount + likedByMe.
 */
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return sendError(res, "Post not found", 404);

    await Like.create({ post: post._id, user: req.user._id });

    const data = await getLikeData(post._id, req.user._id);
    return sendSuccess(res, data, "Post liked", 201);
  } catch (err) {
    if (err.code === 11000) {
      // Already liked — still return current counts
      const data = await getLikeData(req.params.postId, req.user._id);
      return sendSuccess(res, data, "Already liked");
    }
    next(err);
  }
};

/**
 * DELETE /api/posts/:postId/like
 * Unlike a post. Returns updated likeCount + likedByMe.
 */
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return sendError(res, "Post not found", 404);

    const result = await Like.findOneAndDelete({ post: post._id, user: req.user._id });
    if (!result) return sendError(res, "You have not liked this post", 404);

    const data = await getLikeData(post._id, req.user._id);
    return sendSuccess(res, data, "Post unliked");
  } catch (err) {
    next(err);
  }
};
