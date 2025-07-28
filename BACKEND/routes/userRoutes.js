import express from 'express';
import {
  createBuyerAccount,
  authenticateUser,
  logOutUser,
  modifyUserProfile,
  removeUserAccount,
  verifyUserStatus
} from '../controllers/userController.js';

import { authenticateUser as protect } from '../middleware/authentication.js';

const router = express.Router();

// Register & Login
router.post('/register', createBuyerAccount);
router.post('/login', authenticateUser);
router.post('/logout', logOutUser);  // <-- Added this line

// Profile: Get, Update, Delete
router
  .route('/profile')
  .get(protect, verifyUserStatus)
  .put(protect, modifyUserProfile)
  .delete(protect, removeUserAccount);

export default router;