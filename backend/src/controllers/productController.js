const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all products (with filters and search)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      search, 
      category, 
      pharmacyId, 
      minPrice, 
      maxPrice,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search by name, description, or tags
    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (pharmacyId) {
      query.pharmacyId = pharmacyId;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['pricing.price'] = {};
      if (minPrice) query['pricing.price'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.price'].$lte = Number(maxPrice);
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('pharmacyId', 'pharmacyDetails.pharmacyName pharmacyDetails.address')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('pharmacyId', 'pharmacyDetails.pharmacyName pharmacyDetails.address pharmacyDetails.phone');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Pharmacy only)
// @route   POST /api/products
// @access  Private (Pharmacy)
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add pharmacy ID from logged in user
    req.body.pharmacyId = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Pharmacy only - own products)
// @route   PUT /api/products/:id
// @access  Private (Pharmacy)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Make sure user is product owner
    if (product.pharmacyId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Pharmacy only - own products)
// @route   DELETE /api/products/:id
// @access  Private (Pharmacy)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Make sure user is product owner
    if (product.pharmacyId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    // Soft delete - just mark as inactive
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pharmacy's own products
// @route   GET /api/products/my-products
// @access  Private (Pharmacy)
exports.getMyProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find({ pharmacyId: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments({ pharmacyId: req.user.id });

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private (Pharmacy)
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Make sure user is product owner
    if (product.pharmacyId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    product.stock.quantity = quantity;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};