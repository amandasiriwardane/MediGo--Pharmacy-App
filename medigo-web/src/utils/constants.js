
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  CUSTOMER: 'customer',
  PHARMACY: 'pharmacy',
  DRIVER: 'driver',
  ADMIN: 'admin'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready-for-pickup',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked-up',
  OUT_FOR_DELIVERY: 'out-for-delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  'pending': 'Pending',
  'confirmed': 'Confirmed',
  'preparing': 'Preparing',
  'ready-for-pickup': 'Ready for Pickup',
  'assigned': 'Driver Assigned',
  'picked-up': 'Picked Up',
  'out-for-delivery': 'Out for Delivery',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled'
};

export const PRODUCT_CATEGORIES = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'otc', label: 'Over the Counter' },
  { value: 'supplement', label: 'Supplement' },
  { value: 'medical-equipment', label: 'Medical Equipment' },
  { value: 'personal-care', label: 'Personal Care' }
];

export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'wallet', label: 'Digital Wallet' }
];