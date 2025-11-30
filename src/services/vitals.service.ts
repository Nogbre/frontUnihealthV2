import { apiService } from './api';

export interface Vital {
  id: number;
  patientId: number;
  takenById: number;
  takenAt: string;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  tempC?: number;
  spo2?: number;
  patient?: any;
  takenBy?: any;
}

export interface CreateVitalDto {
  patientId: number;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  tempC?: number;
  spo2?: number;
}

export const vitalsService = {
  async getByPatient(patientId: number): Promise<Vital[]> {
    return await apiService.get<Vital[]>(`/vitals/patient/${patientId}`);
  },

  async getMyHistory(): Promise<Vital[]> {
    return await apiService.get<Vital[]>('/vitals/my-history');
  },

  async create(data: CreateVitalDto): Promise<Vital> {
    return await apiService.post<Vital>('/vitals', data);
  },
};

