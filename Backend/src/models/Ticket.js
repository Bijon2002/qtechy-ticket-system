const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
text: { type: String, required: true },
addedAt: { type: Date, default: Date.now },
});

const statusHistorySchema = new mongoose.Schema({
status: { type: String, required: true },
changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
changedAt: { type: Date, default: Date.now },
note: { type: String },
});

const ticketSchema = new mongoose.Schema({
ticketNumber: { type: String, unique: true },
title: { type: String, required: true, trim: true },
description: { type: String, required: true },
category: {
type: String,
enum: ['Bug','Feature Request','Technical Issue','Payment Issue','Account Issue','Other'],
required: true,
},

priority: { type: String, enum: ['Low','Medium','High','Urgent'], default: 'Medium' },
status: { type: String, enum: ['Open','In Progress','Resolved','Closed'], default: 'Open' },
assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
comments: [commentSchema],
statusHistory: [statusHistorySchema],
}, { timestamps: true });

// Auto-generate ticketNumber before save
ticketSchema.pre('save', async function(next) {
if (this.isNew) {
const count = await this.constructor.countDocuments();
this.ticketNumber = `TKT-${String(count + 1).padStart(4, '0')}`;
}
next();
});
module.exports = mongoose.model('Ticket', ticketSchema);