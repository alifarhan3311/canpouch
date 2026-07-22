import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true
});

// Silently handle 401s — these are expected for unauthenticated users.
// The authSlice.checkAuth rejection handler takes care of state cleanup.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Suppress console noise for expected auth check failures
    if (status === 401 && url.includes('/auth/profile')) {
      return Promise.reject(error);
    }

    // For all other 401s (e.g. token expired mid-session), log a clean message
    if (status === 401) {
      console.warn('Session expired or unauthorized. Please log in.');
    }

    return Promise.reject(error);
  }
);

export default API;
