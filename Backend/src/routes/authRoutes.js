/**
 * Authentication Routes
 * Endpoints for user registration, login, and fetching the current profile.
 */

const router = require("express").Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// Protected Routes (requires valid JWT)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
