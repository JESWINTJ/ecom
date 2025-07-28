import express from 'express';
import { protect } from '../middleware/authentication.js';
import { addNewAddress, getUserAddresses  } from '../controllers/addressController.js';

const router = express.Router();

router.post('/', protect, addNewAddress);
router.get('/', protect, getUserAddresses); 
export default router;
