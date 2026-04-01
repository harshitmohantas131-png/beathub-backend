const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();
const analyticsRoutes= require('./routes/analytics');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to BeatHub API Production Server 🚀",
    documentation: "/api-docs"
  });
});

const songRoutes = require("./routes/song.routes");
app.use("/api/songs", songRoutes);

app.use("/api/analytics",analyticsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const userRoutes = require("./routes/users.routes");
app.use("/api/users", userRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;