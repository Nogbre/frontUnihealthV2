import { mockAlertsService, Alert, CreateAlertDto } from './mock/mockAlerts.service';

export type { Alert, CreateAlertDto };

export const alertsService = {
  async getAll(): Promise<Alert[]> {
    return await mockAlertsService.getAll();
  },

  async getById(id: number): Promise<Alert> {
    return await mockAlertsService.getById(id);
  },

  async create(data: CreateAlertDto): Promise<Alert> {
    return await mockAlertsService.create(data);
  },

  async updateStatus(id: number, status: string): Promise<Alert> {
    return await mockAlertsService.updateStatus(id, status);
  },

  async delete(id: number): Promise<void> {
    return await mockAlertsService.delete(id);
  },
};
