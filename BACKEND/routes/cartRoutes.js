import express from 'express';
import {
  viewUserCart,
  addItemToCart,
  modifyCartItemQuantity,
  deleteCartItem,
  emptyCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authentication.js';

const router = express.Router();

/*===========================================
=        User Cart Operations (Secure)      =
===========================================*/
// Endpoint prefix: /api/cart

// Handle full cart operations: fetch, add, and clear
router
  .route('/')
  .get(protect, viewUserCart)           // Get current user's cart
  .post(protect, addItemToCart)         // Add product to cart
  .delete(protect, emptyCart);          // Remove all items from cart

// Handle operations for a specific product in cart
router
  .route('/:productId')
  .put(protect, modifyCartItemQuantity) // Change quantity of a specific item
  .delete(protect, deleteCartItem);     // Remove a specific item from cart

export default router;
