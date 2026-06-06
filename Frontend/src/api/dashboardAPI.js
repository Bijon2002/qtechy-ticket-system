import axios from "axios";

const BASE = "http://localhost:5000/api";

/**
 * Fetch dashboard statistics
 * @param {string} token 
 */
export const fetchStatsAPI = (token) =>
  axios.get(`${BASE}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
