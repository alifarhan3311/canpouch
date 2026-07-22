import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// Async thunk to verify session via HttpOnly cookies on application load
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/auth/profile');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

const user = sessionStorage.getItem('user');
const initialState = {
  user: user ? JSON.parse(user) : null,
  isAuthenticated: !!user,
  loading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      // Stored in sessionStorage for non-sensitive UI state only; real auth token is in HttpOnly Cookie
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      sessionStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        sessionStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        sessionStorage.removeItem('user');
      });
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
