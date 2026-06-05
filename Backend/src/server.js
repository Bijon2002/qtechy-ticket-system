/**
 * Main Entry Point of the Backend Server
 * This file connects to the database and starts the Express server.
 */

const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

// Define the port, defaulting to 5000 if not specified in environment variables
const PORT = process.env.PORT || 5000;

// Initialize Database connection, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] Running and listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[Server] Failed to connect to DB. Exiting...");
    process.exit(1);
  });
