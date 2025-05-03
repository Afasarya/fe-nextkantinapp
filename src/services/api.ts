import axios from 'axios';
import { authService } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8000',
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
    
    // Jika error 401 (Unauthorized) pada rute ME endpoint saja yang memerlukan autentikasi
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Jangan redirect dari rute register atau login
      if (originalRequest.url === '/api/register' || originalRequest.url === '/api/login') {
        return Promise.reject(error);
      }
      
      // Jika ini adalah permintaan yang mencoba mengakses rute yang membutuhkan auth
      if (originalRequest.url === '/api/me' || 
          originalRequest.url?.startsWith('/api/cart') || 
          originalRequest.url?.startsWith('/api/order') ||
          originalRequest.url === '/logout') {
        originalRequest._retry = true;
        
        // Hapus token tapi jangan redirect ke login untuk setiap permintaan 401
        authService.clearAuth();
        
        // Hanya redirect ke login jika sedang di halaman yang memang memerlukan auth
        if (window.location.pathname.startsWith('/dashboard') || 
            window.location.pathname.startsWith('/cart') ||
            window.location.pathname.startsWith('/profile')) {
          window.location.href = '/login';
        }
      }
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