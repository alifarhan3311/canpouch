import { createSlice } from '@reduxjs/toolkit';

const cartItems = localStorage.getItem('cartItems');
const initialState = {
  cartItems: cartItems ? JSON.parse(cartItems) : []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, quantity: x.quantity + (item.quantity || 1) } : x
        );
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === id);
      if (existItem) {
        existItem.quantity = Math.max(1, quantity);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
