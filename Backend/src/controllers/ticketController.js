const ticketService = require('../services/ticketService');
const { success, error } = require('../utils/apiResponse');
const create = async (req, res, next) => {
try {
const ticket = await ticketService.createTicket({ ...req.body, createdBy: req.user._id });
success(res, ticket, 'Ticket created', 201);
} catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
try {
const data = await ticketService.getTickets({ role: req.user.role, userId: req.user._id, query: req.query
});
success(res, data, 'Tickets fetched');
} catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
try {
const ticket = await ticketService.getTicketById(req.params.id);
if (!ticket) return error(res, 'Ticket not found', 404);
success(res, ticket, 'Ticket fetched');
} catch (err) { next(err); }
};
const update = async (req, res, next) => {
try {
const ticket = await ticketService.updateTicket(req.params.id, req.body, req.user._id);
success(res, ticket, 'Ticket updated');
} catch (err) { next(err); }
};
const remove = async (req, res, next) => {
try {
await ticketService.deleteTicket(req.params.id);
success(res, null, 'Ticket deleted');
} catch (err) { next(err); }
};
const comment = async (req, res, next) => {
try {
const ticket = await ticketService.addComment(req.params.id, req.user._id, req.body.text);
success(res, ticket, 'Comment added');
} catch (err) { next(err); }
};
module.exports = { create, getAll, getOne, update, remove, comment };