import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Divider
} from '@mui/material';
import { Visibility, LocalShipping } from '@mui/icons-material';
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </Box>
          <Chip 
            label={ORDER_STATUS_LABELS[order.status] || order.status}
            color={getOrderStatusColor(order.status)}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Items ({order.items?.length || 0})
          </Typography>
          {order.items?.slice(0, 2).map((item, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              • {item.productName} (x{item.quantity})
            </Typography>
          ))}
          {order.items?.length > 2 && (
            <Typography variant="body2" color="text.secondary">
              + {order.items.length - 2} more items
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <LocalShipping sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            {order.pharmacyId?.pharmacyDetails?.pharmacyName || 'Pharmacy'}
          </Typography>
          <Typography variant="h6" color="primary">
            {formatPrice(order.pricing?.total || 0)}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Visibility />}
          onClick={() => navigate(`/orders/${order._id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderCard;