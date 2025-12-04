import { STORAGE_KEYS, loadFromStorage, saveToStorage, initialPatients } from './mockData';

export interface Patient {
    id: number;
    email: string;
    role?: { id: number; name: string };
    patientProfile?: {
        id: number;
        firstName: string;
        lastName: string;
        dob: string;
        gender: string;
        phone: string;
        address?: string;
        emergencyContact?: string;
    };
}

export interface CreatePatientDto {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address?: string;
    emergencyContact?: string;
}

class MockPatientsService {
    getAll(): Promise<Patient[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const patients = loadFromStorage<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
                resolve(patients);
            }, 300);
        });
    }

    getById(id: number): Promise<Patient> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const patients = loadFromStorage<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
                const patient = patients.find(p => p.id === id);
                if (patient) {
                    resolve(patient);
                } else {
                    reject(new Error('Patient not found'));
                }
            }, 300);
        });
    }

    create(data: CreatePatientDto): Promise<Patient> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const patients = loadFromStorage<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
                const newId = Math.max(...patients.map(p => p.id), 0) + 1;

                const newPatient: Patient = {
                    id: newId,
                    email: data.email,
                    role: { id: 1, name: 'user' },
                    patientProfile: {
                        id: newId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        dob: data.dob,
                        gender: data.gender,
                        phone: data.phone,
                        address: data.address,
                        emergencyContact: data.emergencyContact
                    }
                };

                patients.push(newPatient);
                saveToStorage(STORAGE_KEYS.PATIENTS, patients);
                resolve(newPatient);
            }, 300);
        });
    }

    update(id: number, data: Partial<CreatePatientDto>): Promise<Patient> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const patients = loadFromStorage<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
                const index = patients.findIndex(p => p.id === id);

                if (index === -1) {
                    reject(new Error('Patient not found'));
                    return;
                }

                const patient = patients[index];
                if (patient.patientProfile) {
                    patient.patientProfile = {
                        ...patient.patientProfile,
                        ...data
                    };
                }
                if (data.email) {
                    patient.email = data.email;
                }

                patients[index] = patient;
                saveToStorage(STORAGE_KEYS.PATIENTS, patients);
                resolve(patient);
            }, 300);
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const patients = loadFromStorage<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
                const filtered = patients.filter(p => p.id !== id);
                saveToStorage(STORAGE_KEYS.PATIENTS, filtered);
                resolve();
            }, 300);
        });
    }
}

export const mockPatientsService = new MockPatientsService();
