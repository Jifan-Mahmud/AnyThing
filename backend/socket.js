import Message from "./src/models/Message.js";
import Conversation from "./src/models/Conversation.js";
import Follow from "./src/models/Follow.js";
import User from "./src/models/User.js";
import { createNotification } from "./src/controllers/notification.controller.js";

const socketHandler = (io, onlineUsers = {}) => {

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(onlineUsers));
    }

    socket.on("sendMessage", async (message) => {
      const newMessage = new Message(message);
      const savedMessage = await newMessage.save();
      await savedMessage.populate("senderId", "username name avatarUrl");

      const conversation = await Conversation.findById(
        message.conversationId
      ).populate("participants");

      conversation.participants.forEach((participant) => {
        if (onlineUsers[participant._id.toString()]) {
          io.to(onlineUsers[participant._id.toString()]).emit(
            "newMessage",
            savedMessage
          );
        }
      });
    });

    // --- New Post/Reel Broadcast + Notifications ---
    socket.on("newPostCreated", async (post) => {
      // Broadcast to all connected users (for feed update)
      socket.broadcast.emit("feedUpdated", post);

      // Send notifications to all followers
      try {
        const followers = await Follow.find({ following: userId }).select("follower");
        for (const f of followers) {
          await createNotification(io, onlineUsers, {
            recipient: f.follower,
            sender: userId,
            type: post.type === "reel" ? "reel" : "post",
            refPost: post._id,
            imageUrl: post.imageUrl,
          });
        }
      } catch (err) {
        console.error("Error sending post notifications:", err);
      }
    });

    // --- Story Created Notification ---
    socket.on("newStoryCreated", async (story) => {
      try {
        const followers = await Follow.find({ following: userId }).select("follower");
        for (const f of followers) {
          await createNotification(io, onlineUsers, {
            recipient: f.follower,
            sender: userId,
            type: "story",
            refStory: story._id,
            imageUrl: story.mediaUrl,
          });
        }
      } catch (err) {
        console.error("Error sending story notifications:", err);
      }
    });

    // --- WebRTC Calling Events ---
    socket.on("call-user", ({ to, offer, type, callerName, callerAvatar }) => {
      // Always emit incoming-call FIRST — this must never be blocked
      if (onlineUsers[to]) {
        io.to(onlineUsers[to]).emit("incoming-call", {
          from: userId,
          offer,
          type,
          callerName,
          callerAvatar,
        });
      }

      // Save call notification asynchronously (fire-and-forget — never blocks signaling)
      createNotification(io, onlineUsers, {
        recipient: to,
        sender: userId,
        type: type === "video" ? "video_call" : "audio_call",
      }).catch((err) => console.error("Call notification error:", err));
    });

    socket.on("answer-call", ({ to, answer }) => {
      if (onlineUsers[to]) {
        io.to(onlineUsers[to]).emit("call-answered", { answer });
      }
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      if (onlineUsers[to]) {
        io.to(onlineUsers[to]).emit("ice-candidate", { candidate });
      }
    });

    socket.on("end-call", ({ to }) => {
      if (onlineUsers[to]) {
        io.to(onlineUsers[to]).emit("call-ended");
      }
    });

    socket.on("disconnect", () => {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
      io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });
  });
};

export default socketHandler;
