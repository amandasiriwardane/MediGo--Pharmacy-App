import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import { Add, Search, ArrowBack } from '@mui/icons-material';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import ProductTable from '../../components/pharmacy/ProductTable';
import ProductForm from '../../components/pharmacy/ProductForm';
import Loader from '../../components/common/Loader';

const ManageProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(getMyProducts({}));
  }, [dispatch]);

const handleAddProduct = async (productData, imageFile) => {
  try {
    await dispatch(createProduct({ productData, imageFile })).unwrap();
    toast.success('Product added successfully');
    setFormOpen(false);
    dispatch(getMyProducts({}));
  } catch (error) {
    toast.error(error || 'Failed to add product');
  }
};

const handleEditProduct = async (productData, imageFile) => {
  try {
    await dispatch(updateProduct({ id: editingProduct._id, productData, imageFile })).unwrap();
    toast.success('Product updated successfully');
    setFormOpen(false);
    setEditingProduct(null);
    dispatch(getMyProducts({}));
  } catch (error) {
    toast.error(error || 'Failed to update product');
  }
};
  
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await dispatch(deleteProduct(product._id)).unwrap();
        toast.success('Product deleted successfully');
        dispatch(getMyProducts({}));
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      price: product.pricing?.price || '',
      discountPrice: product.pricing?.discountPrice || '',
      quantity: product.stock?.quantity || '',
      unit: product.stock?.unit || 'piece',
      strength: product.specifications?.strength || '',
      dosageForm: product.specifications?.dosageForm || ''
    });
    setFormOpen(true);
  };

  const handleView = (product) => {
    navigate(`/products/${product._id}`);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loader message="Loading products..." />;
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />

      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
        onView={handleView}
      />

      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        initialValues={editingProduct}
        isEdit={!!editingProduct}
      />
    </Container>
  );
};

export default ManageProducts;
