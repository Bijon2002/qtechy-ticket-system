const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const registerUser = async ({ name, email, password, role }) => {
const exists = await User.findOne({ email });
if (exists) throw new Error('Email already registered');
const user = await User.create({ name, email, password, role: role || 'user' });
const token = generateToken(user._id, user.role);
return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token };

};
const loginUser = async ({ email, password }) => {
const user = await User.findOne({ email });
if (!user || !(await user.matchPassword(password)))
throw new Error('Invalid email or password');
if (!user.isActive) throw new Error('Account deactivated');
const token = generateToken(user._id, user.role);
return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token };
};
module.exports = { registerUser, loginUser };