import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import app from "./app.js";
import socketHandler from "./socket.js";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://any-thing-three.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Share io with Express app so req.io is available in controllers
const onlineUsers = {};
app.set("io", io);
app.set("onlineUsers", onlineUsers);

socketHandler(io, onlineUsers);

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀  Anithing API running on http://localhost:${PORT}`);
    console.log(`📡  Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍  Accepting requests from: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
});
