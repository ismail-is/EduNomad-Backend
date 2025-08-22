const mongoose =require('mongoose');
const validator  =require('validator')
const {Schema}=mongoose;


const TeacherSchema= new Schema({
    name:{
        type:String
    },
   email: {
         type: String,
         required: true,
         unique: true,
         validate: {
         validator: validator.isEmail,
         message: "Please enter a valid email"
  }
},
    message :{
        type:String
    },
    uploadFile:{
   type:String
},

})

module.exports=mongoose.model("Teacher",TeacherSchema);