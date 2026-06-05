/**
 * API Response Utilities
 * Provides consistent formatting for API success and error responses.
 */

/**
 * Format a successful API response
 */
const success = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({ 
    success: true, 
    message, 
    data 
  });
};

/**
 * Format an error API response
 */
const error = (res, message = "Error", statusCode = 400) => {
  return res.status(statusCode).json({ 
    success: false, 
    message 
  });
};

module.exports = { 
  success, 
  error 
};
