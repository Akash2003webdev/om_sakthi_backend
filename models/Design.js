import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Custom ID like "WC-001"
    title: { type: String, required: true, trim: true },
    category: { type: String, ref: "Category", default: null },
    tag: { type: String, default: null },          // "New", "Trending", "Popular"
    image: { type: String, default: null },        // Main image URL
    images: { type: [String], default: [] },       // All images [main, img2, img3]
    description: { type: String, default: null },
    finish: { type: String, default: null },       // "Glossy / Matte"
    size: { type: String, default: null },         // "A4 / 5×7 inches"
    min_qty: { type: String, default: null },      // "50 pcs"
    delivery: { type: String, default: null },     // "3–5 business days"
  },
  {
    timestamps: true,
    _id: false, // Use custom string _id
  }
);

const Design = mongoose.model("Design", designSchema);
export default Design;
