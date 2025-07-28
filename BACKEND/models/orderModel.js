import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  unitsOrdered: {
    type: Number,
    required: true,
    min: 1
  },
  unitCost: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: Number,
    default: 0
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  buyerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming a unified User model
    required: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Seller' if you use a separate model
    required: true
  },
  deliveryTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  billingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  extraCharges: {
    type: Number,
    default: 0
  },
  placedAt: {
    type: Date,
    default: Date.now
  },
  dispatchedAt: Date,
  completedAt: Date,
  currentStatus: {
    type: String,
    enum: [
      'Placed',
      'Packed',
      'Shipped',
      'In Transit',
      'Delivered',
      'Cancelled',
      'Failed Delivery',
      'Returned'
    ],
    default: 'Placed'
  }
}, {
  timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'lastUpdated'
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
