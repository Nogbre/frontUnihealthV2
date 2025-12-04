import { apiService } from './api';

// Appointment interface matching API response structure
export interface Appointment {
  id: string;
  patientId: string;
  nurseId: string;
  serviceTypeId: string;
  start: string;
  end: string;
  status: string;
  reason?: string;
  patient?: {
    id: string;
    email: string;
    patientProfile?: {
      firstName: string;
      lastName: string;
    };
  };
  nurse?: {
    id: string;
    email: string;
  };
  serviceType?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
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
    console.log('📅 APPOINTMENTS - Fetching all appointments');
    try {
      const response = await apiService.get<Appointment[]>('/appointments');
      console.log('✅ APPOINTMENTS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ APPOINTMENTS - Error fetching all:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Appointment> {
    console.log('🔍 APPOINTMENTS - Fetching appointment:', id);
    try {
      const response = await apiService.get<Appointment>(`/appointments/${id}`);
      console.log('✅ APPOINTMENTS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ APPOINTMENTS - Error fetching by id:', error);
      throw error;
    }
  },

  async create(data: CreateAppointmentDto): Promise<Appointment> {
    console.log('➕ APPOINTMENTS - Creating appointment:', data);
    try {
      const response = await apiService.post<Appointment>('/appointments', data);
      console.log('✅ APPOINTMENTS - Created:', response);
      return response;
    } catch (error) {
      console.error('❌ APPOINTMENTS - Error creating:', error);
      throw error;
    }
  },

  async updateStatus(id: number, status: string): Promise<Appointment> {
    console.log('📝 APPOINTMENTS - Updating status:', id, status);
    try {
      const response = await apiService.patch<Appointment>(
        `/appointments/${id}/status`,
        { status }
      );
      console.log('✅ APPOINTMENTS - Status updated:', response);
      return response;
    } catch (error) {
      console.error('❌ APPOINTMENTS - Error updating status:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    console.log('🗑️ APPOINTMENTS - Deleting appointment:', id);
    try {
      await apiService.delete<void>(`/appointments/${id}`);
      console.log('✅ APPOINTMENTS - Deleted successfully');
    } catch (error) {
      console.error('❌ APPOINTMENTS - Error deleting:', error);
      throw error;
    }
  },
};
