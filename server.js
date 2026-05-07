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

// ─── Middleware ───────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Connect MongoDB ──────────────────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/enquiries", enquiryRoutes);

console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);

// ─── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Om Sakthi Printers API is running 🖨️" });
});

// ─── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
