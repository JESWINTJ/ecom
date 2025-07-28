import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';

/*==========================================
=        Create or Update a Review         =
==========================================*/
// @route   POST /api/reviews/:productId
// @route   POST /api/reviews/:productId
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { stars, comments } = req.body;
  const { productId } = req.params;

  if (!stars || stars < 1 || stars > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5 stars');
  }

  const review = await Review.create({
    userId: req.user._id,
    productId,
    author: req.user._id,
    product: productId,
    stars,
    comments,
  });

  res.status(201).json({ message: 'Review added', review });
});

/*==========================================
=            Get Reviews for Product       =
==========================================*/
// @route   GET /api/reviews/:productId
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId })
    .populate('author', 'name email')
    .sort({ reviewedOn: -1 });

  res.status(200).json(reviews);
});

/*==========================================
=            Delete Review (Optional)      =
==========================================*/
// @route   DELETE /api/reviews/:reviewId
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();
  res.status(200).json({ message: 'Review deleted' });
});
