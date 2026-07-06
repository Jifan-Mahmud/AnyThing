import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// Configure
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

console.log("Testing Cloudinary Configuration:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret (first 4 chars):", process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.slice(0, 4) + "..." : "not set");

const run = async () => {
  try {
    console.log("Attempting test upload to Cloudinary (using a 1x1 transparent pixel data URI)...");
    const testPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const res = await cloudinary.uploader.upload(testPixel, {
      folder: "test_connection",
    });
    console.log("Upload SUCCESSFUL! 🎉");
    console.log("Public URL:", res.secure_url);
  } catch (err) {
    console.error("Upload FAILED! ❌");
    console.error("Error details:", err);
  }
};

run();
