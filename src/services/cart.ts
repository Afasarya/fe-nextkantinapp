import api from './api';
import { Cart, CreateCartDTO, UpdateCartDTO } from '@/types/cart';

export const cartService = {
    getAll: async (): Promise<Cart[]> => {
        const response = await api.get('/api/carts');
        return response.data.data;
    },

    create: async (data: CreateCartDTO): Promise<Cart> => {
        const response = await api.post('/api/carts', data);
        return response.data.data;
    },

    update: async (id: number, data: UpdateCartDTO): Promise<Cart> => {
        const response = await api.put(`/api/carts/${id}`, data);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/carts/${id}`);
    },
};
