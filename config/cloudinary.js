import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Step 1: Config call
cloudinary.config({
  cloud_name: "dlscqt1du", // 'DL' remove panniyaachu, check dashboard
  api_key: "546618984616887",
  api_secret: "XadG6WQvetorSu80OV6TIZ2k2Io",
});

// Step 2: Storage setup
// Inga direct-ah 'cloudinary' use pannunga
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "om-sakthi-designs",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Step 3: Multer middleware
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export { cloudinary };
