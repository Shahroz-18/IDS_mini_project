import axios from 'axios';

/**
 * Single configured Axios instance for the entire application.
 * Requests use the current origin in deployment and the Vite proxy locally.
 */
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000' : '/'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred with the server.';
    return Promise.reject(new Error(message));
  }
);

export default api;
