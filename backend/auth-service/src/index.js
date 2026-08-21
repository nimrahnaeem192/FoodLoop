require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

app.use("/api/auth", require("./routes/auth"));

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[auth-service] listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[auth-service] MongoDB connection failed:", error);
    process.exit(1);
  });
