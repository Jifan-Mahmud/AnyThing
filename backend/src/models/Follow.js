import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Follow must have a follower"],
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Follow must have a following"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index — prevents duplicate follow relationships
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Index for fast follower / following list queries
followSchema.index({ following: 1 }); // "who follows userId?"
followSchema.index({ follower: 1 });  // "who does userId follow?"

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
