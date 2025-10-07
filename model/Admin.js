const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], // only allow these values
      default: "pending", // default status when created
    },
    updatedBy: {
      type: String, // optional: store which admin updated status
    },
    remarks: {
      type: String, // optional: reason for rejection or notes
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminController", adminSchema);
