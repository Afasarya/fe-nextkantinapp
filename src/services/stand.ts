import api from './api';
import { Stand, CreateStandDTO, UpdateStandDTO } from '@/types/stand';

export const standService = {
  getAll: async (): Promise<Stand[]> => {
    const response = await api.get('/api/stands');
    return response.data.data;
  },

  getById: async (id: number): Promise<Stand> => {
    const response = await api.get(`/api/stands/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStandDTO): Promise<Stand> => {
    const response = await api.post('/api/stands', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateStandDTO): Promise<Stand> => {
    const response = await api.put(`/api/stands/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/stands/${id}`);
  },
};
