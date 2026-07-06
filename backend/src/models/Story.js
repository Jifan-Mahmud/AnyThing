import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Story must have an author"],
    },
    mediaUrl: {
      type: String,
      required: [true, "Story must have a media URL"],
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // Automatically deletes the document after 24 hours (TTL index)
    },
  },
  {
    timestamps: true,
  }
);

storySchema.index({ author: 1, createdAt: -1 });

const Story = mongoose.model("Story", storySchema);
export default Story;
