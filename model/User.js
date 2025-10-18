// models/User.js
const mongoose = require("mongoose");

const ROLES = ["school", "parent", "teacher", "tutor"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: function() {
        return !this.googleId; // Only required for local authentication
      },
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: function() {
        return !this.googleId; // Only required for local authentication
      },
      trim: true,
      match: [/^[0-9]{10,15}$/, "Phone must be 10–15 digits"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Only required for local authentication
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple nulls but enforces uniqueness for non-null
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index to ensure email uniqueness per authentication method
userSchema.index({ email: 1, googleId: 1 }, { unique: true });

module.exports = {
  User: mongoose.model("User", userSchema),
  ROLES,
};