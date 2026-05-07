import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    icon: { type: String, default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    highlight: { type: String, default: null }, // "Most Popular / Fast / New"
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
