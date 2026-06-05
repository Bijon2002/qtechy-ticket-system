import axios from 'axios';

 const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });
export const fetchTicketsAPI = (token, params) =>
axios.get(`${BASE}/tickets`, { ...authHeader(token), params });
export const fetchTicketAPI = (token, id) =>
axios.get(`${BASE}/tickets/${id}`, authHeader(token));
export const createTicketAPI = (token, data) =>
axios.post(`${BASE}/tickets`, data, authHeader(token));
export const updateTicketAPI = (token, id, data) =>
axios.put(`${BASE}/tickets/${id}`, data, authHeader(token));
export const deleteTicketAPI = (token, id) =>
axios.delete(`${BASE}/tickets/${id}`, authHeader(token));
export const addCommentAPI = (token, id, text) =>
axios.post(`${BASE}/tickets/${id}/comments`, { text }, authHeader(token));