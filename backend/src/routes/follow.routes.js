import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";

const router = Router();

// Follow / Unfollow
router.post("/:userId", requireAuth, followUser);
router.delete("/:userId", requireAuth, unfollowUser);

export default router;
