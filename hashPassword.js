const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "Shal@123"; // Change this
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
}

generateHash();
