import React from 'react';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { ShoppingCart, LocalPharmacy } from '@mui/icons-material';

const ProductCard = ({ product, onAddToCart }) => {
  const displayPrice = product.pricing?.discountPrice || product.pricing?.price || 0;
  const originalPrice = product.pricing?.price || 0;
  const hasDiscount = product.pricing?.discountPrice && product.pricing?.discountPrice < originalPrice;

  console.log('Product:', product.name);
  console.log('Image path:', product.images?.[0]);
  console.log('Generated URL:', getImageUrl(product.images?.[0]));
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={getImageUrl(product.image?.[0])}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description?.substring(0, 80)}...
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={product.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          {product.requiresPrescription && (
            <Chip 
              label="Rx Required" 
              size="small" 
              color="warning" 
            />
          )}
          {product.stock?.quantity === 0 && (
            <Chip 
              label="Out of Stock" 
              size="small" 
              color="error" 
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Typography variant="h6" color="primary">
            {formatPrice(displayPrice)}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <LocalPharmacy sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {product.pharmacyId?.pharmacyDetails?.pharmacyName || 'Pharmacy'}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          component={Link} 
          to={`/products/${product._id}`}
          fullWidth
          variant="outlined"
        >
          View Details
        </Button>
        <Button
          size="small"
          startIcon={<ShoppingCart />}
          onClick={() => onAddToCart(product)}
          fullWidth
          variant="contained"
          disabled={product.stock?.quantity === 0}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;