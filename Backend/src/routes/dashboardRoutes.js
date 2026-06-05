const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { success } = require('../utils/apiResponse');
router.get('/stats', protect, async (req, res, next) => {
try {
const { role, _id } = req.user;
const baseFilter = role==='user' ? { createdBy:_id } : role==='agent' ? { assignedTo:_id } : {};
const [total, open, inProgress, resolved, closed, urgent] = await Promise.all([
Ticket.countDocuments(baseFilter),
Ticket.countDocuments({ ...baseFilter, status: 'Open' }),
Ticket.countDocuments({ ...baseFilter, status: 'In Progress' }),
Ticket.countDocuments({ ...baseFilter, status: 'Resolved' }),
Ticket.countDocuments({ ...baseFilter, status: 'Closed' }),
Ticket.countDocuments({ ...baseFilter, priority: 'Urgent' }),
]);
let totalUsers = 0, totalAgents = 0;
if (role === 'admin') {
[totalUsers, totalAgents] = await Promise.all([
User.countDocuments({ role: 'user' }),
User.countDocuments({ role: 'agent' }),
]);
}
success(res, { total, open, inProgress, resolved, closed, urgent, totalUsers, totalAgents });
} catch (err) { next(err); }
});
module.exports = router;