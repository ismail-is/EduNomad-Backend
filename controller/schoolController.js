// controllers/schoolController.js
const School = require("../model/School");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { model } = require("mongoose");

// School Registration
const registerSchool = async (req, res) => {
  try {
    const { schoolName,name, email, password, address } = req.body;

    // Check existing
    const existingSchool = await School.findOne({ email });
    if (existingSchool) {
      return res.status(400).json({ message: "School already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const school = new School({
        schoolName,
      name,
      email,
      password: hashedPassword,
      address,
    });

    await school.save();
     res.send({"School registered successfully":true,school});
  } catch (error) {
    res.status(500).json({ message: "Error registering school", error });
  }
};

// School Login
const loginSchool = async (req, res) => {
  try {
    const { email, password } = req.body;

    const school = await School.findOne({ email });
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: school._id, role: "school" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: "school" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get School Profile
const getSchoolProfile = async (req, res) => {
  try {
    const school = await School.findById(req.user.id).select("-password");
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Error fetching school profile", error });
  }
};
 module.exports={registerSchool,loginSchool,getSchoolProfile}