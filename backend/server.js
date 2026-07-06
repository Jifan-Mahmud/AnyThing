import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import app from "./app.js";
import socketHandler from "./socket.js";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀  Anithing API running on http://localhost:${PORT}`);
    console.log(`📡  Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍  Accepting requests from: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
});
