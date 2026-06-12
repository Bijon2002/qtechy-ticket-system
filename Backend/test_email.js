require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { generateResetCode } = require('./src/services/authService');
const User = require('./src/models/User');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  try {
    const user = await User.findOne();
    if (!user) {
      console.log("No users found in DB.");
      return;
    }
    console.log("Testing with user email:", user.email);
    await generateResetCode(user.email);
    console.log("Code generated successfully");
  } catch (err) {
    console.error("Error generating code:", err);
  }
  mongoose.disconnect();
}

test();
