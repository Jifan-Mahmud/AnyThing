import { auth } from "../config/auth.js";
import User from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * requireAuth middleware
 * ───────────────────────────────────────────────────────────────────────────
 * 1. Checks for JWT token in Authorization header (Bearer <token>) or cookie.
 * 2. If valid JWT, finds and attaches the user profile.
 * 3. Falls back to better-auth session validation if no valid JWT.
 * 4. Lazy-creates app user profile if needed.
 * 5. Returns 401 if unauthorized.
 */
const requireAuth = async (req, res, next) => {
  try {
    // 1. Try JWT Bearer token or token cookie first
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const jwtPayload = await verifyToken(token);
      if (jwtPayload && (jwtPayload.userId || jwtPayload.id)) {
        const user = await User.findById(jwtPayload.userId || jwtPayload.id);
        if (user) {
          req.user = user;
          req.authUser = { id: user.authUserId || user._id.toString() };
          return next();
        }
      }
    }

    // 2. Fall back to better-auth session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return sendError(res, "Unauthorized — please log in", 401);
    }

    // Attach the raw better-auth session user
    req.authUser = session.user;

    // Find or lazy-create the app-level profile linked to this auth user
    let profile = await User.findOne({ authUserId: session.user.id });

    if (!profile) {
      // First request after signup — auto-create a profile from auth data
      const baseUsername = session.user.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_.]/g, "_")
        .slice(0, 25); // leave room for suffix

      // Find a unique username by appending a number if needed
      let username = baseUsername;
      let attempt = 0;
      while (await User.exists({ username })) {
        attempt++;
        username = `${baseUsername}_${attempt}`;
      }

      profile = await User.create({
        authUserId: session.user.id,
        email: session.user.email,
        name: session.user.name || "",
        username,
        avatarUrl: session.user.image || "",
      });
    }

    req.user = profile;
    next();
  } catch (err) {
    next(err);
  }
};

export default requireAuth;

