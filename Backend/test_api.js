const axios = require('axios');

async function test() {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: "admin@qtechy.com",
      password: "password123"
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR:", err.response ? err.response.data : err.message);
  }
}

test();
