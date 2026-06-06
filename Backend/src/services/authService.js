/**
 * Authentication Service
 * Contains business logic for user registration and login.
 */

const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");

/**
 * Register a new user in the database
 */
const registerUser = async ({ name, email, password, role }) => {
  // Check if user already exists
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Email already registered");
  }
  
  // Create the user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });
  
  // Generate authentication token
  const token = generateToken(user._id, user.role);
  
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Authenticate a user and generate a token
 */
const loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ email });
  
  // Verify user exists and password is correct
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password");
  }
  
  // Check if account is active
  if (!user.isActive) {
    throw new Error("Account deactivated");
  }
  
  // Generate authentication token
  const token = generateToken(user._id, user.role);
  
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email;
  if (updates.avatar !== undefined) user.avatar = updates.avatar;

  await user.save();
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
};

module.exports = { 
  registerUser, 
  loginUser,
  updateUserProfile
};
