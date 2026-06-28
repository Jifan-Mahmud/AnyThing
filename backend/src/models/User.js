import mongoose from "mongoose";

/**
 * User profile model.
 * NOTE: better-auth manages its own 'users' collection (with password hash,
 * email-verified flag, etc.). This model stores the *app-level* profile data
 * (bio, avatar, username) and is linked to better-auth via the shared email.
 */
const userSchema = new mongoose.Schema(
  {
    // better-auth user id — links this profile to the auth record
    authUserId: {
      type: String,
      unique: true,
      sparse: true, // populated after auth user is created
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-z0-9_.]+$/, "Username can only contain letters, numbers, dots and underscores"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
      default: "",
    },
    bio: {
      type: String,
      maxlength: [150, "Bio cannot exceed 150 characters"],
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Virtual for follower / following counts (populated on-demand in controllers)
userSchema.virtual("followerCount");
userSchema.virtual("followingCount");

const User = mongoose.model("User", userSchema);
export default User;
