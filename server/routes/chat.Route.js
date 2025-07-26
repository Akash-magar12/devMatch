const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const chatModel = require("../models/chatModel");
const chatRouter = express.Router();

chatRouter.get("/getChats/:targetUserId", authMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    let chat = await chatModel
      .findOne({
        participants: { $all: [userId, targetUserId] },
      })
      .populate("messages.senderId", "name");
    if (!chat) {
      chat = new chatModel({
        participants: [userId, targetUserId],
        messages: [],
      });
    }
    await chat.save();
    res.status(200).json( chat );
  } catch (error) {
    res.status(400).json({ message: `error : ${error.message}` });
  }
});

module.exports = chatRouter;
