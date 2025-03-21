import api from './api';
import { Order, UpdateOrderDTO } from '@/types/order';

export const orderService = {
    getAll: async (month?: number, year?: number): Promise<Order[]> => {
        const params = new URLSearchParams();
        if (month !== undefined) params.append('month', month.toString());
        if (year !== undefined) params.append('year', year.toString());
        
        const response = await api.get(`/api/history?${params.toString()}`);
        return response.data.data;
    },

    update: async (id: number, data: UpdateOrderDTO): Promise<Order> => {
        const response = await api.put(`/api/orders/${id}`, data);
        return response.data.data;
    },
}; 