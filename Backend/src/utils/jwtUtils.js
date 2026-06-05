/**
 * JWT Utilities
 * Handles generating JSON Web Tokens for authentication.
 */

const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token containing the user's ID and role
 * @param {string} id - The user's database ID
 * @param {string} role - The user's role (admin, agent, user)
 * @returns {string} Signed JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

module.exports = { 
  generateToken 
};
