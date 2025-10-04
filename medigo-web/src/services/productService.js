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

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
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