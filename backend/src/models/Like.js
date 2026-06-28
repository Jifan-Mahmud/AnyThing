import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Like must belong to a post"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Like must have a user"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index — prevents a user from liking the same post twice
likeSchema.index({ post: 1, user: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);
export default Like;
