const express = require("express");
const router = express.Router();
const {
  register,
  loginGeneric,
  loginSchoolParent,
  loginTeacherTutor,
  getProfile,
} = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Registration (same for all roles – choose role in dropdown on frontend)
router.post("/register", register);

// Generic login (if you want one endpoint)
router.post("/login", loginGeneric);

// Grouped logins for your two pages:
router.post("/login/school-parent", loginSchoolParent);
router.post("/login/teacher-tutor", loginTeacherTutor);

// Who am I (protected)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
