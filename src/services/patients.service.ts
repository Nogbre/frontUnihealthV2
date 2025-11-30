import { apiService } from './api';

export interface Patient {
  id: number;
  email: string;
  patientProfile?: {
    userId: number;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    phone?: string;
  };
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob: string;
  gender: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  phone?: string;
}

export const patientsService = {
  async getAll(): Promise<Patient[]> {
    return await apiService.get<Patient[]>('/patients');
  },

  async getById(id: number): Promise<Patient> {
    return await apiService.get<Patient>(`/patients/${id}`);
  },

  async create(data: CreatePatientDto): Promise<Patient> {
    return await apiService.post<Patient>('/patients', data);
  },

  async update(id: number, data: UpdatePatientDto): Promise<Patient> {
    return await apiService.patch<Patient>(`/patients/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return await apiService.delete<void>(`/patients/${id}`);
  },
};

