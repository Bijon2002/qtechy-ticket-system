/**
 * Database Configuration
 * Handles connecting to MongoDB using Mongoose.
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Attempt to connect to the database using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Log the error and exit the process if connection fails
    console.error(`[Database Error] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
