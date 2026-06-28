import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { likePost, unlikePost } from "../controllers/like.controller.js";

const router = Router({ mergeParams: true });

// Like / Unlike a post — mounted under /api/posts/:postId
router.post("/", requireAuth, likePost);
router.delete("/", requireAuth, unlikePost);

export default router;
