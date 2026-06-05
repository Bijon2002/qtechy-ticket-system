/**
 * User Model
 * Defines the schema for users, including authentication logic (password hashing and comparison).
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [6, "Password must be at least 6 characters"] 
    },
    role: { 
      type: String, 
      enum: ["admin", "agent", "user"], 
      default: "user" 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { 
    timestamps: true 
  }
);

/**
 * Pre-save Middleware
 * Hashes the user's password before saving it to the database.
 */
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return;
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: matchPassword
 * Compares an entered password with the hashed password in the database.
 * @param {string} enteredPassword - The plain text password to check.
 * @returns {boolean} True if passwords match, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
