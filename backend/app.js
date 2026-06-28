import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// ── Route imports ─────────────────────────────────────────────────────────────
import { authHandler, authLimiter } from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import followRoutes from "./src/routes/follow.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import { getUserPosts } from "./src/controllers/post.controller.js";

// ── Middleware imports ────────────────────────────────────────────────────────
import errorHandler from "./src/middlewares/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Must allow credentials because better-auth uses cookies for sessions.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // required for cookie-based auth
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Static files — serve uploaded images ─────────────────────────────────────
// TODO: Remove when Cloudinary is wired up (images will be served from CDN).
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Anithing API is running 🚀" });
});

// ── Routes ────────────────────────────────────────────────────────────────────
// Auth: better-auth handles /api/auth/* internally.
// Must be mounted directly on app (not inside a Router) so that
// toNodeHandler receives the full path — Express 4 + better-auth requirement.
app.all("/api/auth/*", authLimiter, authHandler);

// Users: /api/users/* + /api/me
app.use("/api/users", userRoutes);
app.use("/api/me", (req, res, next) => {
  // Alias: /api/me → /api/users/me (convenience)
  req.url = "/me";
  userRoutes(req, res, next);
});

// Follow: /api/follow/:userId
app.use("/api/follow", followRoutes);

// Posts: /api/posts/*
app.use("/api/posts", postRoutes);

// Comments: /api/posts/:postId/comments + /api/comments/:id
// (comment router manages its own full path prefixes)
app.use("/api", commentRoutes);

// User posts: GET /api/users/:userId/posts
app.get("/api/users/:userId/posts", getUserPosts);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Centralised error handler (must be LAST) ──────────────────────────────────
app.use(errorHandler);

export default app;
