import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sellerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  details: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true,
    index: true
  },

  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },

  stock: {
    type: Number,
    required: true,
    default: 0
  },

  available: {
    type: Boolean,
    default: true
  },

  product_image: {
    type: String,
    required: false
  }

}, {
  timestamps: {
    createdAt: 'addedAt',
    updatedAt: 'modifiedAt'
  }
});

// Ensure Decimal128 (amount) is shown properly in JSON
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.amount) ret.amount = ret.amount.toString();
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
