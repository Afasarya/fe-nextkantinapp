import api from './api';
import { Food } from '@/types/food';

export const foodService = {
    getAll: async (): Promise<Food[]> => {
        const response = await api.get('/api/foods');
        return response.data.data;
    },

    getById: async (id: number): Promise<Food> => {
        const response = await api.get(`/api/foods/${id}`);
        return response.data.data;
    },

    create: async (formData: FormData): Promise<Food> => {
        const response = await api.post('/api/foods', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    update: async (id: number, formData: FormData): Promise<Food> => {
        const response = await api.post(`/api/foods/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/foods/${id}`);
    },
}; 