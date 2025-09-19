const{json}=require('express');
const express =require('express');

const jobSchema=require('../model/jobPostingSchema');
const { param } = require('../router/mainRouter');



const JobInsert = async (req, res) => {
  try {
    const { titel, department, location, employmentType, lastdate, message,requirements } = req.body;

    const data = await new jobSchema({
      titel,
      department,
      location,
      employmentType,
      lastdate,
      message,
      requirements,
      userId: req.user.id // Add user ID from authenticated user
    });

    const saveData = await data.save();
    res.send({ "job insert successfull": true, saveData });
  } catch (error) {
    console.log("job insert faild", error);
    res.status(500).json({ success: false, message: 'Job insertion failed' });
  }
};

const JobViwe = async (req, res) => {
  try {
    // Only show jobs for the authenticated user
    const data = await jobSchema.find();
    res.send({ 'job view success': true, data });
  } catch (error) {
    console.log("jobView get error", error);
    res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};
const JobViweAuth = async (req, res) => {
  try {
    // Only show jobs for the authenticated user
    const data = await jobSchema.find({ userId: req.user.id });
    res.send({ 'job view success': true, data });
  } catch (error) {
    console.log("jobView get error", error);
    res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};

const JobViewSingle = async (req, res) => {
  try {
    // Only allow viewing if job belongs to user
    const data = await jobSchema.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!data) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.send({ 'Single view success': true, data });
  } catch (error) {
    console.log("singleView error", error);
    res.status(500).json({ success: false, message: "Error fetching job" });
  }
};

const UpdateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Only allow update if job belongs to user
    const updatedJob = await jobSchema.findOneAndUpdate(
      { 
        _id: id, 
        userId: req.user.id 
      },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: "Job not found or access denied" });
    }

    res.json({ success: true, message: "Job updated successfully", updatedJob });
  } catch (error) {
    console.log("job update error", error);
    res.status(500).json({ success: false, message: "Error updating job" });
  }
};

const DeleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow deletion if job belongs to user
    const deletedJob = await jobSchema.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!deletedJob) {
      return res.status(404).json({ success: false, message: "Job not found or access denied" });
    }

    res.json({ success: true, message: "Job deleted successfully", deletedJob });
  } catch (error) {
    console.log("job delete error", error);
    res.status(500).json({ success: false, message: "Error deleting job" });
  }
};

module.exports = { JobInsert, JobViwe, JobViewSingle, UpdateJob, DeleteJob,JobViweAuth };