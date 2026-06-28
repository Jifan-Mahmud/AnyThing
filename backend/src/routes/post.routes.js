import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  createPost,
  getFeed,
  getPost,
  getUserPosts,
  deletePost,
  getPosts,
  createPostSchema,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/upload.js";
import likeRouter from "./like.routes.js";
import commentRouter from "./comment.routes.js";

const router = Router();

// Public: list posts or reels
router.get("/", getPosts);

// Feed (protected)
router.get("/feed", requireAuth, getFeed);

// Create post — multipart: `image` file field + `caption` text field (protected)
router.post("/", requireAuth, upload.single("image"), validate(createPostSchema), createPost);

// Single post (public — enriches with likedByMe when session present)
router.get("/:id", getPost);

// Delete post (protected, owner only)
router.delete("/:id", requireAuth, deletePost);

// Nested: likes under /api/posts/:postId/like
router.use("/:postId/like", likeRouter);

export default router;
