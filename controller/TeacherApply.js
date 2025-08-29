const TeacherSchema = require('../model/TeacherSchema');

const TearcherInsert = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // If file uploaded → save relative path, else null
    const uploadFile = req.file ? `/uploads/${req.file.filename}` : null;

    const data = new TeacherSchema({ name, email, message, uploadFile });
    const saveData = await data.save();

    res.send({ success: true, message: "Teacher job insert successful", saveData });
  } catch (error) {
    console.log("job insert failed", error);
    res.status(500).json({ success: false, message: 'teacher not inserted' });
  }
};


const TeacherView = async (req, res) => {
  try {
    const teachers = await TeacherSchema.find(); // get all records
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.log("teacher view failed", error);
    res.status(500).json({ success: false, message: 'Unable to fetch teachers' });
  }
};

module.exports = {TearcherInsert,TeacherView};
