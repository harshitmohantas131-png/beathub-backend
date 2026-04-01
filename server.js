require("dotenv").config();
const mongoose = require("mongoose");

// ✅ IMPORT APP FIRST
const app = require("./app");

// ✅ SECURITY IMPORTS
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// ======================
// 🔐 SECURITY MIDDLEWARE
// ======================

// Helmet
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 mins"
});
app.use(limiter);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// Mongo Sanitization
app.use(mongoSanitize({
  replaceWith: "_"
  }
));

// ======================
// 📦 MODELS
// ======================
require("./models/Artist");
require("./models/Album");
require("./models/Song");

// ======================
// 🚀 ROUTES
// ======================
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes);

const songRoutes = require("./routes/song.routes");
app.use("/api/songs", songRoutes);

// ======================
// 🛠️ SERVER START
// ======================
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });