/**
 * Authentication Service
 * Contains business logic for user registration and login.
 */

const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");
const { sendEmail } = require("../utils/emailUtils");

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
      avatar: user.avatar,
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
      avatar: user.avatar,
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

/**
 * Change user password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect");
  
  user.password = newPassword;
  await user.save();
  return true;
};

/**
 * Generate a reset code, save it to the user, and send an email
 */
const generateResetCode = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // We don't want to reveal whether a user exists, so we just return true
    return true;
  }

  // Generate a 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save code to user document, expires in 15 minutes
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  // Send the email
  const emailSent = await sendEmail({
    to: user.email,
    subject: "Password Reset Code",
    text: `You requested a password reset. Your 6-digit code is: ${resetCode}\n\nThis code will expire in 15 minutes.`,
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Your 6-digit code is:</p>
      <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">${resetCode}</h3>
      <p>This code will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });

  if (!emailSent) {
    // If email failed to send, remove the code
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    throw new Error("Failed to send email");
  }

  return true;
};

/**
 * Verify a reset code
 */
const verifyResetCode = async (email, code) => {
  const user = await User.findOne({
    email,
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset code");
  }

  return true;
};

/**
 * Reset the password using the code
 */
const resetPassword = async (email, code, newPassword) => {
  const user = await User.findOne({
    email,
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset code");
  }

  // Update password and clear reset fields
  user.password = newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return true;
};

module.exports = { 
  registerUser, 
  loginUser,
  updateUserProfile,
  changePassword,
  generateResetCode,
  verifyResetCode,
  resetPassword
};

