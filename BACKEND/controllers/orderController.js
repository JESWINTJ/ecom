import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

/* ========================
   MAKE ORDER
   POST /api/orders
   ======================== */
export const makeOrder = asyncHandler(async (req, res) => {
  const { items, deliveryTo, billingTo } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  if (!deliveryTo || !billingTo) {
    res.status(400);
    throw new Error('Billing and Delivery address are required');
  }

  const createdItems = [];
  let totalAmount = 0;
  let sellerId = null;

  for (const [index, item] of items.entries()) {
    const product = await Product.findById(item.product);

    if (!product || !product.available) {
      res.status(404);
      throw new Error(`Product not found or unavailable: ${item.product}`);
    }

    if (product.stock < item.unitsOrdered) {
      res.status(400);
      throw new Error(`Insufficient stock for: ${product.name}`);
    }

    // ✅ Enforce one seller per order
    if (index === 0) {
      sellerId = product.sellerRef;
    } else if (product.sellerRef.toString() !== sellerId.toString()) {
      res.status(400);
      throw new Error('All items in an order must belong to the same seller');
    }

    // Update stock
    product.stock -= item.unitsOrdered;
    await product.save();

    const unitCost = parseFloat(product.amount.toString());

    createdItems.push({
      product: product._id,
      unitsOrdered: item.unitsOrdered,
      unitCost,
      discountApplied: item.discountApplied || 0
    });

    totalAmount += unitCost * item.unitsOrdered;
  }

  const order = await Order.create({
    buyerRef: req.user._id,
    seller_id: sellerId,
    billingTo,
    deliveryTo,
    items: createdItems,
    extraCharges: 0,
    currentStatus: 'Placed'
  });

  res.status(201).json({
    message: 'Order placed successfully',
    order,
    totalAmount,
  });
});




/* ========================
   GET BUYER'S ORDERS
   GET /api/orders/my
   ======================== */
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerRef: req.user._id })
    .sort({ createdOn: -1 })
    .populate('items.product', 'name amount product_image'); // 👈 show only selected fields

  res.status(200).json(orders);
});



/* ========================
   GET SELLER'S ORDERS
   GET /api/orders/seller
   ======================== */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'items.product': { $exists: true } })
    .where('items')
    .elemMatch({}) // Just ensures we have items
    .populate('items.product', 'name amount product_image')
    .populate('buyerRef', 'name email') // optional: buyer info
    .populate('deliveryTo billingTo', 'street city pincode') // optional: address info
    .sort({ createdOn: -1 });

  res.status(200).json(orders);
});



/* ========================
   UPDATE ORDER STATUS
   PUT /api/orders/:id/status
   ======================== */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Capitalize input status to match enum (e.g., "shipped" → "Shipped")
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const normalizedStatus = capitalize(status);

  // Only allow updates to these statuses via this endpoint
  const validStatuses = ['Shipped', 'Delivered'];

  if (!validStatuses.includes(normalizedStatus)) {
    res.status(400);
    throw new Error('Invalid status. Allowed: Shipped, Delivered');
  }

  const order = await Order.findById(req.params.id);

  if (!order || !order.seller_id || !req.user || !req.user._id) {
    res.status(404);
    throw new Error('Order not found or unauthorized');
  }

  if (order.seller_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Unauthorized seller access');
  }

  if (order.currentStatus === normalizedStatus) {
    return res.status(200).json({ message: `Order is already ${normalizedStatus}` });
  }

  order.currentStatus = normalizedStatus;
  await order.save();

  res.status(200).json({ message: `Order marked as ${normalizedStatus}` });
});

