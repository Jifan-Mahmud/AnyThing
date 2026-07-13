import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  getNotifications,
  markAllRead,
  markOneRead,
  clearAll,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.patch("/read-all", requireAuth, markAllRead);
router.patch("/:id/read", requireAuth, markOneRead);
router.delete("/", requireAuth, clearAll);

export default router;
