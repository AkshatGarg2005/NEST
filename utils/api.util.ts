// utils/api.util.ts
import axios from 'axios';

// We'll use a relative path which will resolve to the current host
const BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set a timeout
  timeout: 5000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  console.error('Request configuration error:', error);
  return Promise.reject(error);
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const statusCode = error.response.status;
      const responseData = error.response.data;
      
      switch (statusCode) {
        case 401:
          console.error('API Authentication Error: Unauthorized');
          // You could handle token refresh or logout here
          break;
        case 403:
          console.error('API Authorization Error: Forbidden');
          break;
        case 404:
          console.error('API Error: Resource not found');
          break;
        case 500:
          console.error('API Server Error');
          break;
        default:
          console.error(`API Error (${statusCode}):`, responseData);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error: No response received - network issue');
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;