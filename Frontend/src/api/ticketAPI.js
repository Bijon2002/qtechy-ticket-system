/**
 * Ticket API Service
 * Handles all HTTP requests related to tickets (CRUD operations, comments).
 */

import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to build the authorization header
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Fetch a paginated list of tickets
 */
export const fetchTicketsAPI = (token, params) =>
  axios.get(`${BASE}/tickets`, { ...authHeader(token), params });

/**
 * Fetch a single ticket by ID
 */
export const fetchTicketAPI = (token, id) =>
  axios.get(`${BASE}/tickets/${id}`, authHeader(token));

/**
 * Create a new ticket
 */
export const createTicketAPI = (token, data) =>
  axios.post(`${BASE}/tickets`, data, authHeader(token));

/**
 * Update an existing ticket (status, priority, etc.)
 */
export const updateTicketAPI = (token, id, data) =>
  axios.put(`${BASE}/tickets/${id}`, data, authHeader(token));

/**
 * Delete a ticket
 */
export const deleteTicketAPI = (token, id) =>
  axios.delete(`${BASE}/tickets/${id}`, authHeader(token));

/**
 * Add a comment to a ticket
 */
export const addCommentAPI = (token, id, text) =>
  axios.post(`${BASE}/tickets/${id}/comments`, { text }, authHeader(token));
