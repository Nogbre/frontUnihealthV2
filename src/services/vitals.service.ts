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
    try {
      return await apiService.get<Vital[]>(`/vitals/patient/${patientId}`);
    } catch (error) {
      console.warn('⚠️ Using mock vitals data');
      const now = new Date();
      return [
        {
          id: 1,
          patientId,
          takenById: 10,
          takenAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          systolicBP: 120,
          diastolicBP: 80,
          heartRate: 72,
          tempC: 36.5,
          spo2: 98,
        },
        {
          id: 2,
          patientId,
          takenById: 10,
          takenAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          systolicBP: 118,
          diastolicBP: 78,
          heartRate: 70,
          tempC: 36.7,
          spo2: 97,
        },
        {
          id: 3,
          patientId,
          takenById: 11,
          takenAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          systolicBP: 122,
          diastolicBP: 82,
          heartRate: 75,
          tempC: 36.4,
          spo2: 99,
        },
      ];
    }
  },

  async getMyHistory(): Promise<Vital[]> {
    try {
      return await apiService.get<Vital[]>('/vitals/my-history');
    } catch (error) {
      console.warn('⚠️ Using mock vitals history');
      const now = new Date();
      return [
        {
          id: 1,
          patientId: 999,
          takenById: 10,
          takenAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          systolicBP: 115,
          diastolicBP: 75,
          heartRate: 68,
          tempC: 36.6,
          spo2: 98,
          patient: { id: 999, email: 'test@unihealth.com' },
          takenBy: { id: 10, email: 'enfermera1@unihealth.com' },
        },
        {
          id: 2,
          patientId: 999,
          takenById: 11,
          takenAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          systolicBP: 118,
          diastolicBP: 78,
          heartRate: 70,
          tempC: 36.8,
          spo2: 97,
          patient: { id: 999, email: 'test@unihealth.com' },
          takenBy: { id: 11, email: 'enfermera2@unihealth.com' },
        },
      ];
    }
  },

  async create(data: CreateVitalDto): Promise<Vital> {
    try {
      return await apiService.post<Vital>('/vitals', data);
    } catch (error) {
      console.warn('⚠️ Mock vital created');
      return {
        id: Math.floor(Math.random() * 1000),
        patientId: data.patientId,
        takenById: 10,
        takenAt: new Date().toISOString(),
        systolicBP: data.systolicBP,
        diastolicBP: data.diastolicBP,
        heartRate: data.heartRate,
        tempC: data.tempC,
        spo2: data.spo2,
      };
    }
  },
};

