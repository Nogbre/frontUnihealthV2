import apiService from '../config/api';

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

// Mock data - esto debería venir del backend
const mockMedicines: Medicine[] = [
    {
        id: 1,
        name: 'Ibuprofeno',
        genericName: 'Ibuprofeno',
        presentation: 'Tabletas 400mg',
        category: 'Analgésico',
        quantity: 15,
        minQuantity: 50,
        unit: 'Tabletas',
        expirationDate: '2026-03-14',
        location: 'Estante A1',
        status: 'low'
    },
    {
        id: 2,
        name: 'Paracetamol',
        genericName: 'Paracetamol',
        presentation: 'Tabletas 500mg',
        category: 'Analgésico',
        quantity: 150,
        minQuantity: 100,
        unit: 'Tabletas',
        expirationDate: '2026-06-19',
        location: 'Estante A1',
        status: 'normal'
    },
    {
        id: 3,
        name: 'Amoxicilina',
        genericName: 'Amoxicilina',
        presentation: 'Cápsulas 500mg',
        category: 'Antibiótico',
        quantity: 0,
        minQuantity: 30,
        unit: 'Cápsulas',
        expirationDate: '2025-11-30',
        location: 'Estante B2',
        status: 'depleted'
    },
    {
        id: 4,
        name: 'Salbutamol',
        genericName: 'Salbutamol',
        presentation: 'Inhalador 100mcg',
        category: 'Broncodilatador',
        quantity: 8,
        minQuantity: 10,
        unit: 'Inhaladores',
        expirationDate: '2025-11-29',
        location: 'Estante C1',
        status: 'expiring'
    },
    {
        id: 5,
        name: 'Omeprazol',
        genericName: 'Omeprazol',
        presentation: 'Cápsulas 20mg',
        category: 'Antiácido',
        quantity: 80,
        minQuantity: 40,
        unit: 'Cápsulas',
        expirationDate: '2026-08-14',
        location: 'Estante A2',
        status: 'normal'
    }
];

export const medicinesService = {
    getAll: async (): Promise<Medicine[]> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockMedicines), 100);
        });
    },

    getById: async (id: number): Promise<Medicine | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockMedicines.find(m => m.id === id)), 100);
        });
    },

    getLowStock: async (): Promise<Medicine[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockMedicines.filter(m => m.status === 'low' || m.status === 'depleted'));
            }, 100);
        });
    },

    getStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const total = mockMedicines.length;
                const normal = mockMedicines.filter(m => m.status === 'normal').length;
                const low = mockMedicines.filter(m => m.status === 'low').length;
                const depleted = mockMedicines.filter(m => m.status === 'depleted').length;

                resolve({ total, normal, low, depleted });
            }, 100);
        });
    }
};
