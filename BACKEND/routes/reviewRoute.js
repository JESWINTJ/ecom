import express from 'express';
import {
  createReview,
  getProductReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authentication.js';

const router = express.Router();

// ✅ Create a review (only buyers)
router.post('/:productId', protect, createReview);

// ✅ Get all reviews for a specific product
router.get('/:productId', getProductReviews);

// ✅ Delete a review (only the one who created it or admin)
router.delete('/delete/:reviewId', protect, deleteReview);

export default router;
