/**
 * Ticket Routes
 * Endpoints for creating, viewing, updating, and deleting tickets.
 */

const router = require("express").Router();
const ctrl = require("../controllers/ticketController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All ticket routes require authentication
router.use(protect);

router
  .route("/")
  .get(ctrl.getAll)
  .post(authorize("admin", "user"), ctrl.create);

router
  .route("/:id")
  .get(ctrl.getOne)
  .put(authorize("admin", "agent"), ctrl.update)
  .delete(authorize("admin"), ctrl.remove);

// Route for adding comments to a ticket
router.post("/:id/comments", ctrl.comment);

module.exports = router;
