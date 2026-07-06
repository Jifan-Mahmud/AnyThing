import mongoose from "mongoose";
import Post from "../src/models/Post.js";
import Story from "../src/models/Story.js";
import User from "../src/models/User.js";
import Follow from "../src/models/Follow.js";
import "dotenv/config";

const run = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    // 1. Clean up invalid follow entries (where user does not exist anymore)
    console.log("Cleaning up invalid follow entries...");
    const follows = await Follow.find();
    let deletedFollowsCount = 0;
    for (const follow of follows) {
      const followerExists = await User.findById(follow.follower);
      const followingExists = await User.findById(follow.following);
      if (!followerExists || !followingExists) {
        await Follow.deleteOne({ _id: follow._id });
        deletedFollowsCount++;
      }
    }
    console.log(`Deleted ${deletedFollowsCount} invalid follow records.`);

    // 2. Update post URLs from http to https for Render domain
    console.log("Upgrading post URLs to HTTPS...");
    const posts = await Post.find({ imageUrl: /http:\/\/anything-os6i\.onrender\.com/ });
    let updatedPostsCount = 0;
    for (const post of posts) {
      post.imageUrl = post.imageUrl.replace("http://anything-os6i.onrender.com", "https://anything-os6i.onrender.com");
      await post.save();
      updatedPostsCount++;
    }
    console.log(`Updated ${updatedPostsCount} posts to HTTPS.`);

    // 3. Update story URLs from http to https for Render domain
    console.log("Upgrading story URLs to HTTPS...");
    const stories = await Story.find({ mediaUrl: /http:\/\/anything-os6i\.onrender\.com/ });
    let updatedStoriesCount = 0;
    for (const story of stories) {
      story.mediaUrl = story.mediaUrl.replace("http://anything-os6i.onrender.com", "https://anything-os6i.onrender.com");
      await story.save();
      updatedStoriesCount++;
    }
    console.log(`Updated ${updatedStoriesCount} stories to HTTPS.`);

    console.log("Cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error running cleanup script:", err);
    process.exit(1);
  }
};

run();
