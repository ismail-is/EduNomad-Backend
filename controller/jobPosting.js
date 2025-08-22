const{json}=require('express');
const express =require('express');

const jobSchema=require('../model/jobPostingSchema');
const { param } = require('../router/mainRouter');



const JobInsert=async(req,res)=>{
    try{
        const {titel,department,location,employmentType,lastdate,message}=req.body;

        const data=await new jobSchema ({titel,department,location,employmentType,lastdate,message});
        const saveData=await data.save();
        res.send({"job insert successfull":true,saveData});

    }
    catch(error){
        console.log("job insert faild",error);
         res.status(500).json({success:fal,message:'checkout not insert'})
        

    }
}


const JobViwe=async(req,res)=>{
    try{
       
        const data=await jobSchema.find();
        res.send({'job view success':true,data})

    }
    catch(error){
        console.log("jobView get error");
        res.status(500).json({success:true,message:"Job view"})
        
    }
}

const JobViewSingle=async(req,res)=>{
    try{
        const data=await jobSchema.findById(req.params.id);
      res.send({'Single view success':true,data})

    }
    catch(error){
        console.log("singleView  error");
        res.status(500).json({success:true,message:"Job Single view"})
        
    }
}

const UpdateJob = async (req, res) => {
    try {
        const { id } = req.params;   // job id from URL
        const updateData = req.body; // updated fields from request body

        const updatedJob = await jobSchema.findByIdAndUpdate(id, updateData, {
            new: true,              // return updated document
            runValidators: true     // validate schema rules
        });

        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({ success: true, message: "Job updated successfully", updatedJob });
    } 
    catch (error) {
        console.log("job update error", error);
        res.status(500).json({ success: false, message: "Error updating job" });
    }
};





const DeleteJob = async (req, res) => {
    try {
        const { id } = req.params;  // take job id from URL

        const deletedJob = await jobSchema.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({ success: true, message: "Job deleted successfully", deletedJob });
    } 
    catch (error) {
        console.log("job delete error", error);
        res.status(500).json({ success: false, message: "Error deleting job" });
    }
};




module.exports={JobInsert,JobViwe,JobViewSingle,UpdateJob,DeleteJob};