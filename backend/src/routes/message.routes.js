import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getMessages } from "../controllers/message.controller.js";

const router = Router();

router.get("/:conversationId", requireAuth, getMessages);

export default router;
