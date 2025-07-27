const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateEditProfile } = require("../utils/validator");
const upload = require("../middlewares/multer");
const getDataUri = require("../utils/dataUri");
const profileRouter = express.Router();
const cloudinary = require("../utils/cloudinaryConfig");
profileRouter.get("/view", authMiddleware, async (req, res) => {
  const user = req.user;
  res.status(200).json({ message: "data fetched", user });
});

profileRouter.patch(
  "/edit",
  authMiddleware,
  upload.single("profile"),
  async (req, res) => {
    const file = req.file;
    try {
      if (!validateEditProfile(req)) {
        throw new Error("Invalid edit");
      }
      const loggedUser = req.user;
      const data = req.body;

      if (file) {
        const fileUri = getDataUri(file);
        const cloudUpload = await cloudinary.uploader.upload(fileUri.content, {
          folder: "devMatch",
        });
        loggedUser.profileImage = cloudUpload.secure_url;
      }
      Object.keys(data).forEach((key) => (loggedUser[key] = data[key]));
      await loggedUser.save();
      res
        .status(200)
        .json({ message: "updated sucessfully", data: loggedUser });
    } catch (error) {
      res.status(400).json({ message: `error : ${error.message}` });
    }
  }
);
module.exports = profileRouter;
