/**
 * Ticket Service
 * Contains business logic for creating, fetching, updating, and deleting tickets,
 * as well as handling ticket comments.
 */

const Ticket = require("../models/Ticket");

// Common population options to fetch related user data instead of just ObjectIds
const POPULATE = [
  { path: "createdBy", select: "name email" },
  { path: "assignedTo", select: "name email" },
  { path: "comments.user", select: "name" },
  { path: "statusHistory.changedBy", select: "name" },
];

/**
 * Create a new ticket
 */
const createTicket = async (data) => {
  const ticket = await Ticket.create(data);
  await ticket.populate(POPULATE);
  
  // Add an initial entry to the status history log
  ticket.statusHistory.push({
    status: "Open",
    changedBy: data.createdBy,
    note: "Ticket created",
  });
  
  await ticket.save();
  return ticket;
};

/**
 * Fetch multiple tickets with role-based filtering, search, and pagination
 */
const getTickets = async ({ role, userId, query }) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    category,
    search,
    sort = "-createdAt",
  } = query;
  
  const filter = {};
  
  // Role-based visibility
  if (role === "user") filter.createdBy = userId;
  if (role === "agent") filter.assignedTo = userId;
  
  // Additional filters
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  
  // Search functionality (matches title or ticket number)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { ticketNumber: { $regex: search, $options: "i" } },
    ];
  }
  
  const skip = (page - 1) * limit;
  
  // Execute queries concurrently
  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate(POPULATE)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Ticket.countDocuments(filter),
  ]);
  
  return {
    tickets,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

/**
 * Fetch a single ticket by its ID
 */
const getTicketById = async (id) => {
  return Ticket.findById(id).populate(POPULATE);
};

/**
 * Update an existing ticket
 */
const updateTicket = async (id, updates, userId) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) throw new Error("Ticket not found");
  
  const prevStatus = ticket.status;
  Object.assign(ticket, updates);
  
  // If the status has changed, log it in the status history
  if (updates.status && updates.status !== prevStatus) {
    ticket.statusHistory.push({ 
      status: updates.status, 
      changedBy: userId 
    });
  }
  
  await ticket.save();
  await ticket.populate(POPULATE);
  return ticket;
};

/**
 * Delete a ticket
 */
const deleteTicket = async (id) => {
  return Ticket.findByIdAndDelete(id);
};

/**
 * Add a comment to a ticket
 */
const addComment = async (ticketId, userId, text) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ticket not found");
  
  ticket.comments.push({ 
    user: userId, 
    text 
  });
  
  await ticket.save();
  await ticket.populate(POPULATE);
  return ticket;
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment,
};
