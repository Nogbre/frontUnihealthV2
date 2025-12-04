import { apiService } from './api';

// ============================================
// MEDICAL HISTORY TYPES
// ============================================

export interface MedicalHistory {
  id: string;
  patientId: string;
  condition: string;
  diagnosis?: string;
  treatment?: string;
  diagnosedAt?: string;
  type: 'fisico' | 'mental';
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalHistoryDto {
  patientId: number;
  condition: string;
  diagnosis?: string;
  treatment?: string;
  diagnosedAt?: string;
  type: 'fisico' | 'mental';
  notes?: string;
}

export interface UpdateMedicalHistoryDto {
  condition?: string;
  diagnosis?: string;
  treatment?: string;
  diagnosedAt?: string;
  type?: 'fisico' | 'mental';
  isActive?: boolean;
  notes?: string;
}

export interface MedicalHistoryPagination {
  items: MedicalHistory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MedicalHistoryQueryParams {
  page?: number;
  limit?: number;
  type?: 'fisico' | 'mental';
  isActive?: boolean;
  sortBy?: 'createdAt' | 'diagnosedAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

// ============================================
// ALLERGY TYPES
// ============================================

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
  createdAt: string;
}

export interface CreateAllergyDto {
  patientId: number;
  allergen: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface UpdateAllergyDto {
  allergen?: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

// ============================================
// MEDICATION TYPES
// ============================================

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationDto {
  patientId: number;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface UpdateMedicationDto {
  name?: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  notes?: string;
}

// ============================================
// FAMILY HISTORY TYPES
// ============================================

export interface FamilyHistory {
  id: string;
  patientId: string;
  relationship: string;
  condition: string;
  notes?: string;
  createdAt: string;
}

export interface CreateFamilyHistoryDto {
  patientId: number;
  relationship: string;
  condition: string;
  notes?: string;
}

export interface UpdateFamilyHistoryDto {
  relationship?: string;
  condition?: string;
  notes?: string;
}

// ============================================
// LIFESTYLE TYPES
// ============================================

export interface Lifestyle {
  id: string;
  patientId: string;
  diet?: string;
  sleepHours?: number;
  stressLevel?: number;
  activityType?: string;
  activityFreq?: string;
  tobacco?: string;
  alcohol?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLifestyleDto {
  patientId: number;
  diet?: string;
  sleepHours?: number;
  stressLevel?: number;
  activityType?: string;
  activityFreq?: string;
  tobacco?: string;
  alcohol?: string;
}

export interface UpdateLifestyleDto {
  diet?: string;
  sleepHours?: number;
  stressLevel?: number;
  activityType?: string;
  activityFreq?: string;
  tobacco?: string;
  alcohol?: string;
  notes?: string;
}

// ============================================
// FULL HISTORY TYPE
// ============================================

export interface FullMedicalHistory {
  history: MedicalHistory[];
  allergies: Allergy[];
  medications: Medication[];
  familyHistory: FamilyHistory[];
  lifestyle: Lifestyle | null;
}

// ============================================
// MEDICAL HISTORY SERVICE
// ============================================

export const medicalHistoryService = {
  // Medical History endpoints
  async create(data: CreateMedicalHistoryDto): Promise<MedicalHistory> {
    console.log('➕ MEDICAL HISTORY - Creating:', data);
    try {
      const response = await apiService.post<MedicalHistory>('/medical-history', data);
      console.log('✅ MEDICAL HISTORY - Created:', response);
      return response;
    } catch (error) {
      console.error('❌ MEDICAL HISTORY - Error creating:', error);
      throw error;
    }
  },

  async getByPatient(
    patientId: number,
    params?: MedicalHistoryQueryParams
  ): Promise<MedicalHistoryPagination> {
    console.log('📋 MEDICAL HISTORY - Fetching for patient:', patientId, params);
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/medical-history/patient/${patientId}${queryString ? `?${queryString}` : ''}`;
      const response = await apiService.get<MedicalHistoryPagination>(url);
      console.log('✅ MEDICAL HISTORY - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ MEDICAL HISTORY - Error fetching:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<MedicalHistory> {
    console.log('🔍 MEDICAL HISTORY - Fetching by id:', id);
    try {
      const response = await apiService.get<MedicalHistory>(`/medical-history/${id}`);
      console.log('✅ MEDICAL HISTORY - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ MEDICAL HISTORY - Error fetching:', error);
      throw error;
    }
  },

  async update(id: number, data: UpdateMedicalHistoryDto): Promise<MedicalHistory> {
    console.log('📝 MEDICAL HISTORY - Updating:', id, data);
    try {
      const response = await apiService.patch<MedicalHistory>(`/medical-history/${id}`, data);
      console.log('✅ MEDICAL HISTORY - Updated:', response);
      return response;
    } catch (error) {
      console.error('❌ MEDICAL HISTORY - Error updating:', error);
      throw error;
    }
  },

  async deactivate(id: number): Promise<MedicalHistory> {
    console.log('⏸️ MEDICAL HISTORY - Deactivating:', id);
    try {
      const response = await apiService.patch<MedicalHistory>(
        `/medical-history/${id}/deactivate`,
        {}
      );
      console.log('✅ MEDICAL HISTORY - Deactivated:', response);
      return response;
    } catch (error) {
      console.error('❌ MEDICAL HISTORY - Error deactivating:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    console.log('🗑️ MEDICAL HISTORY - Deleting:', id);
    try {
      await apiService.delete<void>(`/medical-history/${id}`);
      console.log('✅ MEDICAL HISTORY - Deleted');
    } catch (error) {
      console.error('❌ MEDICAL HISTORY - Error deleting:', error);
      throw error;
    }
  },

  // Allergies endpoints
  allergies: {
    async create(data: CreateAllergyDto): Promise<Allergy> {
      console.log('➕ ALLERGIES - Creating:', data);
      try {
        const response = await apiService.post<Allergy>('/medical-history/allergies', data);
        console.log('✅ ALLERGIES - Created:', response);
        return response;
      } catch (error) {
        console.error('❌ ALLERGIES - Error creating:', error);
        throw error;
      }
    },

    async getByPatient(patientId: number): Promise<Allergy[]> {
      console.log('📋 ALLERGIES - Fetching for patient:', patientId);
      try {
        const response = await apiService.get<Allergy[]>(
          `/medical-history/allergies/patient/${patientId}`
        );
        console.log('✅ ALLERGIES - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ ALLERGIES - Error fetching:', error);
        throw error;
      }
    },

    async getById(id: number): Promise<Allergy> {
      console.log('🔍 ALLERGIES - Fetching by id:', id);
      try {
        const response = await apiService.get<Allergy>(`/medical-history/allergies/${id}`);
        console.log('✅ ALLERGIES - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ ALLERGIES - Error fetching:', error);
        throw error;
      }
    },

    async update(id: number, data: UpdateAllergyDto): Promise<Allergy> {
      console.log('📝 ALLERGIES - Updating:', id, data);
      try {
        const response = await apiService.patch<Allergy>(
          `/medical-history/allergies/${id}`,
          data
        );
        console.log('✅ ALLERGIES - Updated:', response);
        return response;
      } catch (error) {
        console.error('❌ ALLERGIES - Error updating:', error);
        throw error;
      }
    },

    async delete(id: number): Promise<void> {
      console.log('🗑️ ALLERGIES - Deleting:', id);
      try {
        await apiService.delete<void>(`/medical-history/allergies/${id}`);
        console.log('✅ ALLERGIES - Deleted');
      } catch (error) {
        console.error('❌ ALLERGIES - Error deleting:', error);
        throw error;
      }
    },
  },

  // Medications endpoints
  medications: {
    async create(data: CreateMedicationDto): Promise<Medication> {
      console.log('➕ MEDICATIONS - Creating:', data);
      try {
        const response = await apiService.post<Medication>('/medical-history/medications', data);
        console.log('✅ MEDICATIONS - Created:', response);
        return response;
      } catch (error) {
        console.error('❌ MEDICATIONS - Error creating:', error);
        throw error;
      }
    },

    async getByPatient(patientId: number): Promise<Medication[]> {
      console.log('📋 MEDICATIONS - Fetching for patient:', patientId);
      try {
        const response = await apiService.get<Medication[]>(
          `/medical-history/medications/patient/${patientId}`
        );
        console.log('✅ MEDICATIONS - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ MEDICATIONS - Error fetching:', error);
        throw error;
      }
    },

    async getActiveByPatient(patientId: number): Promise<Medication[]> {
      console.log('📋 MEDICATIONS - Fetching active for patient:', patientId);
      try {
        const response = await apiService.get<Medication[]>(
          `/medical-history/medications/patient/${patientId}/active`
        );
        console.log('✅ MEDICATIONS - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ MEDICATIONS - Error fetching active:', error);
        throw error;
      }
    },

    async getById(id: number): Promise<Medication> {
      console.log('🔍 MEDICATIONS - Fetching by id:', id);
      try {
        const response = await apiService.get<Medication>(`/medical-history/medications/${id}`);
        console.log('✅ MEDICATIONS - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ MEDICATIONS - Error fetching:', error);
        throw error;
      }
    },

    async update(id: number, data: UpdateMedicationDto): Promise<Medication> {
      console.log('📝 MEDICATIONS - Updating:', id, data);
      try {
        const response = await apiService.patch<Medication>(
          `/medical-history/medications/${id}`,
          data
        );
        console.log('✅ MEDICATIONS - Updated:', response);
        return response;
      } catch (error) {
        console.error('❌ MEDICATIONS - Error updating:', error);
        throw error;
      }
    },

    async deactivate(id: number): Promise<Medication> {
      console.log('⏸️ MEDICATIONS - Deactivating:', id);
      try {
        const response = await apiService.patch<Medication>(
          `/medical-history/medications/${id}/deactivate`,
          {}
        );
        console.log('✅ MEDICATIONS - Deactivated:', response);
        return response;
      } catch (error) {
        console.error('❌ MEDICATIONS - Error deactivating:', error);
        throw error;
      }
    },

    async delete(id: number): Promise<void> {
      console.log('🗑️ MEDICATIONS - Deleting:', id);
      try {
        await apiService.delete<void>(`/medical-history/medications/${id}`);
        console.log('✅ MEDICATIONS - Deleted');
      } catch (error) {
        console.error('❌ MEDICATIONS - Error deleting:', error);
        throw error;
      }
    },
  },

  // Family History endpoints
  familyHistory: {
    async create(data: CreateFamilyHistoryDto): Promise<FamilyHistory> {
      console.log('➕ FAMILY HISTORY - Creating:', data);
      try {
        const response = await apiService.post<FamilyHistory>(
          '/medical-history/family-history',
          data
        );
        console.log('✅ FAMILY HISTORY - Created:', response);
        return response;
      } catch (error) {
        console.error('❌ FAMILY HISTORY - Error creating:', error);
        throw error;
      }
    },

    async getByPatient(patientId: number): Promise<FamilyHistory[]> {
      console.log('📋 FAMILY HISTORY - Fetching for patient:', patientId);
      try {
        const response = await apiService.get<FamilyHistory[]>(
          `/medical-history/family-history/patient/${patientId}`
        );
        console.log('✅ FAMILY HISTORY - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ FAMILY HISTORY - Error fetching:', error);
        throw error;
      }
    },

    async getById(id: number): Promise<FamilyHistory> {
      console.log('🔍 FAMILY HISTORY - Fetching by id:', id);
      try {
        const response = await apiService.get<FamilyHistory>(
          `/medical-history/family-history/${id}`
        );
        console.log('✅ FAMILY HISTORY - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ FAMILY HISTORY - Error fetching:', error);
        throw error;
      }
    },

    async update(id: number, data: UpdateFamilyHistoryDto): Promise<FamilyHistory> {
      console.log('📝 FAMILY HISTORY - Updating:', id, data);
      try {
        const response = await apiService.patch<FamilyHistory>(
          `/medical-history/family-history/${id}`,
          data
        );
        console.log('✅ FAMILY HISTORY - Updated:', response);
        return response;
      } catch (error) {
        console.error('❌ FAMILY HISTORY - Error updating:', error);
        throw error;
      }
    },

    async delete(id: number): Promise<void> {
      console.log('🗑️ FAMILY HISTORY - Deleting:', id);
      try {
        await apiService.delete<void>(`/medical-history/family-history/${id}`);
        console.log('✅ FAMILY HISTORY - Deleted');
      } catch (error) {
        console.error('❌ FAMILY HISTORY - Error deleting:', error);
        throw error;
      }
    },
  },

  // Lifestyle endpoints
  lifestyle: {
    async create(data: CreateLifestyleDto): Promise<Lifestyle> {
      console.log('➕ LIFESTYLE - Creating:', data);
      try {
        const response = await apiService.post<Lifestyle>('/medical-history/lifestyle', data);
        console.log('✅ LIFESTYLE - Created:', response);
        return response;
      } catch (error) {
        console.error('❌ LIFESTYLE - Error creating:', error);
        throw error;
      }
    },

    async getByPatient(patientId: number): Promise<Lifestyle | null> {
      console.log('📋 LIFESTYLE - Fetching for patient:', patientId);
      try {
        const response = await apiService.get<Lifestyle | null>(
          `/medical-history/lifestyle/patient/${patientId}`
        );
        console.log('✅ LIFESTYLE - Success:', response);
        return response;
      } catch (error) {
        console.error('❌ LIFESTYLE - Error fetching:', error);
        throw error;
      }
    },

    async update(id: number, data: UpdateLifestyleDto): Promise<Lifestyle> {
      console.log('📝 LIFESTYLE - Updating:', id, data);
      try {
        const response = await apiService.patch<Lifestyle>(
          `/medical-history/lifestyle/${id}`,
          data
        );
        console.log('✅ LIFESTYLE - Updated:', response);
        return response;
      } catch (error) {
        console.error('❌ LIFESTYLE - Error updating:', error);
        throw error;
      }
    },

    async delete(id: number): Promise<void> {
      console.log('🗑️ LIFESTYLE - Deleting:', id);
      try {
        await apiService.delete<void>(`/medical-history/lifestyle/${id}`);
        console.log('✅ LIFESTYLE - Deleted');
      } catch (error) {
        console.error('❌ LIFESTYLE - Error deleting:', error);
        throw error;
      }
    },
  },

  // Full History endpoint
  async getFullHistory(patientId: number): Promise<FullMedicalHistory> {
    console.log('📚 FULL HISTORY - Fetching for patient:', patientId);
    try {
      const response = await apiService.get<FullMedicalHistory>(
        `/medical-history/full/${patientId}`
      );
      console.log('✅ FULL HISTORY - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ FULL HISTORY - Error fetching:', error);
      throw error;
    }
  },
};
