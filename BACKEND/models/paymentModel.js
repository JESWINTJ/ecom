import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  buyerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPaid: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  platformCommission: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  payoutToSeller: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  status: {
    type: String,
    enum: ['initiated', 'completed', 'declined'],
    default: 'initiated',
  },
  method: {
    type: String,
    required: true,
  },
  txnId: {
    type: String,
    default: null,
  },
}, {
  timestamps: {
    createdAt: 'paidAt',
    updatedAt: 'updatedOn',
  }
});

// Convert Decimal128 fields to strings in JSON output
paymentSchema.set('toJSON', {
  transform: (_, ret) => {
    ['totalPaid', 'platformCommission', 'payoutToSeller'].forEach(field => {
      if (ret[field]) ret[field] = ret[field].toString();
    });
    return ret;
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
