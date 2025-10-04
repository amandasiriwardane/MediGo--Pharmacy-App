import { createSlice } from '@reduxjs/toolkit';

const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const initialState = {
  items: cartItems,
  pharmacyId: cartItems.length > 0 ? cartItems[0].pharmacyId : null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      
      // Check if adding from different pharmacy
      if (state.pharmacyId && state.pharmacyId !== product.pharmacyId._id) {
        // Clear cart if from different pharmacy
        state.items = [];
      }
      
      state.pharmacyId = product.pharmacyId._id;
      
      const existingItem = state.items.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...product,
          quantity,
          pharmacyId: product.pharmacyId._id
        });
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item._id === productId);
      
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      
      if (state.items.length === 0) {
        state.pharmacyId = null;
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.pharmacyId = null;
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;