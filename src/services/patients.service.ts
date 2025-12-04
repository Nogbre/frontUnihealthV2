import { mockPatientsService, Patient, CreatePatientDto } from './mock/mockPatients.service';

export type { Patient, CreatePatientDto };

export const patientsService = {
  async getAll(): Promise<Patient[]> {
    return await mockPatientsService.getAll();
  },

  async getById(id: number): Promise<Patient> {
    return await mockPatientsService.getById(id);
  },

  async create(data: CreatePatientDto): Promise<Patient> {
    return await mockPatientsService.create(data);
  },

  async update(id: number, data: Partial<CreatePatientDto>): Promise<Patient> {
    return await mockPatientsService.update(id, data);
  },

  async delete(id: number): Promise<void> {
    return await mockPatientsService.delete(id);
  },
};
