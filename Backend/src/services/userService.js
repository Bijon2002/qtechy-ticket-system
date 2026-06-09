/**
 * User Service
 * Contains business logic for managing users (admin operations).
 */

const User = require("../models/User");

/**
 * Retrieve all users with filtering, searching, and pagination
 */
const getAllUsers = async (query) => {
  const { role, search, page = 1, limit = 20 } = query;
  
  // Build the filter object
  const filter = {};
  if (role) filter.role = role;
  
  // Apply search condition on name or email
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
    
  const skip = (page - 1) * limit;
  
  // Execute queries concurrently
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  
  return { 
    users, 
    total 
  };
};

/**
 * Update a specific user's role
 */
const updateUserRole = async (id, role) => {
  return User.findByIdAndUpdate(
    id, 
    { role }, 
    { new: true }
  ).select("-password");
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = { 
  getAllUsers, 
  updateUserRole,
  deleteUser
};
