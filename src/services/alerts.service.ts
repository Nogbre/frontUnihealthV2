import { apiService } from './api';

export interface Alert {
  id: number;
  status: string;
  patientId: number;
  typeId: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  createdAt: string;
  resolvedAt?: string;
  assignedToId?: number;
  patient?: {
    id: number;
    email: string;
  };
  type?: {
    id: number;
    name: string;
  };
  assignedTo?: {
    id: number;
    email: string;
  };
}

export interface CreateAlertDto {
  patientId: number;
  typeId: number;
  latitude?: number;
  longitude?: number;
  description?: string;
}

export interface UpdateAlertDto {
  status?: string;
  assignedToId?: number;
}

export const alertsService = {
  async getAll(): Promise<Alert[]> {
    try {
      return await apiService.get<Alert[]>('/alerts');
    } catch (error) {
      console.warn('⚠️ Using mock alerts data');
      const now = new Date();
      return [
        {
          id: 1,
          status: 'pendiente',
          patientId: 1,
          typeId: 1,
          latitude: 4.6097,
          longitude: -74.0817,
          description: 'El paciente reporta dolor en el pecho',
          createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          patient: { id: 1, email: 'maria.garcia@email.com' },
          type: { id: 1, name: 'Emergencia Cardíaca' },
        },
        {
          id: 2,
          status: 'en_atencion',
          patientId: 2,
          typeId: 2,
          latitude: 4.6486,
          longitude: -74.0574,
          description: 'Caída reportada por el paciente',
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          assignedToId: 999,
          patient: { id: 2, email: 'carlos.rodriguez@email.com' },
          type: { id: 2, name: 'Caída' },
          assignedTo: { id: 999, email: 'test@unihealth.com' },
        },
        {
          id: 3,
          status: 'resuelta',
          patientId: 3,
          typeId: 3,
          latitude: 4.7110,
          longitude: -74.0721,
          description: 'Solicitud de asistencia para medicación',
          createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          resolvedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(),
          assignedToId: 10,
          patient: { id: 3, email: 'ana.martinez@email.com' },
          type: { id: 3, name: 'Asistencia General' },
          assignedTo: { id: 10, email: 'enfermera1@unihealth.com' },
        },
        {
          id: 4,
          status: 'pendiente',
          patientId: 4,
          typeId: 4,
          description: 'Paciente reporta fiebre alta',
          createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          patient: { id: 4, email: 'juan.perez@email.com' },
          type: { id: 4, name: 'Síntomas Anormales' },
        },
      ];
    }
  },

  async getById(id: number): Promise<Alert> {
    try {
      return await apiService.get<Alert>(`/alerts/${id}`);
    } catch (error) {
      console.warn('⚠️ Using mock alert data');
      return {
        id,
        status: 'pendiente',
        patientId: 1,
        typeId: 1,
        latitude: 4.6097,
        longitude: -74.0817,
        description: 'Mock alert description',
        createdAt: new Date().toISOString(),
      };
    }
  },

  async create(data: CreateAlertDto): Promise<Alert> {
    try {
      return await apiService.post<Alert>('/alerts', data);
    } catch (error) {
      console.warn('⚠️ Mock alert created');
      return {
        id: Math.floor(Math.random() * 1000),
        status: 'pendiente',
        ...data,
        createdAt: new Date().toISOString(),
      };
    }
  },

  async update(id: number, data: UpdateAlertDto): Promise<Alert> {
    try {
      return await apiService.patch<Alert>(`/alerts/${id}`, data);
    } catch (error) {
      console.warn('⚠️ Mock alert updated');
      return {
        id,
        status: data.status || 'en_atencion',
        patientId: 1,
        typeId: 1,
        description: 'Updated mock alert',
        createdAt: new Date().toISOString(),
        assignedToId: data.assignedToId,
      };
    }
  },

  async assignToMe(id: number): Promise<Alert> {
    try {
      return await apiService.patch<Alert>(`/alerts/${id}/assign`);
    } catch (error) {
      console.warn('⚠️ Mock alert assigned');
      return {
        id,
        status: 'en_atencion',
        patientId: 1,
        typeId: 1,
        description: 'Alert assigned to me',
        createdAt: new Date().toISOString(),
        assignedToId: 999,
      };
    }
  },
};

