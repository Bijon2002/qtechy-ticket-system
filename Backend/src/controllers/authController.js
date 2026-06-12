/**
 * Authentication Controller
 * Handles user registration, login, and fetching current user profile.
 */

const authService = require("../services/authService");
const { success, error } = require("../utils/apiResponse");

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const data = await authService.registerUser(req.body);
    success(res, data, "Registered successfully", 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Login an existing user
 */
const login = async (req, res, next) => {
  try {
    const data = await authService.loginUser(req.body);
    success(res, data, "Login successful");
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user profile
 */
const getMe = async (req, res) => {
  success(res, req.user, "Profile fetched");
};

/**
 * Update current authenticated user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
    success(res, updatedUser, "Profile updated successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * Change current authenticated user password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    success(res, null, "Password changed successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * Forgot password - Generate and send reset code
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    await authService.generateResetCode(email);
    success(res, null, "If the email is registered, a reset code has been sent");
  } catch (err) {
    next(err);
  }
};

/**
 * Verify the reset code
 */
const verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Email and code are required" });
    }
    await authService.verifyResetCode(email, code);
    success(res, null, "Code verified successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * Reset password using code
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: "Email, code, and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }
    await authService.resetPassword(email, code, newPassword);
    success(res, null, "Password reset successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  register, 
  login, 
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword
};

