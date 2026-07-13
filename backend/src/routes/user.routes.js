import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  getMe,
  getUserByUsername,
  updateMe,
  searchUsers,
  getSuggestedUsers,
  updateMeSchema,
} from "../controllers/user.controller.js";
import { getFollowers, getFollowing } from "../controllers/follow.controller.js";

import { upload } from "../middlewares/upload.js";

const router = Router();

// ── Current user (protected) ──────────────────────────────────────────────────
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, upload.single("avatar"), validate(updateMeSchema), updateMe);

// ── Search & Suggestions (protected/public) ────────────────────────────────────
router.get("/search", searchUsers);
router.get("/suggested", requireAuth, getSuggestedUsers);

// ── User posts — handled in post.routes.js at /api/users/:userId/posts ────────

// ── Follower / Following lists (public) ───────────────────────────────────────
router.get("/me/followers", requireAuth, getFollowers);
router.get("/me/following", requireAuth, getFollowing);

// ── Public profile by username ────────────────────────────────────────────────
// MUST be last — catch-all param route
router.get("/:username", getUserByUsername);

export default router;
