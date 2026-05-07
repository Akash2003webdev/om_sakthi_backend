import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/login
// Body: { password: "admin_pass" }
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, message: "Login successful" });
});

export default router;
