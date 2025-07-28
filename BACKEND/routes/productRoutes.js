import express from 'express';
import {
  getAllProducts,
  getProductById,
  addNewProduct,
  updateProduct,
  removeProduct
} from '../controllers/productController.js';

import multer from 'multer';
import { protect, sellerOnly } from '../middleware/authentication.js';
import { productImageStorage } from '../configs/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: productImageStorage });

/*============================================
=              Public Routes                 =
============================================*/
// GET /api/products/
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

/*============================================
=       Seller Product Management Routes     =
============================================*/
// POST /api/products/
router.post(
  '/',
  protect,
  sellerOnly,
  upload.single('product_image'), // ✅ use .single, not .array
  addNewProduct
);

// PUT /api/products/:id
router.put(
  '/:id',
  protect,
  sellerOnly,
  upload.single('product_image'), // ✅ required for req.file
  updateProduct
);

// DELETE /api/products/:id
router.delete('/:id', protect, sellerOnly, removeProduct);

export default router;
