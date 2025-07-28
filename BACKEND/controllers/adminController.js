import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import generateToken from '../utils/generateToken.js';

/*===============================================
=               ADMIN AUTHENTICATION            =
===============================================*/

// @desc    Register admin account
// @route   POST /api/admin/register
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  // Validation
  if (!name || !email || !phone || !password || !confirmPassword) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Admin with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: ['admin'],
  });

  res.status(201).json({
    message: 'Admin account created successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// @desc    Admin login
// @route   POST /api/admin/login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.role.includes('admin')) {
    res.status(403);
    throw new Error('Not authorized as admin');
  }

  const token = generateToken(user._id);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

/*===============================================
=               ADMIN PROFILE                   =
===============================================*/

// @desc    Get admin profile
// @route   GET /api/admin/profile
export const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user || !user.role.includes('admin')) {
    res.status(403);
    throw new Error('Access denied: Admin only');
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.role.includes('admin')) {
    res.status(403);
    throw new Error('Access denied: Admin only');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: 'Admin profile updated successfully',
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    },
  });
});

/*===============================================
=               ADMIN STATUS CHECK              =
===============================================*/

// @desc    Check if logged-in user is admin
// @route   GET /api/admin/status
export const checkAdminStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user || !user.role.includes('admin')) {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }

  res.status(200).json({
    isAdmin: true,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

/*===============================================
=           USER & SELLER MANAGEMENT            =
===============================================*/

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
});

// @desc    Get all sellers
// @route   GET /api/admin/sellers
export const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: { $in: ['seller'] } }).select('-password');
  res.status(200).json(sellers);
});

// @desc    Update user or seller info
// @route   PUT /api/admin/users/:id
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.phone = req.body.phone ?? user.phone;
  user.role = req.body.role ?? user.role;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
  });
});

// @desc    Delete a user or seller account
// @route   DELETE /api/admin/users/:id
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.status(200).json({ message: 'User account deleted successfully' });
});

/*===============================================
=                 ORDER MANAGEMENT              =
===============================================*/

// @desc    Get all orders placed in system
// @route   GET /api/admin/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('buyerRef', 'name email phone')
    .populate('seller_id', 'name email phone')
    .populate('deliveryTo', 'street city state country postalCode')
    .populate('billingTo', 'street city state country postalCode')
    .populate('items.product', 'name price images')
    .sort({ createdOn: -1 });

  res.status(200).json(orders);
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    'Placed', 'Packed', 'Shipped', 'In Transit', 
    'Delivered', 'Cancelled', 'Failed Delivery', 'Returned'
  ];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.currentStatus = status;
  
  // Update timestamps based on status
  if (status === 'Shipped') {
    order.dispatchedAt = new Date();
  } else if (status === 'Delivered') {
    order.completedAt = new Date();
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    message: 'Order status updated successfully',
    order: {
      _id: updatedOrder._id,
      currentStatus: updatedOrder.currentStatus,
      dispatchedAt: updatedOrder.dispatchedAt,
      completedAt: updatedOrder.completedAt
    }
  });
});

// @desc    Get order statistics
// @route   GET /api/admin/orders/stats
export const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$currentStatus',
        count: { $sum: 1 },
        totalValue: { 
          $sum: { 
            $add: [
              { $sum: { $map: {
                input: '$items',
                as: 'item',
                in: { $multiply: ['$$item.unitCost', '$$item.unitsOrdered'] }
              }}},
              '$extraCharges'
            ]
          }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const totalOrders = await Order.countDocuments();
  const totalRevenue = stats.reduce((sum, stat) => sum + stat.totalValue, 0);

  res.status(200).json({
    totalOrders,
    totalRevenue,
    statusStats: stats
  });
});