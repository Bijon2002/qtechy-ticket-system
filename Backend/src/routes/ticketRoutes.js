const router = require('express').Router();
const ctrl = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.use(protect); // all routes require login
router.route('/')
.get(ctrl.getAll)
.post(authorize('admin', 'user'), ctrl.create);
router.route('/:id')
.get(ctrl.getOne)
.put(authorize('admin', 'agent'), ctrl.update)
.delete(authorize('admin'), ctrl.remove);
router.post('/:id/comments', ctrl.comment);
module.exports = router;