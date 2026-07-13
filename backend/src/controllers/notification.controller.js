import Notification from "../models/Notification.js";
import Follow from "../models/Follow.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * GET /api/notifications
 * Get notifications for the logged-in user, paginated.
 */
export const getNotifications = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "username name avatarUrl")
        .populate("refPost", "imageUrl type caption")
        .populate("refStory", "mediaUrl mediaType"),
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, read: false }),
    ]);

    return sendSuccess(res, { notifications, total, unreadCount, page, limit });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 */
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    return sendSuccess(res, null, "All notifications marked as read");
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
export const markOneRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { read: true } }
    );
    return sendSuccess(res, null, "Notification marked as read");
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications
 * Delete all notifications for the logged-in user.
 */
export const clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    return sendSuccess(res, null, "All notifications cleared");
  } catch (err) {
    next(err);
  }
};

// ── Utility: create a notification and optionally push via socket ──────────────

/**
 * createNotification — called internally by other controllers.
 * @param {Object} io          — Socket.io instance
 * @param {Object} onlineUsers — { userId: socketId }
 * @param {Object} data        — { recipient, sender, type, refPost?, refStory?, imageUrl? }
 */
export const createNotification = async (io, onlineUsers, data) => {
  const { recipient, sender, type, refPost, refStory, imageUrl } = data;

  // Don't notify yourself
  if (recipient.toString() === sender.toString()) return;

  const notif = await Notification.create({
    recipient,
    sender,
    type,
    refPost,
    refStory,
    imageUrl,
  });

  const populated = await notif.populate("sender", "username name avatarUrl");

  // Push real-time if recipient is online
  const recipientSocketId = onlineUsers[recipient.toString()];
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("newNotification", populated);
  }

  return populated;
};
