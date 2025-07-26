const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;

    const user = await User.findById(_id).select("-password");
    if (!user) {
      // return res.status(404).json({ message: "User not found" });
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: `error : ${error.message}` });
  }
};

module.exports = authMiddleware;
