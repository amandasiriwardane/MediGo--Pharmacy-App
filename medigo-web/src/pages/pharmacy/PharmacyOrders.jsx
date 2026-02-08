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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import OrderList from '../../components/pharmacy/OrderList';
import Loader from '../../components/common/Loader';
import { formatPrice, formatDate } from '../../utils/helpers';

const PharmacyOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [tabValue, setTabValue] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrders({}));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({
        id: orderId,
        statusData: { status: newStatus, note: `Status updated to ${newStatus}` }
      })).unwrap();
      toast.success('Order status updated');
      dispatch(getOrders({}));
    } catch (error) {
      toast.error(error || 'Failed to update order status');
    }
  };

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    if (status === 'pending') {
      return orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status));
    }
    return orders.filter(o => o.status === status);
  };

  const tabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Ready', value: 'ready-for-pickup' },
    { label: 'Completed', value: 'delivered' }
  ];

  const filteredOrders = filterOrders(tabs[tabValue].value);

  if (isLoading) {
    return <Loader message="Loading orders..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/pharmacy/dashboard')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Orders Management
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      <OrderList
        orders={filteredOrders}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>Order Details - #{selectedOrder.orderNumber}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer
                  </Typography>
                  <Typography variant="body1">
                    {selectedOrder.customerId?.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.customerId?.phone}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Delivery Address
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedOrder.deliveryAddress?.fullAddress}, {selectedOrder.deliveryAddress?.city}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Items
              </Typography>
              {selectedOrder.items?.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.productName} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  {formatPrice(selectedOrder.pricing?.subtotal || 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Delivery Fee</Typography>
                <Typography variant="body2">
                  {formatPrice(selectedOrder.pricing?.deliveryFee || 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">
                  {formatPrice(selectedOrder.pricing?.tax || 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(selectedOrder.pricing?.total || 0)}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default PharmacyOrders;
