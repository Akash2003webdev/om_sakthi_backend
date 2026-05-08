import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import designRoutes from "./routes/designs.js";
import categoryRoutes from "./routes/categories.js";
import serviceRoutes from "./routes/services.js";
import enquiryRoutes from "./routes/enquiries.js";

dotenv.config();

const app = express();

// ─────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────

// Allow ALL frontend URLs
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────
// Connect MongoDB
// ─────────────────────────────────────────────────────────────

connectDB();

// ─────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/enquiries", enquiryRoutes);

// ─────────────────────────────────────────────────────────────
// Health Check Route
// ─────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Om Sakthi Printers API is running 🖨️",
  });
});

// ─────────────────────────────────────────────────────────────
// 404 Route
// ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─────────────────────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
