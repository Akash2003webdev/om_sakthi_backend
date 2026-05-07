import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String }, // slug like "wedding-cards"
    label: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    _id: false,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
