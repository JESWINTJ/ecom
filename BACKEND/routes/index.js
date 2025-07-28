import express from 'express';

// Modular route imports with unique identifiers
import userAuthRoutes from './userRoutes.js';
import sellerPortalRoutes from './sellerRoutes.js';
import adminControlRoutes from './adminRoutes.js';
import orderServiceRoutes from './orderRoutes.js';
import cartFeatureRoutes from './cartRoutes.js';
import productCatalogRoutes from './productRoutes.js';
import adminAuthRoutes from './adminRoutes.js';
import addressRoutes from './addressRoutes.js'; // ✅ Add this line
import reviewRoutes from './reviewRoute.js';
const mainApiRouter = express.Router();

mainApiRouter.use('/admin/auth', adminAuthRoutes);
mainApiRouter.use('/addresses', addressRoutes); // ✅ Keep structure modular
mainApiRouter.use('/api/reviews', reviewRoutes);
/* ---------------------- USER & AUTH ---------------------- */
// Handles registration, login, profile, and address management
mainApiRouter.use('/users', userAuthRoutes);

/* ---------------------- SELLER PANEL --------------------- */
// Seller registration and operations
mainApiRouter.use('/sellers', sellerPortalRoutes);

/* ---------------------- ADMIN PANEL ---------------------- */
// Admin tools for managing users, sellers, and system data
mainApiRouter.use('/admin', adminControlRoutes);

/* ---------------------- ORDER SYSTEM --------------------- */
// Place orders, view order history, manage order status
mainApiRouter.use('/orders', orderServiceRoutes);

/* ---------------------- SHOPPING CART -------------------- */
// Add, update, delete, and view cart items
mainApiRouter.use('/cart', cartFeatureRoutes);

/* ---------------------- PRODUCT CATALOG ------------------ */
// Product browsing, listing, and details
mainApiRouter.use('/products', productCatalogRoutes);

export default mainApiRouter;
