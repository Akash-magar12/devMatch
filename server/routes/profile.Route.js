const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateEditProfile } = require("../utils/validator");
const profileRouter = express.Router();

profileRouter.get("/view", authMiddleware, async (req, res) => {
  const user = req.user;
  res.status(200).json({ message: "data fetched", user });
});

profileRouter.patch("/edit", authMiddleware, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid edit");
    }
    const loggedUser = req.user;
    const data = req.body;
    Object.keys(data).forEach((key) => (loggedUser[key] = data[key]));
    await loggedUser.save();
    res.status(200).json({ message: "updated sucessfully", data: loggedUser });
  } catch (error) {
    res.status(400).json({ message: `error : ${error.message}` });
  }
});
module.exports = profileRouter;
