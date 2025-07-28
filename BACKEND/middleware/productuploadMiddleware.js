// middleware/uploadMiddleware.js
import multer from 'multer';
import { productImageStorage } from '../configs/cloudinary.js';

const productUpload = multer({ storage: productImageStorage });

export default productUpload;
