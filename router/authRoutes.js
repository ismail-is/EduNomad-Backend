// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  loginGeneric,
  loginSchoolParent,
  loginTeacherTutor,
  getProfile,
  googleAuth,
  googleCallback,
  completeGoogleRegistration,
} = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Registration (same for all roles)
router.post("/register", register);

// Generic login
router.post("/login", loginGeneric);

// Grouped logins
// router.post("/login/school-parent", loginSchoolParent);
// router.post("/login/teacher-tutor", loginTeacherTutor);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Complete Google registration (set role)
router.post("/google/complete", authMiddleware, completeGoogleRegistration);

// Who am I (protected)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;