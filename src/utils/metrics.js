const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of requests",
  labelNames: ["method", "route", "status"]
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5]
});

module.exports = {
  client,
  httpRequestCounter,
  httpRequestDuration
};