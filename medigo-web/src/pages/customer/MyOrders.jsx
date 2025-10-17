import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { getOrders } from '../../redux/slices/orderSlice';
import OrderCard from '../../components/customer/OrderCard';
import Loader from '../../components/common/Loader';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    dispatch(getOrders({}));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    if (status === 'active') {
      return orders.filter(order => 
        !['delivered', 'cancelled'].includes(order.status)
      );
    }
    return orders.filter(order => order.status === status);
  };

  const tabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  const filteredOrders = filterOrders(tabs[tabValue].value);

  if (isLoading) {
    return <Loader message="Loading your orders..." />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Orders
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track and manage your orders
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {filteredOrders.length > 0 ? (
        <Box>
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tabValue === 0 
              ? "You haven't placed any orders yet" 
              : `No ${tabs[tabValue].label.toLowerCase()} orders`}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default MyOrders;