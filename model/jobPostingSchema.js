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

})

module.exports=mongoose.model("Jobposting",JobPosting);