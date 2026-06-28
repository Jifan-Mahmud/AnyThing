import { z } from "zod";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// ── Zod schemas ───────────────────────────────────────────────────────────────
export const createCommentSchema = z.object({
  text: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters")
    .trim(),
});

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/posts/:postId/comments
 * Add a comment to a post. Protected.
 */
export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return sendError(res, "Post not found", 404);

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      text: req.body.text,
    });

    const populated = await comment.populate("author", "username name avatarUrl");
    return sendSuccess(res, populated, "Comment added", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/posts/:postId/comments
 * List comments for a post (paginated, oldest first).
 */
export const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return sendError(res, "Post not found", 404);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ post: post._id })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username name avatarUrl"),
      Comment.countDocuments({ post: post._id }),
    ]);

    return sendSuccess(res, {
      comments,
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
 * DELETE /api/comments/:id
 * Comment owner OR post owner can delete a comment.
 */
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("post");
    if (!comment) return sendError(res, "Comment not found", 404);

    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isPostOwner = comment.post.author.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) {
      return sendError(res, "Forbidden — you cannot delete this comment", 403);
    }

    await comment.deleteOne();
    return sendSuccess(res, null, "Comment deleted");
  } catch (err) {
    next(err);
  }
};
