// src/controllers/orderController.js
const Order = require("../models/Order");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, pharmacyId, items, totalPrice } = req.body;

    const newOrder = new Order({
      userId,
      pharmacyId,
      items,
      totalPrice
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .populate("pharmacyId", "name address")
      .populate("items.productId", "name price")
      .populate("driverId", "name email phone");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, driverId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status) order.status = status;
    if (driverId) order.driverId = driverId;

    const updatedOrder = await order.save();
    res.status(200).json({ message: "Order updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate("pharmacyId", "name address")
      .populate("items.productId", "name price")
      .populate("driverId", "name email phone");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
