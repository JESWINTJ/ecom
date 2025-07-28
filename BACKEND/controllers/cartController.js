import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

/*===============================================
=        Fetch All Items in User's Cart         =
===============================================*/
// @route   GET /api/cart
export const viewUserCart = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id)
    .populate({
      path: 'cart.product',
      populate: {
        path: 'sellerRef',
        select: 'name email'
      }
    });

  if (!currentUser) {
    res.status(404);
    throw new Error('Unable to locate user');
  }

  res.status(200).json(currentUser.cart);
});

/*===============================================
=        Add New Item or Update Quantity        =
===============================================*/
// @route   POST /api/cart
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!product || !product.available) {
    res.status(404);
    throw new Error('Product not found or unavailable');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock for this product');
  }

  // Optional: Prevent adding products from different sellers
  const hasDifferentSeller = await Promise.all(
    user.cart.map(async (item) => {
      const existingProduct = await Product.findById(item.product);
      return existingProduct?.sellerRef.toString() !== product.sellerRef.toString();
    })
  );

  if (hasDifferentSeller.includes(true)) {
    res.status(400);
    throw new Error('Cart already contains products from another seller');
  }

  // Add or update item
  const itemAlreadyInCart = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (itemAlreadyInCart) {
    itemAlreadyInCart.quantity += Number(quantity);
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  res.status(201).json({ message: 'Product added to cart', cart: user.cart });
});

/*=======================================================
=     Modify Quantity of a Specific Product in Cart     =
=======================================================*/
// @route   PUT /api/cart/:productId
export const modifyCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be a positive number');
  }

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!product || !product.available) {
    res.status(404);
    throw new Error('Product not found or unavailable');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock for this product');
  }

  const cartItem = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (!cartItem) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  cartItem.quantity = quantity;
  await user.save();

  res.status(200).json({ message: 'Item quantity updated', cart: user.cart });
});

/*===============================================
=        Delete One Product from User Cart       =
===============================================*/
// @route   DELETE /api/cart/:productId
export const deleteCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter(
    (item) => item.product.toString() !== productId
  );

  await user.save();
  res.status(200).json({ message: 'Item removed', cart: user.cart });
});

/*===============================================
=              Clear User's Cart                =
===============================================*/
// @route   DELETE /api/cart
export const emptyCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.status(200).json({ message: 'Your cart is now empty' });
});
