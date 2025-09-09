const mongoose3 = require('mongoose');
const validator3 = require('validator');


const SchoolSchema = new mongoose3.Schema({
schoolName: { 
    type: String, 
    required: true
 },
email: {
type: String,
required: true,
unique: true,
lowercase: true,
validate: [validator3.isEmail, 'Invalid email']
},
password: { 
    type: String, 
    required: true 
},
role: {
     type: String, 
     enum: ['school'],
      default: 'school' },
address: { type: String },
contactNumber: { type: String },
website: { type: String },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose3.model('School', SchoolSchema);