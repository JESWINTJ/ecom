import asyncHandler from 'express-async-handler';
import Address from '../models/addressModel.js';

// POST /api/addresses
export const addNewAddress = asyncHandler(async (req, res) => {
  const { street, city, pincode } = req.body;

  if (!street || !city || !pincode) {
    res.status(400);
    throw new Error('All address fields are required');
  }

  const address = await Address.create({
    userRef: req.user._id,
    street,
    city,
    pincode
  });

  res.status(201).json(address);
});


// GET /api/addresses
export const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userRef: req.user._id });

  res.status(200).json(addresses);
});