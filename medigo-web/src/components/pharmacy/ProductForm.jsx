import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const ProductForm = ({ open, onClose, onSubmit, initialValues, isEdit }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialValues?.images?.[0] || null);
 
  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    manufacturer: Yup.string().required('Manufacturer is required'),
    price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
    quantity: Yup.number().min(0, 'Quantity must be positive').required('Quantity is required')
  });

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      category: '',
      manufacturer: '',
      price: '',
      discountPrice: '',
      quantity: '',
      unit: 'piece',
      requiresPrescription: false,
      strength: '',
      dosageForm: ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        manufacturer: values.manufacturer,
        pricing: {
          price: Number(values.price),
          discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined
        },
        stock: {
          quantity: Number(values.quantity),
          unit: values.unit
        },
        requiresPrescription: values.requiresPrescription,
        specifications: {
          strength: values.strength,
          dosageForm: values.dosageForm
        }
      };
      onSubmit(productData, imageFile);
    }
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="name"
                label="Product Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="manufacturer"
                label="Manufacturer"
                value={formik.values.manufacturer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.manufacturer && Boolean(formik.errors.manufacturer)}
                helperText={formik.touched.manufacturer && formik.errors.manufacturer}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="price"
                label="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="discountPrice"
                label="Discount Price (Optional)"
                value={formik.values.discountPrice}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="quantity"
                label="Stock Quantity"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                name="unit"
                label="Unit"
                value={formik.values.unit}
                onChange={formik.handleChange}
              >
                <MenuItem value="piece">Piece</MenuItem>
                <MenuItem value="bottle">Bottle</MenuItem>
                <MenuItem value="box">Box</MenuItem>
                <MenuItem value="strip">Strip</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="strength"
                label="Strength (e.g., 500mg)"
                value={formik.values.strength}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="dosageForm"
                label="Dosage Form (e.g., Tablets)"
                value={formik.values.dosageForm}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                {imagePreview ? 'Change Product Image' : 'Upload Product Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={imagePreview.startsWith('blob:') ? imagePreview : `http://localhost:5000${imagePreview}`}
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
            </Grid>
            

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    name="requiresPrescription"
                    checked={formik.values.requiresPrescription}
                    onChange={formik.handleChange}
                  />
                }
                label="Requires Prescription"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Update' : 'Add'} Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;