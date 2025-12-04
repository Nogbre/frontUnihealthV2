import { apiService } from './api';

export interface ClinicalRecord {
  id: string;
  patientId: string;
  noteTypeId: string;
  note: string;
  createdById: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    id: string;
    email: string;
    role?: {
      id: string;
      name: string;
    };
  };
  noteType?: {
    id: string;
    name: string;
  };
  patient?: any;
}

export interface CreateClinicalRecordDto {
  patientId: string;
  noteTypeId: string;
  note: string;
}

export const clinicalRecordsService = {
  async create(data: CreateClinicalRecordDto): Promise<ClinicalRecord> {
    console.log('➕ CLINICAL RECORDS - Creating:', data);
    try {
      const response = await apiService.post<ClinicalRecord>('/records', data);
      console.log('✅ CLINICAL RECORDS - Created:', response);
      return response;
    } catch (error) {
      console.error('❌ CLINICAL RECORDS - Error creating:', error);
      throw error;
    }
  },

  async getByPatient(patientId: string): Promise<ClinicalRecord[]> {
    console.log('📋 CLINICAL RECORDS - Fetching for patient:', patientId);
    try {
      const response = await apiService.get<ClinicalRecord[]>(`/records/patient/${patientId}`);
      console.log('✅ CLINICAL RECORDS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ CLINICAL RECORDS - Error fetching:', error);
      throw error;
    }
  },

  async getMyHistory(): Promise<ClinicalRecord[]> {
    console.log('📋 CLINICAL RECORDS - Fetching my history');
    try {
      const response = await apiService.get<ClinicalRecord[]>('/records/my-history');
      console.log('✅ CLINICAL RECORDS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ CLINICAL RECORDS - Error fetching my history:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<ClinicalRecord> {
    console.log('🔍 CLINICAL RECORDS - Fetching by id:', id);
    try {
      const response = await apiService.get<ClinicalRecord>(`/records/${id}`);
      console.log('✅ CLINICAL RECORDS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ CLINICAL RECORDS - Error fetching:', error);
      throw error;
    }
  },
};
