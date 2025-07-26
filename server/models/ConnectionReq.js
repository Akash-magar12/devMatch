const mongoose = require("mongoose");

const connectionReqSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'User'
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);
connectionReqSchema.index({ senderId: 1, recieverId: 1 });
const connectionReqModel = mongoose.model(
  "ConnectionRequest",
  connectionReqSchema
);
module.exports = connectionReqModel;
