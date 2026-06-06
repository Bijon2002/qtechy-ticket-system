/**
 * Authentication Routes
 * Endpoints for user registration, login, and fetching the current profile.
 */

const router = require("express").Router();
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes (requires valid JWT)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
