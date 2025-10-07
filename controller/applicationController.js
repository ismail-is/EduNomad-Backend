const Application = require('../model/Application');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
    cb(null, true);
  }
}).single('resume');

const handleApplication = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size must be less than 5MB' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { name, email, message,userId,jobId,username,jobTitel,role,lastdate,status} = req.body;

      // Validate required fields
      if (!name || !email || !req.file) {
        return res.status(400).json({ error: 'Name, email, and resume are required' });
      }

      const newApplication = new Application({
        name,
        email,
        message: message || '',
        userId,
        jobId,
        jobTitel,
        role,
        username,
        lastdate,
        status,
        resume: {
          filename: req.file.filename,
          path: req.file.path
        }
      });

      await newApplication.save();
      res.status(201).json({ message: 'Application submitted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

const applicationView = async (req, res) => {
  try {
    // Only show jobs for the authenticated user
    const data = await Application.find();
    res.send({ 'Application view success': true, data });
  } catch (error) {
    console.log("Application get error", error);
    res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};
const applicationSingleView = async (req, res) => {
  try {
    const data = await Application.findById(req.params.id);
    res.send({ 'Application view success': true, data });
  } catch (error) {
    console.log("Application get error", error);
    res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};



const adminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status} = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedRecord = await Application.findByIdAndUpdate(
      id,
      { status},
      { new: true } // return updated doc
    );

    if (!updatedRecord) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({
      success: true,
      message: "Admin status updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating admin status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { handleApplication,applicationView,applicationSingleView ,adminStatus};