const authService = require('../services/authService');
const { success, error } = require('../utils/apiResponse');
const register = async (req, res, next) => {
try {
const data = await authService.registerUser(req.body);
success(res, data, 'Registered successfully', 201);
} catch (err) { next(err); }
};
const login = async (req, res, next) => {
try {
const data = await authService.loginUser(req.body);
success(res, data, 'Login successful');
} catch (err) { next(err); }
};
const getMe = async (req, res) => {
success(res, req.user, 'Profile fetched');
};
module.exports = { register, login, getMe };
