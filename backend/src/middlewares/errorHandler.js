import { sendError } from "../utils/apiResponse.js";

/**
 * Centralised error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - Mongoose ValidationError  → 400
 *  - Mongoose duplicate key    → 409
 *  - Custom AppError           → uses err.statusCode
 *  - Everything else           → 500 (no stack trace sent to client)
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // MongoDB duplicate key (e.g. username / email already taken)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Never leak stack traces in production
  if (process.env.NODE_ENV !== "production") {
    console.error("🔴 Error:", err);
  }

  return sendError(res, message, statusCode);
};

export default errorHandler;
