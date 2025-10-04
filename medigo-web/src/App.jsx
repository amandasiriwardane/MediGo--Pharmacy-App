import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import RoleRoute from './components/common/RoleRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Temporary placeholder components for testing
const Home = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>Home Page - Coming Soon</h1>
    <p>Product listings will appear here</p>
  </Box>
);

const Products = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>Products Page - Coming Soon</h1>
    <p>Browse all products with search and filters</p>
  </Box>
);

const Cart = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>Cart Page - Coming Soon</h1>
    <p>Your shopping cart items will appear here</p>
  </Box>
);

const MyOrders = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>My Orders - Coming Soon</h1>
    <p>Track your order history and status</p>
  </Box>
);

const PharmacyDashboard = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>Pharmacy Dashboard - Coming Soon</h1>
    <p>Manage your products and incoming orders</p>
  </Box>
);

const DriverDashboard = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>Driver Dashboard - Coming Soon</h1>
    <p>View available deliveries and manage your routes</p>
  </Box>
);

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />

          {/* Customer Routes */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['customer']}>
                  <Cart />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['customer']}>
                  <MyOrders />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Pharmacy Routes */}
          <Route
            path="/pharmacy/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['pharmacy']}>
                  <PharmacyDashboard />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Driver Routes */}
          <Route
            path="/driver/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;