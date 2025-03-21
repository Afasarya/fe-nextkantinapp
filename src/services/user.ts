import api from './api';
import { User, CreateUserDTO, UpdateUserDTO } from '@/types/user';

export const userService = {
    // Mengambil semua user
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/api/users');
        return response.data.data;
    },

    // Mengambil user berdasarkan ID
    getById: async (id: number): Promise<User> => {
        try {
            const response = await api.get(`/api/users/${id}`);
            console.log('User response:', response.data); // Debug log
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Membuat user baru
    create: async (data: CreateUserDTO): Promise<User> => {
        const response = await api.post('/api/users', data);
        return response.data.data;
    },

    // Mengupdate user
    update: async (id: number, data: UpdateUserDTO): Promise<User> => {
        try {
            const response = await api.put(`/api/users/${id}`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/users/${id}`);
    }
};
