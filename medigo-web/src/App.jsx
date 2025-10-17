import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import RoleRoute from './components/common/RoleRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';

import Cart from './pages/customer/Cart';


const PharmacyDashboard = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>Pharmacy Dashboard - Coming in Phase 3</h1>
  </Box>
);

const DriverDashboard = () => (
  <Box sx={{ minHeight: '70vh', p: 4 }}>
    <h1>Driver Dashboard - Coming in Phase 4</h1>
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
          <Route path="/products/:id" element={<ProductDetail />} />

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
            path="/checkout"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['customer']}>
                  <Checkout />
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