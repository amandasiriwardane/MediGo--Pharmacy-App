import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Paper,
  InputAdornment,
  Pagination
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import ProductCard from '../../components/customer/ProductCard';
import Loader from '../../components/common/Loader';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, isLoading, pagination } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1
  });

  useEffect(() => {
    const params = {
      page: filters.page,
      limit: 12
    };

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.category) {
      params.category = filters.category;
    }

    dispatch(getProducts(params));
  }, [dispatch, filters]);

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

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value, page: 1 });
  };

  const handlePageChange = (event, value) => {
    setFilters({ ...filters, page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Browse Products
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find the medicines and health products you need
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              placeholder="Search for medicines..."
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>            
            <TextField
              fullWidth
              select
              label="Category"
              value={filters.category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {PRODUCT_CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </Grid>
                ))}
              </Grid>

              {pagination && pagination.pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.pages}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search or filters
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;