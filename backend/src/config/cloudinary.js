import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables (trimmed defensively)
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

/**
 * Uploads a local file to Cloudinary and deletes the local file afterwards.
 * @param {string} localFilePath - Path to the file on local disk
 * @param {string} folder - Target folder in Cloudinary
 * @returns {Promise<object>} Cloudinary upload result containing secure_url, etc.
 */
export const uploadToCloudinary = async (localFilePath, folder = "anithing") => {
  try {
    if (!localFilePath) return null;

    // Detect if file is video or image
    const resourceType = localFilePath.match(/\.(mp4|mov|webm|quicktime)$/i) ? "video" : "auto";

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
      resource_type: resourceType,
    });

    // Delete the local temporary file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Attempt to clean up local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};
