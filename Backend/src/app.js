/**
 * Express Application Configuration
 * Sets up middleware, routing, and error handling for the application.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const dashRoutes = require("./routes/dashboardRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Global Middleware Setup
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// Enable CORS with credentials support (allow frontend to send cookies/tokens)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://qtechy-ticket-system.pages.dev",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
  })
);

// Built-in middleware for parsing JSON bodies (increased limit for base64 images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Morgan is used for logging HTTP requests in development
app.use(morgan("dev"));

// API Routes mounting
app.use("/api/auth", authRoutes);       // Authentication routes (login, register)
app.use("/api/users", userRoutes);      // User management routes
app.use("/api/tickets", ticketRoutes);  // Ticket management routes
app.use("/api/dashboard", dashRoutes);  // Dashboard statistics routes

// Global Error Handling Middleware
// Should be the last middleware added so it catches all errors
app.use(errorHandler);

module.exports = app;
