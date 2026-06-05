/**
 * Dashboard Routes
 * Endpoints for fetching statistics and metrics for the dashboard view.
 */

const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { success } = require("../utils/apiResponse");

/**
 * Get dashboard statistics
 * Returns different counts based on the user's role.
 */
router.get("/stats", protect, async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    
    // Determine the base filter based on user role
    // - Admin sees all tickets
    // - Agent sees tickets assigned to them
    // - User sees tickets created by them
    const baseFilter =
      role === "user"
        ? { createdBy: _id }
        : role === "agent"
        ? { assignedTo: _id }
        : {};
        
    // Execute multiple count queries concurrently
    const [total, open, inProgress, resolved, closed, urgent] =
      await Promise.all([
        Ticket.countDocuments(baseFilter),
        Ticket.countDocuments({ ...baseFilter, status: "Open" }),
        Ticket.countDocuments({ ...baseFilter, status: "In Progress" }),
        Ticket.countDocuments({ ...baseFilter, status: "Resolved" }),
        Ticket.countDocuments({ ...baseFilter, status: "Closed" }),
        Ticket.countDocuments({ ...baseFilter, priority: "Urgent" }),
      ]);
      
    let totalUsers = 0;
    let totalAgents = 0;
    
    // Only admins get user/agent counts
    if (role === "admin") {
      [totalUsers, totalAgents] = await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "agent" }),
      ]);
    }
    
    success(res, {
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
      totalUsers,
      totalAgents,
    }, "Dashboard stats fetched successfully");
    
  } catch (err) {
    next(err);
  }
});

module.exports = router;
