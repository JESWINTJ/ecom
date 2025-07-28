// configs/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedFormats = ['jpg', 'png', 'jpeg', 'webp'];

export const productImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const name = req.body.product_name || 'product';
    const safeName = name.trim().replace(/\s+/g, '_');
    return {
      folder: `ecommerce/products/${safeName}`,
      allowedFormats, // ✅ fixed key name
      public_id: `${safeName}_${Date.now()}`,
    };
  },
});

export { cloudinary };
