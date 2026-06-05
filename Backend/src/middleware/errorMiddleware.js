/**
 * Global Error Handler Middleware
 * Catches errors from routes and provides formatted JSON responses.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Check for Mongoose bad ObjectId error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Resource not found. Invalid ID format.";
  }

  // Check for Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered.";
  }

  // Check for invalid JSON Web Token error
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or expired token.";
  }

  // Send structured error response
  res.status(statusCode).json({ 
    success: false, 
    message: message 
  });
};

module.exports = { 
  errorHandler 
};
