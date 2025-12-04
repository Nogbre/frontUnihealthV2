import { STORAGE_KEYS, loadFromStorage, saveToStorage, initialAppointments, initialPatients } from './mockData';

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

const serviceTypes = [
    { id: 1, name: 'Consulta General' },
    { id: 2, name: 'Urgencias' },
    { id: 3, name: 'Consulta de Especialidad' },
    { id: 4, name: 'Control/Seguimiento' },
    { id: 5, name: 'Vacunación' }
];

class MockAppointmentsService {
    getAll(): Promise<Appointment[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);

                // Enrich with patient data
                const enriched = appointments.map(apt => ({
                    ...apt,
                    patient: patients.find(p => p.id === apt.patientId),
                    serviceType: serviceTypes.find(st => st.id === apt.serviceTypeId)
                }));

                resolve(enriched);
            }, 300);
        });
    }

    getById(id: number): Promise<Appointment> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);

                const appointment = appointments.find(a => a.id === id);
                if (appointment) {
                    resolve({
                        ...appointment,
                        patient: patients.find(p => p.id === appointment.patientId),
                        serviceType: serviceTypes.find(st => st.id === appointment.serviceTypeId)
                    });
                } else {
                    reject(new Error('Appointment not found'));
                }
            }, 300);
        });
    }

    create(data: CreateAppointmentDto): Promise<Appointment> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);
                const newId = Math.max(...appointments.map(a => a.id), 0) + 1;

                const newAppointment: Appointment = {
                    id: newId,
                    patientId: data.patientId,
                    nurseId: data.nurseId,
                    serviceTypeId: data.serviceTypeId,
                    start: data.start,
                    end: data.end,
                    status: 'pendiente',
                    reason: data.reason,
                    patient: patients.find(p => p.id === data.patientId),
                    serviceType: serviceTypes.find(st => st.id === data.serviceTypeId)
                };

                appointments.push(newAppointment);
                saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
                resolve(newAppointment);
            }, 300);
        });
    }

    updateStatus(id: number, status: string): Promise<Appointment> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
                const patients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients);
                const index = appointments.findIndex(a => a.id === id);

                if (index === -1) {
                    reject(new Error('Appointment not found'));
                    return;
                }

                appointments[index].status = status;
                saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

                resolve({
                    ...appointments[index],
                    patient: patients.find(p => p.id === appointments[index].patientId),
                    serviceType: serviceTypes.find(st => st.id === appointments[index].serviceTypeId)
                });
            }, 300);
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
                const filtered = appointments.filter(a => a.id !== id);
                saveToStorage(STORAGE_KEYS.APPOINTMENTS, filtered);
                resolve();
            }, 300);
        });
    }
}

export const mockAppointmentsService = new MockAppointmentsService();
