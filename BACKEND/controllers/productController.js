import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

/*=============================================
=               GET ALL PRODUCTS              =
=============================================*/
// @route   GET /api/products
export const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};

  const filter = {
    ...keyword,
    available: true,
  };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

/*=============================================
=             GET PRODUCT BY ID               =
=============================================*/
// @route   GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

/*=============================================
=               ADD NEW PRODUCT               =
=============================================*/
// @route   POST /api/products
export const addNewProduct = asyncHandler(async (req, res) => {
  const {
    name,
    details,
    category,
    amount,
    stock,
  } = req.body;

  if (!name || !details || !category || !amount || !stock) {
    res.status(400);
    throw new Error("All product fields are required");
  }

  const imageUrl = req.file?.path || '';

  const product = new Product({
    sellerRef: req.user._id,
    name,
    details,
    category,
    amount,
    stock,
    product_image: imageUrl,
  });

  const created = await product.save();
  res.status(201).json(created);
});

/*=============================================
=               UPDATE PRODUCT                =
=============================================*/
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    sellerRef: req.user._id
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found or not authorized");
  }

  const fieldsToUpdate = ['name', 'details', 'category', 'amount', 'stock'];
  fieldsToUpdate.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  if (req.file?.path) {
    product.product_image = req.file.path;
  }

  const updated = await product.save();
  res.status(200).json({
    message: "Product updated successfully",
    product: updated
  });
});

/*=============================================
=               REMOVE PRODUCT                =
=============================================*/
// @route   DELETE /api/products/:id
export const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.sellerRef.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
});
