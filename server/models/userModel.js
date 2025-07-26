const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: `{VALUE} is not a gender type`,
      },
    },
    age: {
      type: Number,
      min: 16,
      max: 100,
    },
    bio: {
      type: String,
      maxlength: 300,
    },
    location: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    },

    techStack: {
      type: [String],
    },

    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    membership: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// const User = mongoose.model("User", userSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
