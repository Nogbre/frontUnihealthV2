import { apiService } from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  relatedType?: 'appointment' | 'alert' | 'report';
  relatedId?: string;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    console.log('📋 NOTIFICATIONS - Fetching all');
    try {
      const response = await apiService.get<Notification[]>('/notifications');
      console.log('✅ NOTIFICATIONS - Success:', response);
      
      // If response is a string (stub), return empty array
      if (typeof response === 'string') {
        console.log('⚠️ NOTIFICATIONS - API returned stub, returning empty array');
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error fetching:', error);
      return [];
    }
  },

  async markAsRead(id: string): Promise<void> {
    console.log('📝 NOTIFICATIONS - Marking as read:', id);
    try {
      await apiService.patch(`/notifications/${id}`, { read: true });
      console.log('✅ NOTIFICATIONS - Marked as read');
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error marking as read:', error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<void> {
    console.log('📝 NOTIFICATIONS - Marking all as read');
    try {
      await apiService.post('/notifications/mark-all-read', {});
      console.log('✅ NOTIFICATIONS - All marked as read');
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error marking all as read:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    console.log('🗑️ NOTIFICATIONS - Deleting:', id);
    try {
      await apiService.delete(`/notifications/${id}`);
      console.log('✅ NOTIFICATIONS - Deleted');
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error deleting:', error);
      throw error;
    }
  }
};
