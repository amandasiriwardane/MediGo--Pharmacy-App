// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: "Pharmacy", required: true },
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
