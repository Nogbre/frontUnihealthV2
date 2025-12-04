import { apiService } from './api';

// Patient interface matching API response structure
export interface Patient {
  id: string;
  email: string;
  role?: {
    id: string;
    name: string;
  };
  patientProfile?: {
    userId: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    bloodGroup?: string;
    heightCm?: number;
    weightKg?: string;
    insurance?: {
      provider?: string;
      policyNumber?: string;
      validUntil?: string;
    };
    emergencyContact?: string;
    isSmoker?: boolean;
    alcohol?: string;
    activity?: string;
    allergies?: string;
    history?: string;
    phone?: string;
  };
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
  heightCm?: number;
  weightKg?: number;
  insurance?: {
    provider?: string;
    policyNumber?: string;
    validUntil?: string;
  };
  emergencyContact?: string;
  isSmoker?: boolean;
  alcohol?: string;
  activity?: string;
  allergies?: string;
  history?: string;
}

export const patientsService = {
  async getAll(): Promise<Patient[]> {
    console.log('📋 PATIENTS - Fetching all patients');
    try {
      const response = await apiService.get<Patient[]>('/patients');
      console.log('✅ PATIENTS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ PATIENTS - Error fetching all:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Patient> {
    console.log('🔍 PATIENTS - Fetching patient:', id);
    try {
      const response = await apiService.get<Patient>(`/patients/${id}`);
      console.log('✅ PATIENTS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ PATIENTS - Error fetching by id:', error);
      throw error;
    }
  },

  async create(data: CreatePatientDto): Promise<Patient> {
    console.log('➕ PATIENTS - Creating patient:', data);
    try {
      const response = await apiService.post<Patient>('/patients', data);
      console.log('✅ PATIENTS - Created:', response);
      return response;
    } catch (error) {
      console.error('❌ PATIENTS - Error creating:', error);
      throw error;
    }
  },

  async update(id: number, data: Partial<CreatePatientDto>): Promise<Patient> {
    console.log('📝 PATIENTS - Updating patient:', id, data);
    try {
      const response = await apiService.patch<Patient>(`/patients/${id}`, data);
      console.log('✅ PATIENTS - Updated:', response);
      return response;
    } catch (error) {
      console.error('❌ PATIENTS - Error updating:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    console.log('🗑️ PATIENTS - Deleting patient:', id);
    try {
      await apiService.delete<void>(`/patients/${id}`);
      console.log('✅ PATIENTS - Deleted successfully');
    } catch (error) {
      console.error('❌ PATIENTS - Error deleting:', error);
      throw error;
    }
  },
};
