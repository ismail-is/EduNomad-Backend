const mongoose = require('mongoose');
const {Schema}=mongoose;
const applicationSchema = new Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
    
  },
  jobTitel:{
        type: String,
    },
    role:{
      type: String,
    },
    username:{
        type: String,
    },
    lastdate:{
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], // only allow these values
      default: "pending", // default status when created
    },
  
    jobId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Jobposting"
    },
    
  resume: {
    filename: {
      type: String,
    },
    path: {
      type: String,
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);