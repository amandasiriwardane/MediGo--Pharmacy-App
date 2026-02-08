import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import {
  ShoppingCart,
  LocalPharmacy,
  Add,
  Remove,
  ArrowBack
} from '@mui/icons-material';
import { getProductById } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import { formatPrice, getImageUrl } from '../../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can add items to cart');
      return;
    }

    if (quantity > product.stock?.quantity) {
      toast.error('Quantity exceeds available stock');
      return;
    }

    dispatch(addToCart({ product, quantity }));
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock?.quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return <Loader message="Loading product details..." />;
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Product not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  const displayPrice = product.pricing?.discountPrice || product.pricing?.price || 0;
  const originalPrice = product.pricing?.price || 0;
  const hasDiscount = product.pricing?.discountPrice && product.pricing?.discountPrice < originalPrice;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/products')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box
              component="img"
              src={getImageUrl(product.image?.[0])}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip label={product.category} color="primary" />
            {product.requiresPrescription && (
              <Chip label="Prescription Required" color="warning" />
            )}
            {product.stock?.quantity === 0 ? (
              <Chip label="Out of Stock" color="error" />
            ) : product.stock?.quantity <= product.stock?.lowStockThreshold ? (
              <Chip label="Low Stock" color="warning" variant="outlined" />
            ) : (
              <Chip label="In Stock" color="success" variant="outlined" />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {formatPrice(displayPrice)}
            </Typography>
            {hasDiscount && (
              <>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatPrice(originalPrice)}
                </Typography>
                <Chip
                  label={`Save ${product.pricing.discountPercentage}%`}
                  color="success"
                  size="small"
                />
              </>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Manufacturer
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {product.manufacturer}
                  </Typography>
                </Grid>
                {product.specifications?.strength && (
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Strength
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {product.specifications.strength}
                    </Typography>
                  </Grid>
                )}
                {product.specifications?.dosageForm && (
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Form
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {product.specifications.dosageForm}
                    </Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Unit
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {product.stock?.unit || 'piece'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocalPharmacy color="primary" />
            <Typography variant="body1">
              Sold by: <strong>{product.pharmacyId?.pharmacyDetails?.pharmacyName || 'Pharmacy'}</strong>
            </Typography>
          </Box>

          {product.stock?.quantity > 0 && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <Typography variant="body1">Quantity:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Remove />
                </Button>
                <TextField
                  value={quantity}
                  size="small"
                  sx={{ width: 60 }}
                  inputProps={{
                    style: { textAlign: 'center' },
                    readOnly: true
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock?.quantity}
                >
                  <Add />
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                ({product.stock?.quantity} available)
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.stock?.quantity === 0}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {product.stock?.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          {product.requiresPrescription && (
            <Typography variant="caption" color="warning.main" sx={{ mt: 2, display: 'block' }}>
              ⚠️ This product requires a valid prescription. You'll need to upload it during checkout.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;