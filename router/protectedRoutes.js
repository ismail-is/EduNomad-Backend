const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// School & Parent-only route
router.get(
  "/school-parent",
  authMiddleware,
  roleMiddleware(["school", "parent"]),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.role}! (School/Parent zone)` });
  }
);

// Teacher & Tutor-only route
router.get(
  "/teacher-tutor",
  authMiddleware,
  roleMiddleware(["teacher", "tutor"]),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.role}! (Teacher/Tutor zone)` });
  }
);

module.exports = router;
