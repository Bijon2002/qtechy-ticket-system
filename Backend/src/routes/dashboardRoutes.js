/**
 * Dashboard Routes
 * Endpoints for fetching statistics and metrics for the dashboard view.
 */

const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

/**
 * Get dashboard statistics
 * Returns different counts based on the user's role.
 */
router.get("/stats", protect, dashboardController.getDashboardStats);

module.exports = router;
