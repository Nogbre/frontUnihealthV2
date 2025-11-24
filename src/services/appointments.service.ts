import { apiService } from './api';

export interface Appointment {
  id: number;
  patientId: number;
  nurseId: number;
  serviceTypeId: number;
  start: string;
  end: string;
  status: string;
  reason?: string;
  patient?: any;
  nurse?: any;
  serviceType?: any;
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
    try {
      return await apiService.get<Appointment[]>('/appointments');
    } catch (error) {
      console.warn('⚠️ Using mock appointments data');
      const now = new Date();
      return [
        {
          id: 1,
          patientId: 1,
          nurseId: 10,
          serviceTypeId: 1,
          start: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          end: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
          status: 'confirmada',
          reason: 'Control de presión arterial',
          patient: { id: 1, email: 'maria.garcia@email.com', patientProfile: { firstName: 'María', lastName: 'García' } },
          nurse: { id: 10, email: 'enfermera1@unihealth.com' },
          serviceType: { id: 1, name: 'Control de Signos Vitales' },
        },
        {
          id: 2,
          patientId: 2,
          nurseId: 10,
          serviceTypeId: 2,
          start: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(),
          status: 'solicitada',
          reason: 'Toma de glucosa',
          patient: { id: 2, email: 'carlos.rodriguez@email.com', patientProfile: { firstName: 'Carlos', lastName: 'Rodríguez' } },
          nurse: { id: 10, email: 'enfermera1@unihealth.com' },
          serviceType: { id: 2, name: 'Toma de Muestras' },
        },
        {
          id: 3,
          patientId: 3,
          nurseId: 11,
          serviceTypeId: 1,
          start: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          end: new Date(now.getTime() + 49 * 60 * 60 * 1000).toISOString(),
          status: 'confirmada',
          reason: 'Revisión post-operatoria',
          patient: { id: 3, email: 'ana.martinez@email.com', patientProfile: { firstName: 'Ana', lastName: 'Martínez' } },
          nurse: { id: 11, email: 'enfermera2@unihealth.com' },
          serviceType: { id: 1, name: 'Control de Signos Vitales' },
        },
      ];
    }
  },

  async getById(id: number): Promise<Appointment> {
    try {
      return await apiService.get<Appointment>(`/appointments/${id}`);
    } catch (error) {
      console.warn('⚠️ Using mock appointment data');
      const now = new Date();
      return {
        id,
        patientId: 1,
        nurseId: 10,
        serviceTypeId: 1,
        start: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        end: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        status: 'confirmada',
        reason: 'Control de presión arterial',
      };
    }
  },

  async create(data: CreateAppointmentDto): Promise<Appointment> {
    try {
      return await apiService.post<Appointment>('/appointments', data);
    } catch (error) {
      console.warn('⚠️ Mock appointment created');
      return {
        id: Math.floor(Math.random() * 1000),
        ...data,
        status: 'solicitada',
      };
    }
  },

  async updateStatus(id: number, status: string): Promise<Appointment> {
    try {
      return await apiService.patch<Appointment>(`/appointments/${id}/status`, { status });
    } catch (error) {
      console.warn('⚠️ Mock appointment status updated');
      const now = new Date();
      return {
        id,
        patientId: 1,
        nurseId: 10,
        serviceTypeId: 1,
        start: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        end: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        status,
        reason: 'Mock appointment',
      };
    }
  },
};

