import { apiService } from './api';

export interface Kiosk {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  phone: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  staff?: Array<{
    userId: string;
    assignedAt: string;
  }>;
  _count?: {
    appointments: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface NearbyKiosk {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
}

export interface KioskStaffMember {
  userId: string;
  assignedAt: string;
  user?: {
    id: string;
    email: string;
    nurseProfile?: {
      firstName: string;
      lastName: string;
      specialization: string;
    };
    doctorProfile?: {
      firstName: string;
      lastName: string;
      specialization: string;
    };
  };
}

export interface CreateKioskDto {
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  openTime: string;
  closeTime: string;
}

/**
 * Kiosk management service
 */
export const kioskService = {
  /**
   * Get all kiosks
   */
  async getAll(): Promise<Kiosk[]> {
    try {
      console.log('🏥 KIOSKS - Fetching all');
      const response = await apiService.get<Kiosk[]>('/kiosks');
      console.log('✅ KIOSKS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ KIOSKS - Error fetching:', error);
      throw error;
    }
  },

  /**
   * Get nearby kiosks based on user location
   */
  async getNearby(lat: number, lng: number, radius: number = 10): Promise<NearbyKiosk[]> {
    try {
      console.log('📍 KIOSKS - Fetching nearby:', { lat, lng, radius });
      const response = await apiService.get<NearbyKiosk[]>(
        `/kiosks/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      console.log('✅ KIOSKS - Nearby found:', response);
      return response;
    } catch (error) {
      console.error('❌ KIOSKS - Error fetching nearby:', error);
      throw error;
    }
  },

  /**
   * Get kiosk by ID
   */
  async getById(id: string): Promise<Kiosk> {
    try {
      console.log('🏥 KIOSK - Fetching by ID:', id);
      const response = await apiService.get<Kiosk>(`/kiosks/${id}`);
      console.log('✅ KIOSK - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ KIOSK - Error fetching:', error);
      throw error;
    }
  },

  /**
   * Create new kiosk (Admin only)
   */
  async create(data: CreateKioskDto): Promise<Kiosk> {
    try {
      console.log('➕ KIOSK - Creating:', data);
      const response = await apiService.post<Kiosk>('/kiosks', data);
      console.log('✅ KIOSK - Created:', response);
      return response;
    } catch (error) {
      console.error('❌ KIOSK - Error creating:', error);
      throw error;
    }
  },

  /**
   * Update kiosk information
   */
  async update(id: string, data: Partial<CreateKioskDto>): Promise<Kiosk> {
    try {
      console.log('📝 KIOSK - Updating:', id, data);
      const response = await apiService.patch<Kiosk>(`/kiosks/${id}`, data);
      console.log('✅ KIOSK - Updated:', response);
      return response;
    } catch (error) {
      console.error('❌ KIOSK - Error updating:', error);
      throw error;
    }
  },

  /**
   * Get kiosk staff
   */
  async getStaff(kioskId: string): Promise<KioskStaffMember[]> {
    try {
      console.log('👥 KIOSK STAFF - Fetching for kiosk:', kioskId);
      const response = await apiService.get<KioskStaffMember[]>(`/kiosks/${kioskId}/staff`);
      console.log('✅ KIOSK STAFF - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ KIOSK STAFF - Error fetching:', error);
      // Return empty array as fallback
      return [];
    }
  },

  /**
   * Assign staff member to kiosk
   */
  async assignStaff(kioskId: string, userId: number): Promise<void> {
    try {
      console.log('➕ KIOSK STAFF - Assigning:', { kioskId, userId });
      await apiService.post(`/kiosks/${kioskId}/staff`, { userId });
      console.log('✅ KIOSK STAFF - Assigned');
    } catch (error) {
      console.error('❌ KIOSK STAFF - Error assigning:', error);
      throw error;
    }
  },

  /**
   * Remove staff member from kiosk
   */
  async removeStaff(kioskId: string, userId: string): Promise<void> {
    try {
      console.log('➖ KIOSK STAFF - Removing:', { kioskId, userId });
      await apiService.delete(`/kiosks/${kioskId}/staff/${userId}`);
      console.log('✅ KIOSK STAFF - Removed');
    } catch (error) {
      console.error('❌ KIOSK STAFF - Error removing:', error);
      throw error;
    }
  }
};
