const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, ROLES } = require("../model/User");
const { validateRegister, validateLogin } = require("../middleware/validate");

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const register = async (req, res) => {
  try {
    const errors = validateRegister(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { username, phone, email, password, role } = req.body;

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Email or phone already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      phone,
      email,
      password: hash,
      role,
    });

    const token = signToken(user);

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const loginGeneric = async (req, res) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { email, phone, password, role } = req.body;

    const user = await User.findOne(
      email ? { email } : { phone }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: if client passes role, enforce match
    if (role && user.role !== role) {
      return res.status(403).json({ message: "Role mismatch for this user" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    return res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Grouped logins:

const isSchoolParent = (role) => ["school", "parent"].includes(role);
const isTeacherTutor = (role) => ["teacher", "tutor"].includes(role);

const loginSchoolParent = async (req, res) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { email, phone, password } = req.body;

    const user = await User.findOne(email ? { email } : { phone });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!isSchoolParent(user.role)) {
      return res.status(403).json({ message: "Role not allowed on this page" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      message: "Logged in successfully (school/parent)",
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login SP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const loginTeacherTutor = async (req, res) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { email, phone, password } = req.body;

    const user = await User.findOne(email ? { email } : { phone });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!isTeacherTutor(user.role)) {
      return res.status(403).json({ message: "Role not allowed on this page" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      message: "Logged in successfully (teacher/tutor)",
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login TT error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Profile (who am I)
const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};



module.exports={register,loginGeneric,loginSchoolParent,loginTeacherTutor,getProfile}