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

module.exports = { 
  register, 
  login, 
  getMe,
  updateProfile
};
