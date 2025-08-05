const socket = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel"); // Make sure this is correct!

// Create a unique room ID for two users
const getSecretId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Update for your frontend origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected");

    socket.on("joinChat", async ({ userId, targetUserId }) => {
      const roomId = getSecretId(userId, targetUserId);
      socket.join(roomId);

      // Send target user info to client
      try {
        const targetUser = await userModel.findById(targetUserId).select("name");
        socket.emit("targetUserInfo", {
          name: targetUser?.name || "Unknown",
        });
      } catch (err) {
        console.log("❌ Error fetching target user:", err);
      }
    });

    socket.on("sendMessage", async ({ userName, userId, targetUserId, newMessage }) => {
      const roomId = getSecretId(userId, targetUserId);
      io.to(roomId).emit("messageRecieved", { userName, newMessage });

      try {
        let chat = await chatModel.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new chatModel({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text: newMessage,
        });

        await chat.save();
      } catch (err) {
        console.log("❌ Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❎ User disconnected");
    });
  });
};

module.exports = initializeSocket;
