import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// Async thunk to verify session via HttpOnly cookies on application load.
// A 401 here is expected for guests — not an error, just means no active session.
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/auth/profile');
    return response.data.data;
  } catch (error) {
    const status = error.response?.status;
    // 401 = no session, treat silently as "not logged in"
    if (status === 401) {
      return rejectWithValue(null);
    }
    return rejectWithValue(error.response?.data?.message || 'Session check failed');
  }
});

const parseStoredUser = () => {
  try {
    const raw = sessionStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    const parsed = JSON.parse(raw);
    // Make sure it's an actual user object, not a primitive
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    sessionStorage.removeItem('user');
    return null;
  }
};

const storedUser = parseStoredUser();
const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  loading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      if (!user || typeof user !== 'object') return;
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
        const user = action.payload;
        if (user && typeof user === 'object') {
          state.user = user;
          state.isAuthenticated = true;
          sessionStorage.setItem('user', JSON.stringify(user));
        } else {
          state.user = null;
          state.isAuthenticated = false;
          sessionStorage.removeItem('user');
        }
        state.loading = false;
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
