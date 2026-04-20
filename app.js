const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

// ✅ Imports
const logger = require("./src/utils/logger");
const correlationId = require("./src/middlewares/correlationId");
const {
  httpRequestCounter,
  httpRequestDuration,
  client
} = require("./src/utils/metrics");

// =====================
// MIDDLEWARES
// =====================
app.use(cors());
app.use(express.json());

// ✅ Correlation ID first
app.use(correlationId);

// ✅ Request logging middleware (NEW - important)
app.use((req, res, next) => {
  req.logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl
  });
  next();
});

// =====================
// METRICS MIDDLEWARE
// =====================
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode
      },
      duration
    );

    // ✅ Log response also
    req.logger.info("Request completed", {
      status: res.statusCode,
      duration
    });
  });

  next();
});

// =====================
// ROUTES
// =====================
app.get("/", (req, res) => {
  req.logger.info("Root route accessed");

  res.json({
    message: "Welcome to BeatHub API Production Server 🚀",
    documentation: "/api-docs"
  });
});

// ✅ Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ✅ API Routes
const songRoutes = require("./routes/song.routes");
app.use("/api/songs", songRoutes);

// ✅ Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // ❌ remove console.error
  // ✅ use structured logger
  if (req.logger) {
    req.logger.error("Unhandled error", {
      message: err.message,
      stack: err.stack
    });
  } else {
    logger.error("Unhandled error (no req context)", {
      message: err.message,
      stack: err.stack
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;