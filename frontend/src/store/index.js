import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import complianceReducer from './complianceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    compliance: complianceReducer
  }
});
