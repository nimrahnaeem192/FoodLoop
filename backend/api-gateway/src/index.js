require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8080;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || "http://localhost:3002";
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:3003";

app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

function basicRequestValidation(req, res, next) {
  const mutating = ["POST", "PUT", "PATCH"].includes(req.method);
  if (!mutating) {
    return next();
  }
  const contentType = req.headers["content-type"] || "";
  if (contentType && !contentType.includes("application/json") && !contentType.includes("multipart/form-data")) {
    return res.status(400).json({
      error: "Invalid Content-Type",
      message: "Expected application/json",
    });
  }
  return next();
}

app.use(basicRequestValidation);

const proxyOptions = (target, pathFilter) => ({
  target,
  changeOrigin: true,
  pathFilter,
  onError(err, _req, res) {
    console.error("[api-gateway] proxy error:", err.message);
    if (!res.headersSent) {
      res.status(502).json({
        error: "Bad Gateway",
        message: "Upstream service is unavailable",
      });
    }
  },
});

app.use(createProxyMiddleware(proxyOptions(AUTH_SERVICE_URL, "/api/auth")));
app.use(createProxyMiddleware(proxyOptions(CORE_SERVICE_URL, "/api/food")));
app.use(createProxyMiddleware(proxyOptions(CORE_SERVICE_URL, "/api/organizations")));
app.use(createProxyMiddleware(proxyOptions(CORE_SERVICE_URL, "/api/claims")));
app.use(createProxyMiddleware(proxyOptions(CORE_SERVICE_URL, "/api/matches")));
app.use(createProxyMiddleware(proxyOptions(CORE_SERVICE_URL, "/api/dashboard")));
app.use(createProxyMiddleware(proxyOptions(AI_SERVICE_URL, "/api/ai")));

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`[api-gateway] listening on port ${PORT}`);
});
