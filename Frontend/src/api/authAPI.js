import axios from 'axios';
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const registerAPI = (data) => axios.post(`${BASE}/auth/register`, data);
export const loginAPI = (data) => axios.post(`${BASE}/auth/login`, data);
export const getMeAPI = (token) => axios.get(`${BASE}/auth/me`, {
headers: { Authorization: `Bearer ${token}` },
});
