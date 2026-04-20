const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const correlationId = req.headers["x-correlation-id"] || uuidv4();

  req.correlationId = correlationId;

  // attach child logger
  req.logger = logger.child({ correlationId });

  res.setHeader("x-correlation-id", correlationId);

  next();
};