import { apiService } from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
}

// Note: According to notifications.md, these are stub endpoints
// that return strings instead of actual data
export const notificationsService = {
  async create(data: CreateNotificationDto): Promise<string> {
    console.log('🔔 NOTIFICATIONS - Creating (stub):', data);
    try {
      const response = await apiService.post<string>('/notifications', data);
      console.log('✅ NOTIFICATIONS - Created (stub):', response);
      return response;
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error creating:', error);
      throw error;
    }
  },

  async getAll(): Promise<string> {
    console.log('📋 NOTIFICATIONS - Fetching all (stub)');
    try {
      const response = await apiService.get<string>('/notifications');
      console.log('✅ NOTIFICATIONS - Success (stub):', response);
      return response;
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error fetching:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<string> {
    console.log('🔍 NOTIFICATIONS - Fetching by id (stub):', id);
    try {
      const response = await apiService.get<string>(`/notifications/${id}`);
      console.log('✅ NOTIFICATIONS - Success (stub):', response);
      return response;
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error fetching:', error);
      throw error;
    }
  },

  async update(id: number, data: Partial<CreateNotificationDto>): Promise<string> {
    console.log('📝 NOTIFICATIONS - Updating (stub):', id, data);
    try {
      const response = await apiService.patch<string>(`/notifications/${id}`, data);
      console.log('✅ NOTIFICATIONS - Updated (stub):', response);
      return response;
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error updating:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<string> {
    console.log('🗑️ NOTIFICATIONS - Deleting (stub):', id);
    try {
      const response = await apiService.delete<string>(`/notifications/${id}`);
      console.log('✅ NOTIFICATIONS - Deleted (stub):', response);
      return response;
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error deleting:', error);
      throw error;
    }
  },
};
