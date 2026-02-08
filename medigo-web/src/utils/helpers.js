export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'info',
    'ready-for-pickup': 'primary',
    assigned: 'primary',
    'picked-up': 'secondary',
    'out-for-delivery': 'secondary',
    delivered: 'success',
    cancelled: 'error'
  };
  return colors[status] || 'default';
};

export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.pricing?.discountPrice || item.pricing?.price || 0;
    return total + (price * item.quantity);
  }, 0);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance.toFixed(2);
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
  }
  if (imagePath.startsWith('http')) return imagePath;
  // Just return the path as-is, Vite will proxy it
  return imagePath;
};