import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    design_id: { type: String, default: "General" },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
