import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  addComment,
  getComments,
  deleteComment,
  createCommentSchema,
} from "../controllers/comment.controller.js";

const router = Router();

// Comments on a post — nested under /posts/:postId (see app.js)
// NOTE: These are mounted at /api/posts/:postId/comments
// but deleteComment lives at /api/comments/:id (mounted separately)

// Add comment (protected)
router.post("/posts/:postId/comments", requireAuth, validate(createCommentSchema), addComment);

// List comments (public)
router.get("/posts/:postId/comments", getComments);

// Delete a specific comment (protected — owner or post owner)
router.delete("/comments/:id", requireAuth, deleteComment);

export default router;
