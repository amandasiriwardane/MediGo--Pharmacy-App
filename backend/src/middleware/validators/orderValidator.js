const { body, param } = require("express-validator");
const mongoose = require("mongoose");

exports.createOrderValidation = [
  body("userId")
    .notEmpty().withMessage("userId is required")
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid userId"),
  body("pharmacyId")
    .notEmpty().withMessage("pharmacyId is required")
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid pharmacyId"),
  body("items")
    .isArray({ min: 1 }).withMessage("Items must be an array with at least one item"),
  body("items.*.productId")
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid productId"),
  body("items.*.quantity")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("totalPrice")
    .isFloat({ gt: 0 }).withMessage("Total price must be greater than 0")
];

exports.updateOrderValidation = [
  param("orderId")
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid orderId"),
  body("status")
    .optional()
    .isIn(["pending", "confirmed", "on-the-way", "delivered"])
    .withMessage("Invalid status"),
  body("driverId")
    .optional()
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid driverId")
];
