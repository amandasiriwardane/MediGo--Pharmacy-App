import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import {
  LocalPharmacy,
  LocalShipping,
  Security,
  Timer
} from '@mui/icons-material';
import { getProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import ProductCard from '../../components/customer/ProductCard';
import Loader from '../../components/common/Loader';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can add items to cart');
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  const features = [
    {
      icon: <LocalPharmacy sx={{ fontSize: 40 }} />,
      title: 'Wide Selection',
      description: 'Access to multiple verified pharmacies'
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Get your medicines delivered quickly'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Safe',
      description: 'Your health information is protected'
    },
    {
      icon: <Timer sx={{ fontSize: 40 }} />,
      title: '24/7 Available',
      description: 'Order anytime, anywhere'
    }
  ];

  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom fontWeight="bold">
                Your Health, Delivered
              </Typography>
              <Typography variant="h6" paragraph>
                Order medicines online and get them delivered to your doorstep quickly and safely.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                  onClick={() => navigate('/products')}
                >
                  Browse Products
                </Button>
                {!user && (
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.100' } }}
                    onClick={() => navigate('/register')}
                  >
                    Sign Up
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600"
                alt="Pharmacy"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Why Choose MediGo?
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Your trusted partner for all your pharmaceutical needs
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Featured Products
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/products')}>
            View All
          </Button>
        </Box>

        {isLoading ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            {products.slice(0, 8).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>
        )}

        {products.length === 0 && !isLoading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No products available yet
            </Typography>
          </Paper>
        )}
      </Container>

      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Ready to get started?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Join thousands of customers who trust MediGo for their healthcare needs
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(user ? '/products' : '/register')}
              sx={{ mt: 2 }}
            >
              {user ? 'Start Shopping' : 'Create Account'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;