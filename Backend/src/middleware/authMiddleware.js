const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
const header = req.headers.authorization;
if (!header || !header.startsWith('Bearer ')) {
return res.status(401).json({ success: false, message: 'Not authorized' });
}
try {
const token = header.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id).select('-password');
next();
} 
catch (err) {
res.status(401).json({ success: false, message: 'Token invalid' });
}
};
const authorize = (...roles) => (req, res, next) => {
if (!roles.includes(req.user.role)) {
return res.status(403).json({ success: false, message: 'Forbidden' });
}
next();
};
module.exports = { protect, authorize };
