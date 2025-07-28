import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

/* --------------------- Address Schema --------------------- */
const addressSchema = new mongoose.Schema({
  house: String,
  street: String,
  city: String,
  postOffice: String,
  district: String,
  country: {
    type: String,
    default: 'India',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  landmark: String,
}, { _id: false });

/* ------------------ Seller Profile Schema ----------------- */
const sellerInfoSchema = new mongoose.Schema({
  
  gstNumber: {
    type: String,
    required: true,
  },
}, { _id: false });

/* --------------------- Cart Item Schema ------------------- */
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
}, { _id: false });

/* ------------------------ Main User Schema ----------------------- */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    enum: ['buyer', 'seller', 'admin'],
    default: ['buyer'],
  },
  deliveryAddress: [addressSchema],
  cart: [cartItemSchema],
  sellerProfile: sellerInfoSchema,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

/* ---------------- Password Encryption Hook ---------------- */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ------------------ Password Compare Method ------------------ */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/* ------------------ Reset Token Generator ------------------ */
userSchema.methods.getResetPasswordToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min

  return rawToken;
};

const User = mongoose.model('User', userSchema);
export default User;
