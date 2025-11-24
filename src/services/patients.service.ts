import { apiService } from './api';

export interface Patient {
  id: number;
  email: string;
  patientProfile?: {
    userId: number;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    phone?: string;
  };
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob: string;
  gender: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  phone?: string;
}

export const patientsService = {
  async getAll(): Promise<Patient[]> {
    try {
      return await apiService.get<Patient[]>('/patients');
    } catch (error) {
      console.warn('⚠️ Using mock patients data');
      return [
        {
          id: 1,
          email: 'maria.garcia@email.com',
          patientProfile: {
            userId: 1,
            firstName: 'María',
            lastName: 'García López',
            dob: '1985-03-15',
            gender: 'F',
            phone: '+57 300 123 4567',
          },
        },
        {
          id: 2,
          email: 'carlos.rodriguez@email.com',
          patientProfile: {
            userId: 2,
            firstName: 'Carlos',
            lastName: 'Rodríguez Martínez',
            dob: '1978-07-22',
            gender: 'M',
            phone: '+57 310 987 6543',
          },
        },
        {
          id: 3,
          email: 'ana.martinez@email.com',
          patientProfile: {
            userId: 3,
            firstName: 'Ana',
            lastName: 'Martínez Sánchez',
            dob: '1992-11-08',
            gender: 'F',
            phone: '+57 320 456 7890',
          },
        },
        {
          id: 4,
          email: 'juan.perez@email.com',
          patientProfile: {
            userId: 4,
            firstName: 'Juan',
            lastName: 'Pérez Gómez',
            dob: '1965-05-30',
            gender: 'M',
            phone: '+57 315 789 0123',
          },
        },
        {
          id: 5,
          email: 'sofia.lopez@email.com',
          patientProfile: {
            userId: 5,
            firstName: 'Sofía',
            lastName: 'López Hernández',
            dob: '2000-01-12',
            gender: 'F',
            phone: '+57 305 234 5678',
          },
        },
      ];
    }
  },

  async getById(id: number): Promise<Patient> {
    try {
      return await apiService.get<Patient>(`/patients/${id}`);
    } catch (error) {
      console.warn('⚠️ Using mock patient data');
      return {
        id,
        email: 'maria.garcia@email.com',
        patientProfile: {
          userId: id,
          firstName: 'María',
          lastName: 'García López',
          dob: '1985-03-15',
          gender: 'F',
          phone: '+57 300 123 4567',
        },
      };
    }
  },

  async create(data: CreatePatientDto): Promise<Patient> {
    try {
      return await apiService.post<Patient>('/patients', data);
    } catch (error) {
      console.warn('⚠️ Mock patient created');
      return {
        id: Math.floor(Math.random() * 1000),
        email: data.email || 'new.patient@email.com',
        patientProfile: {
          userId: Math.floor(Math.random() * 1000),
          firstName: data.firstName,
          lastName: data.lastName,
          dob: data.dob,
          gender: data.gender,
          phone: data.phone,
        },
      };
    }
  },

  async update(id: number, data: UpdatePatientDto): Promise<Patient> {
    try {
      return await apiService.patch<Patient>(`/patients/${id}`, data);
    } catch (error) {
      console.warn('⚠️ Mock patient updated');
      return {
        id,
        email: 'updated.patient@email.com',
        patientProfile: {
          userId: id,
          firstName: data.firstName || 'Updated',
          lastName: data.lastName || 'Patient',
          dob: data.dob || '1990-01-01',
          gender: data.gender || 'M',
          phone: data.phone,
        },
      };
    }
  },

  async delete(id: number): Promise<void> {
    try {
      return await apiService.delete<void>(`/patients/${id}`);
    } catch (error) {
      console.warn('⚠️ Mock patient deleted');
      return;
    }
  },
};

