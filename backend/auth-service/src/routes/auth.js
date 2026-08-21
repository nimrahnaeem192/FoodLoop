const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "donor" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const db = getDB();
    const users = db.collection("users");

    if (await users.findOne({ email })) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: result.insertedId,
        name,
        email,
        role
      }
    });
  } catch (error) {
    console.error("[auth] register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = getDB();
    const user = await db.collection("users").findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("[auth] login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
