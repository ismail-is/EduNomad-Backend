const mongoose = require('mongoose');
const {Schema}=mongoose;
const applicationSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
    
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