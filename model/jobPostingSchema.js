const mongoose =require('mongoose');
const {Schema}=mongoose;


const JobPosting= new Schema({
    titel:{
        type:String
    },
    department:{
        type:String
    },
    location :{
        type:String
    },
    employmentType:{
   type:String
},
lastdate:{
    type:Date
},
message:{
    type:String
},
requirements:{
    type:String
},
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }},
  {
  timestamps: true // Adds createdAt and updatedAt fields

})

module.exports=mongoose.model("Jobposting",JobPosting);