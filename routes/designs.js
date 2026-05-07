import express from "express";
import Design from "../models/Design.js";
import authMiddleware from "../middleware/auth.js";
import { upload, cloudinary } from "../config/cloudinary.js";

const router = express.Router();

// ─── PUBLIC ROUTES ───────────────────────────────────────────

// GET /api/designs — fetch all designs
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const designs = await Design.find(filter).sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/designs/:id — fetch single design
router.get("/:id", async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: "Design not found" });
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADMIN ROUTES (protected) ─────────────────────────────────

// POST /api/designs — create design
// Form fields: id, title, category, tag, description, finish, size, min_qty, delivery
// File fields: image, img2, img3 (optional)
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "img3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id, title, category, tag, description, finish, size, min_qty, delivery } = req.body;

      if (!id || !title) {
        return res.status(400).json({ error: "id and title are required" });
      }

      // Collect uploaded image URLs
      const mainImg = req.files?.image?.[0]?.path || req.body.imageUrl || null;
      const img2 = req.files?.img2?.[0]?.path || req.body.img2Url || null;
      const img3 = req.files?.img3?.[0]?.path || req.body.img3Url || null;

      const imagesArr = [mainImg, img2, img3].filter(Boolean);

      const design = new Design({
        _id: id.trim().toUpperCase(),
        title: title.trim(),
        category: category || null,
        tag: tag || null,
        image: mainImg,
        images: imagesArr,
        description: description || null,
        finish: finish || null,
        size: size || null,
        min_qty: min_qty || null,
        delivery: delivery || null,
      });

      await design.save();
      res.status(201).json(design);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Design ID already exists" });
      }
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/designs/:id — update design
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "img3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const existing = await Design.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Design not found" });

      const { title, category, tag, description, finish, size, min_qty, delivery } = req.body;

      // Use newly uploaded images OR keep existing ones
      const mainImg = req.files?.image?.[0]?.path || req.body.imageUrl || existing.image;
      const img2 = req.files?.img2?.[0]?.path || req.body.img2Url || existing.images?.[1] || null;
      const img3 = req.files?.img3?.[0]?.path || req.body.img3Url || existing.images?.[2] || null;

      const imagesArr = [mainImg, img2, img3].filter(Boolean);

      const updated = await Design.findByIdAndUpdate(
        req.params.id,
        {
          title: title?.trim() || existing.title,
          category: category ?? existing.category,
          tag: tag ?? existing.tag,
          image: mainImg,
          images: imagesArr,
          description: description ?? existing.description,
          finish: finish ?? existing.finish,
          size: size ?? existing.size,
          min_qty: min_qty ?? existing.min_qty,
          delivery: delivery ?? existing.delivery,
        },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/designs/:id — delete design
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    if (!design) return res.status(404).json({ error: "Design not found" });

    // Optional: delete images from Cloudinary
    const allImages = design.images?.filter(Boolean) || [];
    for (const imgUrl of allImages) {
      try {
        const publicId = imgUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`om-sakthi-designs/${publicId}`);
      } catch (_) {}
    }

    res.json({ message: "Design deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/designs/upload-image — standalone image upload
router.post("/upload-image", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: req.file.path });
});

export default router;
