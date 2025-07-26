const Razorpay = require("razorpay");

const RazorInstance = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

module.exports = RazorInstance;
