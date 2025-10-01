const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");  

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

app.get("/", (req, res) => {
    res.send("Pharmacy API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// Define routes
app.use("/api/pharmacies", require("./src/routes/pharmacies"));
app.use("/api/products", require("./src/routes/products"));
app.use("/api/orders", require("./src/routes/orders"));
app.use("/api/auth", require("./src/routes/auth"));
