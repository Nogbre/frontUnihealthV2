import { mockAppointmentsService, Appointment, CreateAppointmentDto } from './mock/mockAppointments.service';

export type { Appointment, CreateAppointmentDto };

export interface UpdateAppointmentDto {
  status?: string;
}

export const appointmentsService = {
  async getAll(): Promise<Appointment[]> {
    return await mockAppointmentsService.getAll();
  },

  async getById(id: number): Promise<Appointment> {
    return await mockAppointmentsService.getById(id);
  },

  async create(data: CreateAppointmentDto): Promise<Appointment> {
    return await mockAppointmentsService.create(data);
  },

  async updateStatus(id: number, status: string): Promise<Appointment> {
    return await mockAppointmentsService.updateStatus(id, status);
  },

  async delete(id: number): Promise<void> {
    return await mockAppointmentsService.delete(id);
  },
};

