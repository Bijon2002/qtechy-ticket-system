/**
 * User Management Routes
 * Endpoints for managing users (admin only).
 */

const router = require("express").Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const userService = require("../services/userService");
const { success } = require("../utils/apiResponse");

// All routes in this file require authentication and admin role
router.use(protect, authorize("admin"));

/**
 * Get all users with optional filtering and pagination
 */
router.get("/", async (req, res, next) => {
  try {
    const data = await userService.getAllUsers(req.query);
    success(res, data, "Users fetched successfully");
  } catch (err) {
    next(err);
  }
});

/**
 * Update a user's role
 */
router.put("/:id/role", async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserRole(req.params.id, req.body.role);
    success(res, updatedUser, "Role updated successfully");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
