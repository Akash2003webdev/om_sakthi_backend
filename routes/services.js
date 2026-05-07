import express from "express";
import Service from "../models/Service.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET /api/services — public
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/services — admin only
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { icon, title, description, highlight } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });

    const service = new Service({ icon, title: title.trim(), description, highlight });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/services/:id — admin only
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { icon, title, description, highlight } = req.body;
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { icon, title: title?.trim(), description, highlight },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Service not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/services/:id — admin only
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
