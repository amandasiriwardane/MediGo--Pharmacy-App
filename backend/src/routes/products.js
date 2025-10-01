const express = require("express");
const router = express.Router();
const { getAllProducts, getProductsByPharmacy, addProduct } = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/pharmacy/:pharmacyId", getProductsByPharmacy);
router.post("/", addProduct);

module.exports = router;
