const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// const ticketRoutes = require('./routes/ticketRoutes');
// const dashRoutes = require('./routes/dashboardRoutes');
// const { errorHandler } = require('./middleware/errorMiddleware');
const app = express();

app.use(helmet());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());

app.use(morgan('dev'));

// app.use('/api/auth', authRoutes);

// // app.use('/api/users', userRoutes);

// // app.use('/api/tickets', ticketRoutes);

// // app.use('/api/dashboard', dashRoutes);

// app.use(errorHandler);

module.exports = app;