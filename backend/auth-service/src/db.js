const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  await client.connect();
  db = client.db(process.env.MONGODB_DB || "foodloop");
  console.log("[auth-service] MongoDB connected");
}

function getDB() {
  if (!db) {
    throw new Error("MongoDB is not connected");
  }
  return db;
}

module.exports = { connectDB, getDB };
