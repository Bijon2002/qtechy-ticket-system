const userService = require("../services/userService");
const { success } = require("../utils/apiResponse");

/**
 * Get all users with optional filtering and pagination
 */
const getAllUsers = async (req, res, next) => {
  try {
    const data = await userService.getAllUsers(req.query);
    success(res, data, "Users fetched successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * Update a user's role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserRole(req.params.id, req.body.role);
    success(res, updatedUser, "Role updated successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user
 */
const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    success(res, null, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};
