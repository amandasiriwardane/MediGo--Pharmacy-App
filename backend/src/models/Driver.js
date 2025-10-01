// models/Driver.js
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vehicle: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);
