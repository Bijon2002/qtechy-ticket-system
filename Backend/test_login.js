const mongoose = require("mongoose");
const User = require("./src/models/User");
const dotenv = require("dotenv");

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qtechy-ticket-system");
  const user = await User.findOne({ email: "admin@qtechy.com" });
  if (!user) {
    console.log("Admin user not found");
    process.exit();
  }
  console.log("Admin found:", user.email, "Hash:", user.password);
  
  const isMatch = await user.matchPassword("password123");
  console.log("Match password123?", isMatch);
  process.exit();
}

test();
