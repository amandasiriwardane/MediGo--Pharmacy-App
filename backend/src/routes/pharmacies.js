const express = require("express");
const router = express.Router();
const { getAllPharmacies, addPharmacy } = require("../controllers/pharmacyController");

router.get("/", getAllPharmacies);
router.post("/", addPharmacy);

module.exports = router;
