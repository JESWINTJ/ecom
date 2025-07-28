import express from 'express';
import {
  makeOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

import { protect, sellerOnly } from '../middleware/authentication.js';

const router = express.Router();

// Place a new order
router.post('/', protect, makeOrder);

// Buyer: Get my orders
router.get('/my', protect, getUserOrders);

// Seller: Get orders assigned to seller
router.get('/seller', protect, sellerOnly, getSellerOrders);

// Seller: Update order status (shipped or delivered)
router.put('/:id/status', protect, sellerOnly, updateOrderStatus);

export default router;
