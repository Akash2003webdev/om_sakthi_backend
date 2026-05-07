import express from "express";
import Enquiry from "../models/Enquiry.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// POST /api/enquiries — public (submit enquiry from frontend)
router.post("/", async (req, res) => {
  try {
    const { name, phone, message, designId } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "name and phone required" });

    const enquiry = new Enquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: message?.trim() || "",
      design_id: designId || "General",
    });

    await enquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/enquiries — admin only
router.get("/", authMiddleware, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/enquiries/:id — admin only
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Enquiry not found" });
    res.json({ message: "Enquiry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
