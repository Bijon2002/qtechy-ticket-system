const User = require('../models/User');
const getAllUsers = async (query) => {
const { role, search, page=1, limit=20 } = query;
const filter = {};
if (role) filter.role = role;
if (search) filter.$or = [
{ name: { $regex: search, $options: 'i' } },
{ email: { $regex: search, $options: 'i' } },
];
const skip = (page-1)*limit;
const [users, total] = await Promise.all([
User.find(filter).select('-password').sort('-createdAt').skip(skip).limit(Number(limit)),
User.countDocuments(filter),
]);
return { users, total };
};
const updateUserRole = async (id, role) => {
return User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
};
module.exports = { getAllUsers, updateUserRole };
