import api from './api';

interface DashboardStats {
  total_foods: number;
  total_users: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/dashboard/stats');
    return response.data.data;
  },
}; 