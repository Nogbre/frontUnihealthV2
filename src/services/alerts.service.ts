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
    patientProfile?: {
      firstName: string;
      lastName: string;
      dob: string;
      gender: string;
      allergies?: string;
      history?: string;
    };
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
    return await apiService.get<Alert[]>('/alerts');
  },

  async getById(id: number): Promise<Alert> {
    return await apiService.get<Alert>(`/alerts/${id}`);
  },

  async create(data: CreateAlertDto): Promise<Alert> {
    return await apiService.post<Alert>('/alerts', data);
  },

  async update(id: number, data: UpdateAlertDto): Promise<Alert> {
    return await apiService.patch<Alert>(`/alerts/${id}`, data);
  },

  async assignToMe(id: number): Promise<Alert> {
    return await apiService.patch<Alert>(`/alerts/${id}/assign`);
  },
};

