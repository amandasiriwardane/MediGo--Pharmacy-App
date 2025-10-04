import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
  },

  cancelOrder: async (id, reason) => {
    const response = await api.put(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  assignDriver: async (id, driverId) => {
    const response = await api.put(`/orders/${id}/assign-driver`, { driverId });
    return response.data;
  },

  getAvailableOrders: async () => {
    const response = await api.get('/orders/available/orders');
    return response.data;
  }
};

export default orderService;