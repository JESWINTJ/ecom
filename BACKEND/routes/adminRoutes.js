import express from 'express';
import {
  checkAdminStatus,
  getAllUsers,
  getAllSellers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllOrders,getAdminProfile,
  updateAdminProfile
} from '../controllers/adminController.js';

import { authenticateUser as protect } from '../middleware/authentication.js';
import { restrictToAdmin as adminOnly } from '../middleware/authentication.js';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Apply admin protection globally
router.use(protect, adminOnly);

/*===============================================
=              Admin Status Check              =
===============================================*/
// GET /api/admin/status
router.get('/status', checkAdminStatus);

/*===============================================
=              User Management                 =
===============================================*/
// GET /api/admin/users
router.get('/users', getAllUsers);

// PUT & DELETE /api/admin/users/:id
router
  .route('/users/:id')
  .put(updateUserByAdmin)
  .delete(deleteUserByAdmin);

/*===============================================
=              Seller Management               =
===============================================*/
// GET /api/admin/sellers
router.get('/sellers', getAllSellers);

/*===============================================
=              Order Management                =
===============================================*/
// GET /api/admin/orders
router.get('/orders', getAllOrders);
router.get('/profile', protect, adminOnly, getAdminProfile);
router.put('/profile', protect, adminOnly, updateAdminProfile);

export default router;
