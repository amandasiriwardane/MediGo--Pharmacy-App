const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getAllOrders, createOrder, updateOrderStatus, getOrdersByUser } = require("../controllers/orderController");

router.get("/", verifyToken, getAllOrders);
router.post("/", verifyToken, createOrder);
router.put("/:orderId", verifyToken, updateOrderStatus);
router.get("/user/:userId", verifyToken, getOrdersByUser);

module.exports = router;
