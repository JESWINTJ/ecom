import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

/*===============================================
=          1. Register New Seller               =
===============================================*/
export const registerSeller = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    confirmPassword,
    gstNumber,
    address, // Object with address info
  } = req.body;

  if (
    !name || !email || !phone || !password ||
    !confirmPassword || !gstNumber || !address
  ) {
    res.status(400);
    throw new Error('All required fields must be filled');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with given email or phone');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role:'seller',
    sellerProfile: {
      gstNumber,
      address,
      isVerified: false
    }
  });

  res.status(201).json({
    message: 'Seller account created',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      sellerProfile: user.sellerProfile
    }
  });
});

/*===============================================
=          2. Check Seller Status               =
===============================================*/
export const checkSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user || !user.role.includes('seller')) {
    res.status(403);
    throw new Error("User is not a seller");
  }

  res.status(200).json({
    isSeller: true,
    isVerified: user.sellerProfile?.isVerified || false,
    gstNumber: user.sellerProfile?.gstNumber || null
  });
});

/*===============================================
=          3. View Seller Profile               =
===============================================*/
export const viewSellerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user || !user.role.includes('seller')) {
    res.status(403);
    throw new Error("Access denied");
  }

  const sellerProfile = user.sellerProfile || {};
  const gstNumber = sellerProfile.gstNumber || '';
  const isVerified = sellerProfile.isVerified || false;
  const address = sellerProfile.address || {};

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    gstNumber,
    isVerified,
    address: {
      street: address.street || '',
      city: address.city || '',
      pincode: address.pincode || ''
    },
    createdAt: user.createdAt
  });
});



/*===============================================
=          4. Get Seller Products               =
===============================================*/
export const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller_id: req.user._id });
  res.status(200).json(products);
});

/*===============================================
=          5. Add New Product                   =
===============================================*/
export const addNewProduct = asyncHandler(async (req, res) => {
  const { 
    name,
    details,
    category,
    amount,
    stock
  } = req.body; // These will come from form-data text fields

  const product_image = req.file; // Multer will handle the file upload

  if (!name || !details || !category || !amount || !stock || !product_image) {
    res.status(400);
    throw new Error("All product fields are required");
  }

  const product = await Product.create({
    sellerRef: req.user._id,
    name,
    details,
    category,
    amount: parseFloat(amount), // Ensure number type
    stock: parseInt(stock), // Ensure integer type
    product_image: product_image.path, // Save the path where multer stored the file
  });

  res.status(201).json({ message: "Product added successfully", product });
});



/*===============================================
=          6. Update Product                    =
===============================================*/
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    sellerRef: req.user._id
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found or not authorized");
  }

  // Update fields based on your schema
  const fieldsToUpdate = ['name', 'details', 'category', 'amount', 'stock'];
  fieldsToUpdate.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  // Update image if file was uploaded
  if (req.file?.path) {
    product.product_image = req.file.path;
  }

  const updated = await product.save();

  res.status(200).json({
    message: "Product updated successfully",
    product: updated
  });
});


/*===============================================
=          7. Get Seller Orders                 =
===============================================*/
export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller_id: req.user._id })
    .populate('user_id', 'name email')
    .populate('items.product_id', 'product_name');

  res.status(200).json(orders);
});

export const updateSellerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.role.includes('seller')) {
    res.status(403);
    throw new Error("Access denied: Not a seller");
  }

  // Update basic fields
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  // Update seller profile fields
  if (req.body.gstNumber) {
    user.sellerProfile.gstNumber = req.body.gstNumber;
  }

  if (req.body.address) {
    user.sellerProfile.address = {
      ...user.sellerProfile.address,
      ...req.body.address // street, city, pincode
    };
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Seller profile updated",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      sellerProfile: updatedUser.sellerProfile
    }
  });
});

