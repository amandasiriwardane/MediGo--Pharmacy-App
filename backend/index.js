const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
//app.use("/api/pharmacies", require("./src/routes/pharmacies"));
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Pharmacy Delivery API is running',
    version: '1.0.0'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
