const dashboardService = require("../services/dashboardService");
const { success } = require("../utils/apiResponse");

/**
 * Get dashboard statistics
 * Returns different counts based on the user's role.
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    
    const stats = await dashboardService.getDashboardStats(role, _id);
    
    success(res, stats, "Dashboard stats fetched successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
};
