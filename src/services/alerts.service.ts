import { apiService } from './api';

// Alert interface matching API response structure
export interface Alert {
  id: string;
  patientId?: string;
  typeId: string;
  status: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  assignedToId?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    email: string;
    patientProfile?: {
      firstName: string;
      lastName: string;
    };
  };
  type?: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    email: string;
  };
}

export interface CreateAlertDto {
  patientId?: number;
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
    console.log('🚨 ALERTS - Fetching all alerts');
    try {
      const response = await apiService.get<Alert[]>('/alerts');
      console.log('✅ ALERTS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ ALERTS - Error fetching all:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Alert> {
    console.log('🔍 ALERTS - Fetching alert:', id);
    try {
      const response = await apiService.get<Alert>(`/alerts/${id}`);
      console.log('✅ ALERTS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ ALERTS - Error fetching by id:', error);
      throw error;
    }
  },

  async create(data: CreateAlertDto): Promise<Alert> {
    console.log('➕ ALERTS - Creating alert:', data);
    try {
      const response = await apiService.post<Alert>('/alerts', data);
      console.log('✅ ALERTS - Created:', response);
      return response;
    } catch (error) {
      console.error('❌ ALERTS - Error creating:', error);
      throw error;
    }
  },

  async update(id: number, data: UpdateAlertDto): Promise<Alert> {
    console.log('📝 ALERTS - Updating alert:', id, data);
    try {
      const response = await apiService.patch<Alert>(`/alerts/${id}`, data);
      console.log('✅ ALERTS - Updated:', response);
      return response;
    } catch (error) {
      console.error('❌ ALERTS - Error updating:', error);
      throw error;
    }
  },

  async updateStatus(id: number, status: string): Promise<Alert> {
    return this.update(id, { status });
  },

  async assignToMe(id: number): Promise<Alert> {
    console.log('👤 ALERTS - Assigning alert to me:', id);
    try {
      const response = await apiService.patch<Alert>(`/alerts/${id}/assign`, {});
      console.log('✅ ALERTS - Assigned:', response);
      return response;
    } catch (error) {
      console.error('❌ ALERTS - Error assigning:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    console.log('🗑️ ALERTS - Deleting alert:', id);
    try {
      await apiService.delete<void>(`/alerts/${id}`);
      console.log('✅ ALERTS - Deleted successfully');
    } catch (error) {
      console.error('❌ ALERTS - Error deleting:', error);
      throw error;
    }
  },
};
