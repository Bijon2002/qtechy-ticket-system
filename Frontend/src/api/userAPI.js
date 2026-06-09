/**
 * User API Service
 * Handles HTTP requests for user management (admin only).
 */

import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to build the authorization header
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Fetch all users (with optional search and pagination)
 */
export const fetchUsersAPI = (token, params) =>
  axios.get(`${BASE}/users`, { ...authHeader(token), params });

/**
 * Update a user's role
 */
export const updateUserRoleAPI = (token, id, role) =>
  axios.put(`${BASE}/users/${id}/role`, { role }, authHeader(token));

/**
 * Delete a user
 */
export const deleteUserAPI = (token, id) =>
  axios.delete(`${BASE}/users/${id}`, authHeader(token));
