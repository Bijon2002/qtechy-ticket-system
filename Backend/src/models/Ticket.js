/**
 * Ticket Model
 * Defines the schema for support tickets, including nested schemas for 
 * comments and status history.
 */

const mongoose = require("mongoose");

/**
 * Sub-document Schema for Ticket Comments
 */
const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  },
});

/**
 * Sub-document Schema for Tracking Ticket Status Changes
 */
const statusHistorySchema = new mongoose.Schema({
  status: { 
    type: String, 
    required: true 
  },
  changedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  changedAt: { 
    type: Date, 
    default: Date.now 
  },
  note: { 
    type: String 
  },
});

/**
 * Main Ticket Schema
 */
const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { 
      type: String, 
      unique: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    category: {
      type: String,
      enum: [
        "Bug",
        "Feature Request",
        "Technical Issue",
        "Payment Issue",
        "Account Issue",
        "Other",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Embed sub-documents directly into the ticket document
    comments: [commentSchema],
    statusHistory: [statusHistorySchema],
  },
  { 
    timestamps: true 
  }
);

/**
 * Pre-save Middleware
 * Automatically generates a human-readable, auto-incrementing ticket number 
 * (e.g., TKT-0001, TKT-0002) before saving a new ticket.
 */
ticketSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    // Start counting from 1 and pad with zeros to ensure a consistent format
    this.ticketNumber = `TKT-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
