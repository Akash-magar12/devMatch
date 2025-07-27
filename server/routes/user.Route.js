const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const connectionReqModel = require("../models/ConnectionReq");
const User = require("../models/userModel");
const userRouter = express.Router();

const USER_DATA = [
  "name",
  "email",
  "gender",
  "age",
  "bio",
  "location",
  "techStack",
  "profileImage",
  " github",
  "linkedin",
  "portfolio",
];
userRouter.get("/request/recieved", authMiddleware, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connectionReq = await connectionReqModel
      .find({
        recieverId: loggedUser._id,
        status: "interested",
      })
      .populate("senderId", USER_DATA);
    res.status(200).json({ message: "fetched", data: connectionReq });
  } catch (error) {
    res.status(400).json({ message: `error : ${error.message}` });
  }
});

userRouter.get("/connection", authMiddleware, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connectionReq = await connectionReqModel
      .find({
        $or: [
          { recieverId: loggedUser._id, status: "accepted" },
          { senderId: loggedUser._id, status: "accepted" },
        ],
      })
      .populate("recieverId", USER_DATA)
      .populate("senderId", USER_DATA);

    const connectedUsers = connectionReq.map((conn) => {
      const otherUser =
        conn.senderId._id.toString() === loggedUser._id.toString()
          ? conn.recieverId
          : conn.senderId;

      return {
        connectionReqId: conn._id, // ✅ Add this
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        profileImage: otherUser.profileImage,
        gender: otherUser.gender,
        location: otherUser.location,
      };
    });

    res.status(200).json({ message: "fetched", connectedUsers });
  } catch (error) {
    res.status(400).json({ message: `error : ${error.message}` });
  }
});

userRouter.get("/feed", authMiddleware, async (req, res) => {
  const loggedUser = req.user;
  const connectionReq = await connectionReqModel
    .find({
      $or: [
        {
          recieverId: loggedUser._id,
        },
        {
          senderId: loggedUser._id,
        },
      ],
    })
    .select("senderId recieverId");

  const hideUsers = new Set();
  connectionReq.forEach((conn) => {
    hideUsers.add(conn.senderId.toString());
    hideUsers.add(conn.recieverId.toString());
  });
  const users = await User.find({
    $and: [
      {
        _id: { $nin: Array.from(hideUsers) },
      },
      {
        _id: { $ne: loggedUser._id },
      },
    ],
  }).select(USER_DATA);
  res.status(200).json({
    message: "Data fetched successfully",
    data: users,
  });
});

userRouter.delete(
  "/delete/:deletedUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const { deletedUserId } = req.params;

      const deletedUser = await connectionReqModel.findByIdAndDelete(
        deletedUserId
      );

      if (!deletedUser) {
        return res.status(404).json({ message: "Connection not found" });
      }

      res.status(200).json({
        message: "Removed connection successfully",
        deletedUser,
      });
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
);

module.exports = userRouter;
