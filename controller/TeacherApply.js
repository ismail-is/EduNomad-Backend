const express =require('express');
const TeacherSchema=require('../model/TeacherSchema')




const TearcherInsert=async(req,res)=>{
try{
     const {name,email,message,uploadFile}=req.body;
    const data=await new TeacherSchema({name,email,message,uploadFile});
    const saveData=await data.save();
     res.send({"teacher job  insert successfull":true,saveData});
}
catch(error){
            console.log("job insert faild",error);
             res.status(500).json({success:fal,message:'checkout not insert'})
    
}

}
module.exports=TearcherInsert