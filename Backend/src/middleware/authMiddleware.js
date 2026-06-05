/**
 * Authentication and Authorization Middleware
 * Provides middleware to protect routes requiring authentication,
 * and middleware to restrict access based on user roles.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect Middleware
 * Ensures the request contains a valid JWT token in the Authorization header.
 * Attaches the user object to the request object if successful.
 */
const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
  
  try {
    // Extract the token from the "Bearer <token>" string
    const token = header.split(" ")[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID from token payload and exclude the password field
    req.user = await User.findById(decoded.id).select("-password");
    
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Not authorized, token invalid or expired" });
  }
};

/**
 * Authorize Middleware
 * Restricts access to specific roles (e.g., admin, agent, user).
 * Must be used AFTER the `protect` middleware.
 * 
 * @param  {...string} roles - The roles allowed to access the route.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden, insufficient permissions" });
    }
    next();
  };
};

module.exports = { 
  protect, 
  authorize 
};
