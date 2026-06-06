/**
 * Authentication API Service
 * Handles HTTP requests for user registration, login, and fetching current user profile.
 */

import axios from "axios";

// Base URL for backend API
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Register a new user
 * @param {Object} data - User details (name, email, password, role)
 */
export const registerAPI = (data) => axios.post(`${BASE}/auth/register`, data);

/**
 * Authenticate a user and get a token
 * @param {Object} data - Login credentials (email, password)
 */
export const loginAPI = (data) => axios.post(`${BASE}/auth/login`, data);

/**
 * Fetch the currently authenticated user's profile
 * @param {string} token - JWT authentication token
 */
export const getMeAPI = (token) =>
  axios.get(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * Update the currently authenticated user's profile
 * @param {Object} data - Updated profile details
 * @param {string} token - JWT authentication token
 */
export const updateProfileAPI = (data, token) =>
  axios.put(`${BASE}/auth/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
