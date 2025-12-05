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

// Mock notifications for fallback when API is not ready
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nueva cita programada',
    message: 'Tienes una cita con el paciente María García hoy a las 10:00 AM',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
    relatedType: 'appointment',
    relatedId: '123'
  },
  {
    id: '2',
    title: 'Alerta de emergencia',
    message: 'Nueva alerta de emergencia en Zona Norte requiere atención',
    type: 'error',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    relatedType: 'alert',
    relatedId: '456'
  },
  {
    id: '3',
    title: 'Reporte completado',
    message: 'El reporte médico de Juan Pérez ha sido completado exitosamente',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    relatedType: 'report',
    relatedId: '789'
  }
];

export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    console.log('📋 NOTIFICATIONS - Fetching all');
    try {
      const response = await apiService.get<Notification[]>('/notifications');
      console.log('✅ NOTIFICATIONS - Success:', response);
      
      // If response is a string (stub), return mock data
      if (typeof response === 'string') {
        console.log('⚠️ NOTIFICATIONS - Using mock data (API returned stub)');
        return mockNotifications;
      }
      
      return response;
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error, using mock data:', error);
      return mockNotifications;
    }
  },

  async markAsRead(id: string): Promise<void> {
    console.log('📝 NOTIFICATIONS - Marking as read:', id);
    try {
      await apiService.patch(`/notifications/${id}`, { read: true });
      console.log('✅ NOTIFICATIONS - Marked as read');
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error marking as read:', error);
      // Find and update in mock data
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    }
  },

  async markAllAsRead(): Promise<void> {
    console.log('📝 NOTIFICATIONS - Marking all as read');
    try {
      await apiService.post('/notifications/mark-all-read', {});
      console.log('✅ NOTIFICATIONS - All marked as read');
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error marking all as read:', error);
      // Update all mock notifications
      mockNotifications.forEach(n => n.read = true);
    }
  },

  async delete(id: string): Promise<void> {
    console.log('🗑️ NOTIFICATIONS - Deleting:', id);
    try {
      await apiService.delete(`/notifications/${id}`);
      console.log('✅ NOTIFICATIONS - Deleted');
    } catch (error) {
      console.error('❌ NOTIFICATIONS - Error deleting:', error);
      // Remove from mock data
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications.splice(index, 1);
      }
    }
  },

  getUnreadCount(): number {
    return mockNotifications.filter(n => !n.read).length;
  }
};
