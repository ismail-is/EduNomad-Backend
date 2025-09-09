const mongoose = require("mongoose");

const ROLES = ["school", "parent", "teacher", "tutor"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, "Phone must be 10–15 digits"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model("User", userSchema),
  ROLES,
};
