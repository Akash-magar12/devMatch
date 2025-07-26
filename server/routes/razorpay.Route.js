const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const RazorInstance = require("../utils/RazorInstance");
const razorpayRouter = express.Router();
const crypto = require("crypto");
const User = require("../models/userModel");
razorpayRouter.post("/created", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.user;
    const { plan } = req.body;
    const plans = {
      Pro: 499,
      Premium: 999,
      Elite: 1999,
    };
    const amount = plans[plan];
    if (!amount) {
      return res
        .status(400)
        .json({ message: "Invalid membership plan selected." });
    }
    const order = await RazorInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        name,
        email,
      },
    });
    res.status(200).json({ order, orderKey: process.env.RAZOR_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

razorpayRouter.post("/verification", authMiddleware, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Invalid signature. Payment not verified." });
    }
    await User.findByIdAndUpdate(req.user._id, {
      membership: plan,
    });
    res.status(200).json({
      success: true,
      message: "Payment Successfull",
    });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

razorpayRouter.get("/verify", authMiddleware, async (req, res) => {
  try {
    const loggedUser = req.user;

    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hasMembership = !!loggedUser.membership;
    const plan = loggedUser.membership || null; // Converts to true or false
    return res.status(200).json({ hasMembership, plan });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

module.exports = razorpayRouter;
