const Ticket = require('../models/Ticket');
const POPULATE = [
{ path: 'createdBy', select: 'name email' },
{ path: 'assignedTo', select: 'name email' },
{ path: 'comments.user', select: 'name' },
{ path: 'statusHistory.changedBy', select: 'name' },
];

// Create ticket
const createTicket = async (data) => {
const ticket = await Ticket.create(data);
await ticket.populate(POPULATE);
// add initial status history
ticket.statusHistory.push({ status: 'Open', changedBy: data.createdBy, note: 'Ticket created' });
await ticket.save();
return ticket;
};
// Get tickets (role-based filtering)
const getTickets = async ({ role, userId, query }) => {
const { page=1, limit=10, status, priority, category, search, sort='-createdAt' } = query;
const filter = {};
if (role === 'user') filter.createdBy = userId;
if (role === 'agent') filter.assignedTo = userId;
if (status) filter.status = status;
if (priority) filter.priority = priority;
if (category) filter.category = category;
if (search) filter.$or = [
{ title: { $regex: search, $options: 'i' } },
{ ticketNumber: { $regex: search, $options: 'i' } },
];const skip = (page - 1) * limit;
const [tickets, total] = await Promise.all([
Ticket.find(filter).populate(POPULATE).sort(sort).skip(skip).limit(Number(limit)),
Ticket.countDocuments(filter),
]);
return { tickets, total, page: Number(page), pages: Math.ceil(total / limit) };
};
// Get single ticket
const getTicketById = async (id) => {
return Ticket.findById(id).populate(POPULATE);
};
// Update ticket
const updateTicket = async (id, updates, userId) => {
const ticket = await Ticket.findById(id);
if (!ticket) throw new Error('Ticket not found');
const prevStatus = ticket.status;
Object.assign(ticket, updates);
if (updates.status && updates.status !== prevStatus) {
ticket.statusHistory.push({ status: updates.status, changedBy: userId });
}
await ticket.save();
await ticket.populate(POPULATE);
return ticket;
};
// Delete ticket
const deleteTicket = async (id) => {
return Ticket.findByIdAndDelete(id);
};
// Add comment
const addComment = async (ticketId, userId, text) => {
const ticket = await Ticket.findById(ticketId);
if (!ticket) throw new Error('Ticket not found');
ticket.comments.push({ user: userId, text });
await ticket.save();
await ticket.populate(POPULATE);
return ticket;
};
module.exports = { createTicket, getTickets, getTicketById, updateTicket, deleteTicket, addComment };
