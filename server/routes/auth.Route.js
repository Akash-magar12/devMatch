const express = require("express");
const bcrypt = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { validateSignupData, validateLoginData } = require("../utils/validator");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { name, email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new Error("Email already existed");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("token", token);
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: `error : ${error.message}` });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error("incorrect password");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
//! delete password
    const userData = user.toObject();
    delete userData.password;
    res.cookie("token", token);
    res.status(201).json({ message: "Login successfully", data: userData });
  } catch (error) {
    res.status(400).json({ message: `error : ${error.message}` });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = authRouter;
