import { STORAGE_KEYS, loadFromStorage, saveToStorage, initialAlerts, initialPatients } from './mockData';

export interface Alert {
    id: number;
    patientId: number;
    typeId: number;
    latitude: number;
    longitude: number;
    description: string;
    status: string;
    createdAt: string;
    patient?: any;
    alertType?: any;
}

export interface CreateAlertDto {
    patientId: number;
    alertTypeId: number;
    latitude: number;
    longitude: number;
    description: string;
}

const alertTypes = [
    { id: 1, name: 'Caída Detectada' },
    { id: 2, name: 'Signos Vitales Anormales' },
    { id: 3, name: 'Emergencia Médica' },
    { id: 4, name: 'Recordatorio de Medicación' }
];

class MockAlertsService {
    getAll(): Promise<Alert[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const alerts = loadFromStorage<Alert[]>(STORAGE_KEYS.ALERTS, initialAlerts);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);

                const enriched = alerts.map(alert => ({
                    ...alert,
                    patient: patients.find(p => p.id === alert.patientId),
                    alertType: alertTypes.find(at => at.id === alert.typeId)
                }));

                resolve(enriched);
            }, 300);
        });
    }

    getById(id: number): Promise<Alert> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const alerts = loadFromStorage<Alert[]>(STORAGE_KEYS.ALERTS, initialAlerts);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);

                const alert = alerts.find(a => a.id === id);
                if (alert) {
                    resolve({
                        ...alert,
                        patient: patients.find(p => p.id === alert.patientId),
                        alertType: alertTypes.find(at => at.id === alert.typeId)
                    });
                } else {
                    reject(new Error('Alert not found'));
                }
            }, 300);
        });
    }

    create(data: CreateAlertDto): Promise<Alert> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const alerts = loadFromStorage<Alert[]>(STORAGE_KEYS.ALERTS, initialAlerts);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);
                const newId = Math.max(...alerts.map(a => a.id), 0) + 1;

                const newAlert: Alert = {
                    id: newId,
                    patientId: data.patientId,
                    typeId: data.alertTypeId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    description: data.description,
                    status: 'pendiente',
                    createdAt: new Date().toISOString(),
                    patient: patients.find(p => p.id === data.patientId),
                    alertType: alertTypes.find(at => at.id === data.alertTypeId)
                };

                alerts.push(newAlert);
                saveToStorage(STORAGE_KEYS.ALERTS, alerts);
                resolve(newAlert);
            }, 300);
        });
    }

    updateStatus(id: number, status: string): Promise<Alert> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const alerts = loadFromStorage<Alert[]>(STORAGE_KEYS.ALERTS, initialAlerts);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);
                const index = alerts.findIndex(a => a.id === id);

                if (index === -1) {
                    reject(new Error('Alert not found'));
                    return;
                }

                alerts[index].status = status;
                saveToStorage(STORAGE_KEYS.ALERTS, alerts);

                resolve({
                    ...alerts[index],
                    patient: patients.find(p => p.id === alerts[index].patientId),
                    alertType: alertTypes.find(at => at.id === alerts[index].typeId)
                });
            }, 300);
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const alerts = loadFromStorage<Alert[]>(STORAGE_KEYS.ALERTS, initialAlerts);
                const filtered = alerts.filter(a => a.id !== id);
                saveToStorage(STORAGE_KEYS.ALERTS, filtered);
                resolve();
            }, 300);
        });
    }
}

export const mockAlertsService = new MockAlertsService();
