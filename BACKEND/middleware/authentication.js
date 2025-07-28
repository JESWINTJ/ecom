import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

/**
 * Middleware to validate JWT and attach user data to request
 */
export const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('Authentication failed: Invalid user');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Token is invalid or expired');
  }
});

/**
 * Middleware to allow only sellers
 */
export const restrictToSeller = asyncHandler((req, res, next) => {
  if (req.user && req.user.role.includes('seller')) {
    return next();
  }

  res.status(403);
  throw new Error('Permission denied: Seller access only');
});

/**
 * Middleware to allow only admins
 */
export const restrictToAdmin = asyncHandler((req, res, next) => {
  if (req.user && req.user.role.includes('admin')) {
    return next();
  }

  res.status(403);
  throw new Error('Permission denied: Admin access only');
});
export const protect = authenticateUser;
export const adminOnly = restrictToAdmin;
export const sellerOnly = restrictToSeller;

