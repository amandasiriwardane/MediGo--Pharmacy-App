const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    // Verify all products exist and have enough stock
    let subtotal = 0;
    let pharmacyId = null;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.productId}` 
        });
      }

      if (!product.isActive) {
        return res.status(400).json({ 
          message: `Product is not available: ${product.name}` 
        });
      }

      if (product.stock.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock.quantity}` 
        });
      }

      // All items must be from same pharmacy
      if (!pharmacyId) {
        pharmacyId = product.pharmacyId;
      } else if (pharmacyId.toString() !== product.pharmacyId.toString()) {
        return res.status(400).json({ 
          message: 'All items must be from the same pharmacy' 
        });
      }

      const itemPrice = product.pricing.discountPrice || product.pricing.price;
      subtotal += itemPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: itemPrice,
        requiresPrescription: product.requiresPrescription,
        prescriptionUrl: item.prescriptionUrl
      });
    }

    // Calculate delivery fee (simple calculation, can be enhanced)
    const deliveryFee = 50; // Fixed for now
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryFee + tax;

    // Get pharmacy address
    const pharmacy = await User.findById(pharmacyId);
    const pharmacyAddress = {
      fullAddress: pharmacy.pharmacyDetails.address.fullAddress,
      latitude: pharmacy.pharmacyDetails.address.latitude,
      longitude: pharmacy.pharmacyDetails.address.longitude
    };

    // Create order
    const order = await Order.create({
      customerId: req.user.id,
      pharmacyId,
      items: orderItems,
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        total
      },
      deliveryAddress,
      pharmacyAddress,
      paymentMethod,
      specialInstructions,
      estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });

    // Reduce product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 'stock.quantity': -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (filtered by role)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filter based on user role
    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.role === 'pharmacy') {
      query.pharmacyId = req.user.id;
    } else if (req.user.role === 'driver') {
      query.driverId = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'fullName email phone')
      .populate('pharmacyId', 'pharmacyDetails.pharmacyName')
      .populate('driverId', 'fullName phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'fullName email phone')
      .populate('pharmacyId', 'pharmacyDetails.pharmacyName pharmacyDetails.address')
      .populate('driverId', 'fullName phone driverDetails.vehicleType driverDetails.vehicleNumber')
      .populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    const hasAccess = 
      order.customerId._id.toString() === req.user.id ||
      order.pharmacyId._id.toString() === req.user.id ||
      (order.driverId && order.driverId._id.toString() === req.user.id) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Role-based status update permissions
    const allowedTransitions = {
      pharmacy: ['confirmed', 'preparing', 'ready-for-pickup', 'cancelled'],
      driver: ['picked-up', 'out-for-delivery', 'delivered'],
      customer: ['cancelled']
    };

    if (!allowedTransitions[req.user.role]?.includes(status)) {
      return res.status(403).json({ 
        message: `${req.user.role} cannot update status to ${status}` 
      });
    }

    // Additional authorization checks
    if (req.user.role === 'pharmacy' && order.pharmacyId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'driver' && order.driverId?.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'customer' && order.customerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    order.status = status;

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = 'completed';
    }

    if (status === 'cancelled') {
      order.cancelledBy = req.user.role;
      order.cancellationReason = note;

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { 'stock.quantity': item.quantity }
        });
      }
    }

    await order.save();

    // Add note to the latest status history entry after save
    if (note) {
      order.statusHistory[order.statusHistory.length - 1].note = note;
      await order.save();
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign driver to order
// @route   PUT /api/orders/:id/assign-driver
// @access  Private (Pharmacy or Driver)
exports.assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only pharmacy can assign or driver can self-assign
    if (req.user.role === 'pharmacy') {
      if (order.pharmacyId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    } else if (req.user.role === 'driver') {
      if (driverId !== req.user.id) {
        return res.status(401).json({ message: 'Can only assign yourself' });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if driver exists and is approved
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (!driver.driverDetails.isApproved) {
      return res.status(400).json({ message: 'Driver is not approved' });
    }

    order.driverId = driverId;
    order.status = 'assigned';
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available orders for drivers
// @route   GET /api/orders/available
// @access  Private (Driver)
exports.getAvailableOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: 'ready-for-pickup',
      driverId: { $exists: false }
    })
      .populate('pharmacyId', 'pharmacyDetails.pharmacyName pharmacyDetails.address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && order.customerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'pharmacy' && order.pharmacyId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Can't cancel delivered orders
    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    order.status = 'cancelled';
    order.cancelledBy = req.user.role;
    order.cancellationReason = reason;

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 'stock.quantity': item.quantity }
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};