const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const connectionReqModel = require("../models/ConnectionReq");
const User = require("../models/userModel");
const connectionRouter = express.Router();

connectionRouter.post(
  "/send/:status/:recieverId",
  authMiddleware,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const { recieverId, status } = req.params;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      if (recieverId === senderId.toString()) {
        throw new Error("You cannot send a connection request to yourself");
      }

      const recieveId = await User.findById(recieverId);
      if (!recieveId) {
        throw new Error("User not found");
      }
      const existingReq = await connectionReqModel.findOne({
        $or: [
          { senderId, recieverId },
          { senderId: recieverId, recieverId: senderId },
        ],
      });

      if (existingReq) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists!!" });
      }

      const connectionReq = new connectionReqModel({
        recieverId,
        senderId,
        status,
      });
      await connectionReq.save();
      let message;
      if (status === "interested") {
        message = `You have shown interest in ${recieveId.name}`;
      } else if (status === "ignored") {
        message = `You have ignored ${recieveId.name}`;
      }
      res.status(200).json({ message });
    } catch (error) {
      res.status(400).json({ message: `error: ${error.message}` });
    }
  }
);

connectionRouter.post(
  "/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Status not valid");
      }

      const connectionReq = await connectionReqModel.findOne({
        _id: requestId,
        recieverId: loggedUser._id, // ✅ matches your schema spelling
        status: "interested",
      });

      if (!connectionReq) {
        throw new Error("Connection request not found");
      }

      connectionReq.status = status;
      const updatedRequest = await connectionReq.save();

      res.status(200).json({
        message: `Connection ${status}`,
        data: updatedRequest,
      });
    } catch (error) {
      res.status(400).json({ message: `error: ${error.message}` });
    }
  }
);

module.exports = connectionRouter;
