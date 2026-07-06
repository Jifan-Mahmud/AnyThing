import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { upload } from "../middlewares/upload.js";
import { createStory, getStories } from "../controllers/story.controller.js";

const router = Router();

router.get("/", requireAuth, getStories);
router.post("/", requireAuth, upload.single("media"), createStory);

export default router;
