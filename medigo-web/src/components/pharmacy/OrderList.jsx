import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  Typography,
  MenuItem,
  Select
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

const OrderList = ({ orders, onViewOrder, onUpdateStatus }) => {
  if (orders.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No orders found
        </Typography>
      </Paper>
    );
  }

  const pharmacyStatuses = ['confirmed', 'preparing', 'ready-for-pickup', 'cancelled'];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {order.orderNumber}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{order.customerId?.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.customerId?.phone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{order.items?.length || 0} items</TableCell>
              <TableCell>{formatPrice(order.pricing?.total || 0)}</TableCell>
              <TableCell>
                <Typography variant="caption">
                  {formatDate(order.createdAt)}
                </Typography>
              </TableCell>
              <TableCell>
                {order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing' ? (
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    {pharmacyStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Chip
                    label={ORDER_STATUS_LABELS[order.status] || order.status}
                    color={getOrderStatusColor(order.status)}
                    size="small"
                  />
                )}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => onViewOrder(order)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderList;
