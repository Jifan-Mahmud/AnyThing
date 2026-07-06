import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getConversations, createConversation, getConversationById } from "../controllers/conversation.controller.js";

const router = Router();

router.get("/", requireAuth, getConversations);
router.post("/", requireAuth, createConversation);
router.get("/:conversationId", requireAuth, getConversationById);

export default router;
