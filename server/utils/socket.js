const socket = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../models/chatModel");
const getSecretId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId, userName }) => {
      const roomId = getSecretId(userId, targetUserId);
      socket.join(roomId);
      console.log(userName + " joined room " + roomId);
    });
    socket.on(
      "sendMessage",
      async ({ userName, userId, targetUserId, newMessage }) => {
        try {
          const roomId = getSecretId(userId, targetUserId);
          console.log(userName + newMessage);
          io.to(roomId).emit("messageRecieved", { userName, newMessage });
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
        } catch (error) {
          console.log(error);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
  7;
};

module.exports = initializeSocket;
