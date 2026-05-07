import express from "express";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET /api/categories — public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ label: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories — admin only
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { id, label } = req.body;
    if (!id || !label) return res.status(400).json({ error: "id and label required" });

    const slugId = id.trim().toLowerCase().replace(/\s+/g, "-");
    const category = new Category({ _id: slugId, label: label.trim() });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: "Category ID already exists" });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/categories/:id — admin only (label only, id is immutable)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { label } = req.body;
    if (!label) return res.status(400).json({ error: "label required" });

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { label: label.trim() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categories/:id — admin only
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
