const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getAllOrders, createOrder, updateOrderStatus, getOrdersByUser } = require("../controllers/orderController");
const { createOrderValidation, updateOrderValidation } = require("../middleware/validators/orderValidator");
const { validateRequest } = require("../middleware/validators/validateRequest");


router.get("/", verifyToken, getAllOrders);
router.post("/", verifyToken, createOrderValidation, validateRequest, createOrder);
router.put("/:orderId", verifyToken, updateOrderValidation, validateRequest, updateOrderStatus);
router.get("/user/:userId", verifyToken, getOrdersByUser);

module.exports = router;
