import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import { Add, Inventory, ShoppingBag } from '@mui/icons-material';
import { getMyProducts } from '../../redux/slices/productSlice';
import { getOrders } from '../../redux/slices/orderSlice';
import PharmacyStats from '../../components/pharmacy/PharmacyStats';
import Loader from '../../components/common/Loader';

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, isLoading: productsLoading } = useSelector((state) => state.products);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.orders);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getMyProducts({}));
    dispatch(getOrders({}));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate stats
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => 
      ['pending', 'confirmed', 'preparing'].includes(o.status)
    ).length,
    totalRevenue: orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.pricing?.total || 0), 0)
  };

  if (productsLoading || ordersLoading) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Pharmacy Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/pharmacy/products')}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      <PharmacyStats stats={stats} />

      <Paper sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Inventory />} label="Products" iconPosition="start" />
          <Tab icon={<ShoppingBag />} label="Orders" iconPosition="start" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <Box>
            <Button
              variant="contained"
              onClick={() => navigate('/pharmacy/products')}
              fullWidth
              sx={{ py: 2 }}
            >
              Manage Products
            </Button>
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            <Button
              variant="contained"
              onClick={() => navigate('/pharmacy/orders')}
              fullWidth
              sx={{ py: 2 }}
            >
              Manage Orders
            </Button>
          </Box>
        )}
      </Box>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Summary
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph>
            • You have {products.length} products in your inventory
          </Typography>
          <Typography variant="body1" paragraph>
            • {stats.pendingOrders} orders need your attention
          </Typography>
          <Typography variant="body1" paragraph>
            • Total revenue: Rs {stats.totalRevenue.toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PharmacyDashboard;
