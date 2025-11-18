import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});


// Intercept responses to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    
    toast.error(message);

    if (error.response?.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      localStorage.removeItem('agritrace-token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;