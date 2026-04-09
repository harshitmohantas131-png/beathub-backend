require("dotenv").config();

const mongoose = require("mongoose");

// Load models
require("./models/Artist");
require("./models/Album");
require("./models/Song");

const app = require("./app");

// 🔒 Validate critical environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in .env");
  process.exit(1);
}

// 🌍 Set port with fallback
const PORT = process.env.PORT || 5000;

// 🚀 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });