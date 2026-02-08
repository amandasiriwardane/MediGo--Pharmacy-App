import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { formatPrice, getImageUrl } from '../../utils/helpers';

const ProductTable = ({ products, onEdit, onDelete, onView }) => {
  if (products.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first product to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={getImageUrl(product.image?.[0])}
                    alt={product.name}
                    variant="rounded"
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.manufacturer}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={product.category} size="small" />
              </TableCell>
              <TableCell>
                {formatPrice(product.pricing?.discountPrice || product.pricing?.price || 0)}
              </TableCell>
              <TableCell>
                <Chip
                  label={`${product.stock?.quantity || 0} ${product.stock?.unit || 'pieces'}`}
                  size="small"
                  color={
                    product.stock?.quantity === 0
                      ? 'error'
                      : product.stock?.quantity <= (product.stock?.lowStockThreshold || 10)
                      ? 'warning'
                      : 'success'
                  }
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={product.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={product.isActive ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onView(product)} color="info">
                  <Visibility />
                </IconButton>
                <IconButton size="small" onClick={() => onEdit(product)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(product)} color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;