/**
 * User Management Routes
 * Endpoints for managing users (admin only).
 */

const router = require("express").Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// All routes in this file require authentication and admin role
router.use(protect, authorize("admin"));

/**
 * Get all users with optional filtering and pagination
 */
router.get("/", userController.getAllUsers);

/**
 * Update a user's role
 */
router.put("/:id/role", userController.updateUserRole);

/**
 * Delete a user
 */
router.delete("/:id", userController.deleteUser);

module.exports = router;
