const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const { User, ROLES } = require("../model/User");
const { validateRegister, validateLogin } = require("../middleware/validate");

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// Your existing register function (updated to handle Google users)
const register = async (req, res) => {
  try {
    const errors = validateRegister(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { username, phone, email, password, role } = req.body;

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user exists with Google auth
    const existingGoogleUser = await User.findOne({ 
      email, 
      googleId: { $exists: true } 
    });
    
    if (existingGoogleUser) {
      return res.status(409).json({ 
        message: "Email already registered with Google. Please use Google login." 
      });
    }

    const existing = await User.findOne({ 
      $or: [{ email }, { phone }],
      googleId: { $exists: false } // Only check local users
    });
    
    if (existing) {
      return res.status(409).json({ message: "Email or phone already registered" });
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

// Google OAuth Routes
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false, // We're using JWT, not sessions
});

const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-redirect?error=auth_failed`);
    }
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-redirect?error=user_not_found`);
    }

    const token = signToken(user);

    // Redirect to frontend with token and user data
    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-redirect?token=${token}&userId=${user._id}&email=${user.email}&username=${user.username}&role=${user.role}&avatar=${user.avatar}&isVerified=${user.isVerified}`;
    return res.redirect(redirectUrl);
  })(req, res, next);
};

// Complete Google registration (set role after OAuth)
const completeGoogleRegistration = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    const token = signToken(user);

    return res.json({
      message: "Registration completed successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Complete registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Your existing login functions (updated)
const loginGeneric = async (req, res) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { email, phone, password, role } = req.body;

    const user = await User.findOne(
      email ? { email } : { phone }
    );
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user registered with Google
    if (user.googleId) {
      return res.status(400).json({ 
        message: "This account uses Google authentication. Please login with Google." 
      });
    }

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

// Keep your existing grouped login functions (loginSchoolParent, loginTeacherTutor)
// They will automatically work with the updated User model

// Profile (who am I) - updated to include Google info
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  return res.json({ 
    user: {
      ...user.toObject(),
      authMethod: user.googleId ? 'google' : 'local'
    }
  });
};

module.exports = {
  register,
  loginGeneric,
  // loginSchoolParent, // your existing
  // loginTeacherTutor, // your existing
  getProfile,
  googleAuth,
  googleCallback,
  completeGoogleRegistration,
};