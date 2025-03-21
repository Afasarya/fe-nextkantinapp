import api from './api';
import { AuthResponse, LoginDTO, RegisterStudentDTO, RegisterStandDTO, User } from '@/types/auth';

export const authService = {
    login: async (data: LoginDTO): Promise<AuthResponse> => {
        const response = await api.post('/api/auth/login', data);
        return response.data.data;
    },

    registerStudent: async (data: RegisterStudentDTO): Promise<AuthResponse> => {
        const response = await api.post('/api/auth/register', data);
        return response.data.data;
    },

    registerStand: async (data: RegisterStandDTO): Promise<AuthResponse> => {
        const response = await api.post('/api/auth/register', data);
        return response.data.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/api/auth/logout');
    },

    me: async (): Promise<User> => {
        const response = await api.get('/api/auth/me');
        return response.data.data;
    },

    // Helper untuk menyimpan token di localStorage
    setToken: (token: string): void => {
        localStorage.setItem('token', token);
    },

    // Helper untuk mengambil token dari localStorage
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    // Helper untuk menghapus token dari localStorage
    removeToken: (): void => {
        localStorage.removeItem('token');
    },

    // Helper untuk mengecek apakah user sudah login
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    // Helper untuk mengecek role user
    hasRole: (user: User | null, role: string): boolean => {
        return user?.roles.includes(role) ?? false;
    },

    // Helper untuk mengecek apakah user adalah pemilik stand
    isStandOwner: (user: User | null): boolean => {
        return user?.roles.includes('Stand') ?? false;
    }
};
