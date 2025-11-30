export interface Report {
    id: number;
    type: 'emergency' | 'consultation' | 'followup';
    patientName: string;
    patientId: number;
    date: string;
    time: string;
    status: 'completed' | 'draft';
    content?: string;
    createdBy: string;
}

// Mock data
const mockReports: Report[] = [
    {
        id: 1,
        type: 'emergency',
        patientName: 'María González Rodríguez',
        patientId: 1,
        date: '2025-10-26',
        time: '09:30',
        status: 'completed',
        content: 'Reporte de emergencia completado',
        createdBy: 'Dr. Roberto Fernández'
    },
    {
        id: 2,
        type: 'consultation',
        patientName: 'Juan Pérez Martínez',
        patientId: 2,
        date: '2025-10-25',
        time: '14:15',
        status: 'completed',
        content: 'Consulta general completada',
        createdBy: 'Dr. Roberto Fernández'
    },
    {
        id: 3,
        type: 'followup',
        patientName: 'Ana Martínez López',
        patientId: 3,
        date: '2025-10-24',
        time: '11:00',
        status: 'draft',
        content: 'Borrador de seguimiento en progreso',
        createdBy: 'Dr. Roberto Fernández'
    }
];

export const reportsService = {
    getAll: async (): Promise<Report[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockReports), 100);
        });
    },

    getById: async (id: number): Promise<Report | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockReports.find(r => r.id === id)), 100);
        });
    },

    getByType: async (type: 'emergency' | 'consultation' | 'followup'): Promise<Report[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockReports.filter(r => r.type === type)), 100);
        });
    },

    getDrafts: async (): Promise<Report[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockReports.filter(r => r.status === 'draft')), 100);
        });
    },

    getStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const total = mockReports.length;
                const completed = mockReports.filter(r => r.status === 'completed').length;
                const drafts = mockReports.filter(r => r.status === 'draft').length;
                const emergency = mockReports.filter(r => r.type === 'emergency').length;
                const consultation = mockReports.filter(r => r.type === 'consultation').length;
                const followup = mockReports.filter(r => r.type === 'followup').length;

                resolve({ total, completed, drafts, emergency, consultation, followup });
            }, 100);
        });
    }
};
