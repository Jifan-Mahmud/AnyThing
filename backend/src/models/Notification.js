import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Who receives this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Who triggered this notification
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // What type of notification
    type: {
      type: String,
      enum: ["follow", "like", "comment", "post", "reel", "story"],
      required: true,
    },
    // Optional reference to the post/story/reel
    refPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    refStory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    },
    // Optional preview image URL
    imageUrl: String,
    // Has the recipient read this notification?
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
