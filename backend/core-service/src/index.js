require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "core-service",
  });
});

app.use("/api/food", require("./routes/food"));
app.use("/api/organizations", require("./routes/organizations"));
app.use("/api/claims", require("./routes/claims"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[core-service] listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("[core-service] startup failed:", error);
    process.exit(1);
  }
}

startServer();