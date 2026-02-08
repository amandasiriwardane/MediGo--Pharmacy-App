import api from './api';

const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData, imageFile) => {
    const formData = new FormData();
    
    // Append all fields individually
    Object.keys(productData).forEach(key => {
      if (typeof productData[key] === 'object' && productData[key] !== null) {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    // Append image if exists
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateProduct: async (id, productData, imageFile) => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (typeof productData[key] === 'object' && productData[key] !== null) {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getMyProducts: async (params) => {
    const response = await api.get('/products/my/products', { params });
    return response.data;
  },

  updateStock: async (id, quantity) => {
    const response = await api.put(`/products/${id}/stock`, { quantity });
    return response.data;
  }
};

export default productService;