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

export const getImageUrl = (imageSource) => {
  if (!imageSource) return 'https://placehold.co/200x200?text=No+Image';
  
  // Extract the first path if it's an array, otherwise use the string
  const path = Array.isArray(imageSource) ? imageSource[0] : imageSource;
  
  if (!path || path === 'undefined') return 'https://placehold.co/200x200?text=No+Image';
  if (path.startsWith('http')) return path;
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};