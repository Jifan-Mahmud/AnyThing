import Message from "./src/models/Message.js";
import Conversation from "./src/models/Conversation.js";

const socketHandler = (io) => {
  let onlineUsers = {};

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

    // --- New Post Broadcast ---
    socket.on("newPostCreated", (post) => {
      // Broadcast to all connected users (except sender)
      socket.broadcast.emit("feedUpdated", post);
    });

    // --- WebRTC Calling Events ---
    socket.on("call-user", ({ to, offer, type, callerName, callerAvatar }) => {
      if (onlineUsers[to]) {
        io.to(onlineUsers[to]).emit("incoming-call", {
          from: userId,
          offer,
          type,
          callerName,
          callerAvatar
        });
      }
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
      delete onlineUsers[userId];
      io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });
  });
};

export default socketHandler;
