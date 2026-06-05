const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const userService = require('../services/userService');
const { success } = require('../utils/apiResponse');
router.use(protect, authorize('admin'));
router.get('/', async (req, res, next) => {
try { success(res, await userService.getAllUsers(req.query)); }
catch (err) { next(err); }
});
router.put('/:id/role', async (req, res, next) => {
try { success(res, await userService.updateUserRole(req.params.id, req.body.role), 'Role updated'); }
catch (err) { next(err); }
});
module.exports = router;
