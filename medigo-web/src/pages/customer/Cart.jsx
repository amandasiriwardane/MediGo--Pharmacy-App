import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Divider,
  TextField
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowBack
} from '@mui/icons-material';
import { updateQuantity, removeFromCart, clearCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { formatPrice, calculateCartTotal, getImageUrl } from '../../utils/helpers';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId, productName) => {
    dispatch(removeFromCart(productId));
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared');
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add some products to get started
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  const subtotal = calculateCartTotal(items);
  const deliveryFee = 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/products')}
        sx={{ mb: 3 }}
      >
        Continue Shopping
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {items.map((item) => {
            const price = item.pricing?.discountPrice || item.pricing?.price || 0;
            const originalPrice = item.pricing?.price || 0;
            const hasDiscount = item.pricing?.discountPrice && item.pricing?.discountPrice < originalPrice;

            return (
              <Card key={item._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <CardMedia
                        component="img"
                        image={getImageUrl(item.image?.[0])}
                        alt={item.name}
                        sx={{
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 9 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.category}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6" color="primary">
                              {formatPrice(price)}
                            </Typography>
                            {hasDiscount && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: 'line-through' }}
                              >
                                {formatPrice(originalPrice)}
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Remove />
                              </IconButton>
                              <TextField
                                value={item.quantity}
                                size="small"
                                sx={{ width: 60 }}
                                inputProps={{
                                  style: { textAlign: 'center' },
                                  readOnly: true
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                                disabled={item.quantity >= (item.stock?.quantity || 0)}
                              >
                                <Add />
                              </IconButton>
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                              Subtotal: <strong>{formatPrice(price * item.quantity)}</strong>
                            </Typography>
                          </Box>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item._id, item.name)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">{formatPrice(subtotal)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Delivery Fee</Typography>
              <Typography variant="body1">{formatPrice(deliveryFee)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Tax (5%)</Typography>
              <Typography variant="body1">{formatPrice(tax)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(total)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/checkout')}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                📦 Free delivery on orders over {formatPrice(500)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;