import { uploadToCloudinary } from "../config/cloudinary.js";
import Story from "../models/Story.js";
import Follow from "../models/Follow.js";
import User from "../models/User.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * POST /api/stories
 * Create a new story. Expects multipart/form-data with a `media` file.
 */
export const createStory = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "Media file is required", 400);

    const uploadResult = await uploadToCloudinary(req.file.path, "stories");
    const mediaUrl = uploadResult.secure_url;
    const mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";

    const story = await Story.create({
      author: req.user._id,
      mediaUrl,
      mediaType,
    });

    const populated = await story.populate("author", "username name avatarUrl");
    return sendSuccess(res, populated, "Story uploaded successfully", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/stories
 * Fetch active stories from followed users + own stories, grouped by author.
 * If following list is empty, returns stories from all active users as fallback.
 */
export const getStories = async (req, res, next) => {
  try {
    // 1. Get followings
    const following = await Follow.find({ follower: req.user._id }).select("following");
    const followingIds = following.map((f) => f.following);

    // 2. Decide author filter
    const filter = followingIds.length > 0
      ? { author: { $in: [req.user._id, ...followingIds] } }
      : {}; // fallback: show stories from everyone

    // 3. Find active stories
    const stories = await Story.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "username name avatarUrl");

    // 4. Group stories by author
    const authorMap = new Map();

    stories.forEach((story) => {
      if (!story.author) return;
      const authorId = story.author._id.toString();

      if (!authorMap.has(authorId)) {
        authorMap.set(authorId, {
          id: authorId,
          username: story.author.username,
          avatar: story.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.author.username}`,
          viewed: false, // will toggle client-side
          stories: [],
        });
      }

      authorMap.get(authorId).stories.push({
        _id: story._id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        createdAt: story.createdAt,
      });
    });

    const groupedStories = Array.from(authorMap.values());
    return sendSuccess(res, groupedStories, "Stories fetched successfully");
  } catch (err) {
    next(err);
  }
};
