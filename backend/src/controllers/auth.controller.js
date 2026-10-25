import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

/**
 * POST /api/auth/google
 * Authenticates or registers a user using a Google ID token from GIS.
 */
export const googleSignIn = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return sendError(res, "Google credential is required", 400);
    }

    // Verify token with Google TokenInfo API
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );
    if (!response.ok) {
      return sendError(res, "Invalid or expired Google token", 401);
    }

    const payload = await response.json();
    const { email, name, picture, sub } = payload;

    if (!email) {
      return sendError(res, "Google account did not provide an email", 400);
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const baseUsername = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_.]/g, "_")
        .slice(0, 20);

      let username = baseUsername;
      let attempt = 0;
      while (await User.exists({ username })) {
        attempt++;
        username = `${baseUsername}_${attempt}`;
      }

      user = await User.create({
        authUserId: sub,
        email: email.toLowerCase(),
        name: name || baseUsername,
        username,
        avatarUrl: picture || "",
      });
    } else {
      if (!user.authUserId) {
        user.authUserId = sub;
      }
      if (!user.avatarUrl && picture) {
        user.avatarUrl = picture;
      }
      await user.save();
    }

    // Issue JWT token
    const token = await signToken({
      userId: user._id.toString(),
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
        },
      },
      "Signed in with Google successfully! 🎉"
    );
  } catch (err) {
    next(err);
  }
};
