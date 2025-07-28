// models/addressModel.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
}, {
  timestamps: true
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
