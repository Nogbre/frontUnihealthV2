import { apiService } from './api';

export interface Medicine {
    id: number;
    name: string;
    genericName: string;
    presentation: string;
    category: string;
    quantity: number;
    minQuantity: number;
    unit: string;
    expirationDate: string;
    location: string;
    status: 'normal' | 'low' | 'depleted' | 'expiring';
}

export const medicinesService = {
    getAll: async (): Promise<Medicine[]> => {
        try {
            return await apiService.get<Medicine[]>('/medicines');
        } catch (error) {
            console.error('Error fetching medicines:', error);
            return [];
        }
    },

    getById: async (id: number): Promise<Medicine | undefined> => {
        try {
            return await apiService.get<Medicine>(`/medicines/${id}`);
        } catch (error) {
            console.error(`Error fetching medicine ${id}:`, error);
            return undefined;
        }
    },

    getLowStock: async (): Promise<Medicine[]> => {
        try {
            return await apiService.get<Medicine[]>('/medicines/low-stock');
        } catch (error) {
            console.error('Error fetching low stock medicines:', error);
            return [];
        }
    },

    getStats: async () => {
        try {
            return await apiService.get('/medicines/stats');
        } catch (error) {
            console.error('Error fetching medicine stats:', error);
            return { total: 0, normal: 0, low: 0, depleted: 0 };
        }
    }
};
