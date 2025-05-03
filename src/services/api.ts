import axios from 'axios';
import { authService } from './auth';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk menangani error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Hapus token dan redirect ke login
      authService.clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Jika error 500, tampilkan pesan error dari server
    if (error.response?.status === 500) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan server';
      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(error);
  }
);

export default api;