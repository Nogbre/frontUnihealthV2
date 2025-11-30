import { apiService } from './api';

export interface Appointment {
  id: number;
  patientId: number;
  nurseId: number;
  serviceTypeId: number;
  start: string;
  end: string;
  status: string;
  reason?: string;
  patient?: any;
  nurse?: any;
  serviceType?: any;
}

export interface CreateAppointmentDto {
  patientId: number;
  nurseId: number;
  serviceTypeId: number;
  start: string;
  end: string;
  reason?: string;
}

export interface UpdateAppointmentDto {
  status?: string;
}

export const appointmentsService = {
  async getAll(): Promise<Appointment[]> {
    return await apiService.get<Appointment[]>('/appointments');
  },

  async getById(id: number): Promise<Appointment> {
    return await apiService.get<Appointment>(`/appointments/${id}`);
  },

  async create(data: CreateAppointmentDto): Promise<Appointment> {
    return await apiService.post<Appointment>('/appointments', data);
  },

  async updateStatus(id: number, status: string): Promise<Appointment> {
    return await apiService.patch<Appointment>(`/appointments/${id}/status`, { status });
  },
};

