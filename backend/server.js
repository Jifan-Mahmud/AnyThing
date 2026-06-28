import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Anithing API running on http://localhost:${PORT}`);
    console.log(`📡  Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍  Accepting requests from: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
});
