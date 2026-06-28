import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must have an author"],
    },
    imageUrl: {
      type: String,
      required: [true, "Post must have an image"],
    },
    caption: {
      type: String,
      maxlength: [2200, "Caption cannot exceed 2200 characters"],
      default: "",
    },
    type: {
      type: String,
      enum: ["post", "reel"],
      default: "post",
    },
  },
  {
    timestamps: true,
    // Expose virtual fields (e.g. likeCount) in toJSON / toObject
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for fast feed queries (newest posts by a set of authors)
postSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
