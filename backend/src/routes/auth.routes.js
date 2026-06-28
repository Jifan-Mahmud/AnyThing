import rateLimit from "express-rate-limit";
import { auth } from "../config/auth.js";
import { toNodeHandler } from "better-auth/node";

// ── Rate limiter for auth endpoints ──────────────────────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 auth requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// Export the raw better-auth node handler so app.js can mount it directly.
// better-auth must receive the full path (/api/auth/...) so it must be
// mounted with app.all() on the top-level app, NOT inside a Router.
export const authHandler = toNodeHandler(auth);
