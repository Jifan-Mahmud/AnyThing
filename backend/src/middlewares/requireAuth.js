import { auth } from "../config/auth.js";
import User from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";

/**
 * requireAuth middleware
 * ───────────────────────────────────────────────────────────────────────────
 * 1. Asks better-auth to validate the session cookie from the request.
 * 2. Looks up the corresponding User profile in our DB.
 * 3. Attaches `req.user` (app-level profile) and `req.authUser` (better-auth
 *    session user) so downstream controllers have everything they need.
 * 4. Returns 401 if no valid session exists.
 */
const requireAuth = async (req, res, next) => {
  try {
    // better-auth reads cookies / Authorization header internally
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
