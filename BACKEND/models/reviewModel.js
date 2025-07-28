import mongoose from 'mongoose';

const productReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  comments: {
    type: String,
    trim: true,
  }
}, {
  timestamps: {
    createdAt: 'reviewedOn',
    updatedAt: 'lastEdited'
  }
});

const Review = mongoose.model('Review', productReviewSchema);
export default Review;
