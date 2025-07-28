import express from 'express';
import {
  registerSeller,
  checkSeller,
  viewSellerProfile,
  getSellerProducts,
  addNewProduct,
  updateProduct,
  getSellerOrders,updateSellerProfile
} from '../controllers/sellerController.js';


import multer from 'multer';
import { authenticateUser as protect } from '../middleware/authentication.js';
import productUpload from '../middleware/productuploadMiddleware.js'; // ✅ Import upload middleware
import { productImageStorage } from '../configs/cloudinary.js';
const upload = multer({ storage: productImageStorage });
const router = express.Router();

router.post('/register', registerSeller);
router.get('/check', protect, checkSeller);
router.get('/products', protect, getSellerProducts);

// ✅ Add image upload middleware for product POST route
router.post(
  '/products',
  protect,
  productUpload.single('product_image'),
  addNewProduct
);

router.put('/products/:id', protect, updateProduct);
router.get('/orders', protect, getSellerOrders);

router
  .route('/profile')
  .get(protect, viewSellerProfile)
  .put(protect, updateSellerProfile);
// Update route
router.put('/products/:id', protect, upload.single('product_image'), updateProduct);
export default router;