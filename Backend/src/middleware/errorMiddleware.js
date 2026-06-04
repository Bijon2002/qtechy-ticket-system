const errorHandler = (err, req, res, next) => {
let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
let message = err.message || 'Server Error';

// Mongoose bad ObjectId
if (err.name === 'CastError') {
statusCode = 400; message = 'Resource not found';
}

// Mongoose duplicate key
if (err.code === 11000) {
statusCode = 400; message = 'Duplicate field value';
}

// JWT errors
if (err.name === 'JsonWebTokenError') {
statusCode = 401; message = 'Invalid token';
}
res.status(statusCode).json({ success: false, message });
};
module.exports = { errorHandler };