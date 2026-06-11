const Ticket = require("../models/Ticket");
const User = require("../models/User");

/**
 * Retrieves dashboard statistics based on the user's role.
 * @param {string} role - The role of the user (admin, agent, user).
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} An object containing the stats counts.
 */
const getDashboardStats = async (role, userId) => {
  // Determine the base filter based on user role
  // - Admin sees all tickets
  // - Agent sees tickets assigned to them
  // - User sees tickets created by them
  const baseFilter =
    role === "user"
      ? { createdBy: userId }
      : role === "agent"
      ? { assignedTo: userId }
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

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    urgent,
    totalUsers,
    totalAgents,
  };
};

module.exports = {
  getDashboardStats,
};
