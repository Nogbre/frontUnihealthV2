// Mock data store using localStorage for persistence
export const STORAGE_KEYS = {
    PATIENTS: 'unihealth_patients',
    APPOINTMENTS: 'unihealth_appointments',
    ALERTS: 'unihealth_alerts',
    VITALS: 'unihealth_vitals',
    MEDICAL_HISTORY: 'unihealth_medical_history',
    ALLERGIES: 'unihealth_allergies',
    MEDICATIONS: 'unihealth_medications',
};

// Initial mock patients
export const initialPatients = [
    {
        id: 1,
        email: 'juan.perez@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 1,
            firstName: 'Juan',
            lastName: 'Pérez González',
            dob: '1985-03-15',
            gender: 'M',
            phone: '+1234567890',
            address: 'Calle Principal 123, Quito',
            emergencyContact: 'María Pérez - +1234567891'
        }
    },
    {
        id: 2,
        email: 'maria.garcia@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 2,
            firstName: 'María',
            lastName: 'García Rodríguez',
            dob: '1990-07-22',
            gender: 'F',
            phone: '+1234567892',
            address: 'Av. Amazonas 456, Quito',
            emergencyContact: 'Carlos García - +1234567893'
        }
    },
    {
        id: 3,
        email: 'carlos.lopez@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 3,
            firstName: 'Carlos',
            lastName: 'López Martínez',
            dob: '1978-11-30',
            gender: 'M',
            phone: '+1234567894',
            address: 'Calle 10 de Agosto 789, Quito',
            emergencyContact: 'Ana López - +1234567895'
        }
    },
    {
        id: 4,
        email: 'ana.martinez@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 4,
            firstName: 'Ana',
            lastName: 'Martínez Sánchez',
            dob: '1995-05-18',
            gender: 'F',
            phone: '+1234567896',
            address: 'Av. 6 de Diciembre 321, Quito',
            emergencyContact: 'Pedro Martínez - +1234567897'
        }
    },
    {
        id: 5,
        email: 'pedro.sanchez@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 5,
            firstName: 'Pedro',
            lastName: 'Sánchez Torres',
            dob: '1982-09-10',
            gender: 'M',
            phone: '+1234567898',
            address: 'Calle Colón 654, Quito',
            emergencyContact: 'Laura Sánchez - +1234567899'
        }
    },
    {
        id: 6,
        email: 'laura.torres@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 6,
            firstName: 'Laura',
            lastName: 'Torres Ramírez',
            dob: '2000-12-25',
            gender: 'F',
            phone: '+1234567900',
            address: 'Av. Shyris 987, Quito',
            emergencyContact: 'Roberto Torres - +1234567901'
        }
    },
    {
        id: 7,
        email: 'roberto.ramirez@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 7,
            firstName: 'Roberto',
            lastName: 'Ramírez Flores',
            dob: '1970-04-08',
            gender: 'M',
            phone: '+1234567902',
            address: 'Calle Naciones Unidas 147, Quito',
            emergencyContact: 'Isabel Ramírez - +1234567903'
        }
    },
    {
        id: 8,
        email: 'isabel.flores@ejemplo.com',
        role: { id: 1, name: 'user' },
        patientProfile: {
            id: 8,
            firstName: 'Isabel',
            lastName: 'Flores Castro',
            dob: '1988-08-14',
            gender: 'F',
            phone: '+1234567904',
            address: 'Av. Occidental 258, Quito',
            emergencyContact: 'Diego Flores - +1234567905'
        }
    }
];

// Generate appointments with today's dates
export const generateInitialAppointments = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    return [
        {
            id: 1,
            patientId: 1,
            nurseId: 1,
            serviceTypeId: 1,
            start: new Date(year, month, day, 9, 0).toISOString(),
            end: new Date(year, month, day, 9, 30).toISOString(),
            status: 'completada',
            reason: 'Control de presión arterial',
            patient: initialPatients[0],
            serviceType: { id: 1, name: 'Consulta General' }
        },
        {
            id: 2,
            patientId: 2,
            nurseId: 1,
            serviceTypeId: 4,
            start: new Date(year, month, day, 10, 30).toISOString(),
            end: new Date(year, month, day, 11, 0).toISOString(),
            status: 'confirmada',
            reason: 'Control mensual de diabetes',
            patient: initialPatients[1],
            serviceType: { id: 4, name: 'Control/Seguimiento' }
        },
        {
            id: 3,
            patientId: 3,
            nurseId: 1,
            serviceTypeId: 1,
            start: new Date(year, month, day, 13, 0).toISOString(),
            end: new Date(year, month, day, 13, 30).toISOString(),
            status: 'confirmada',
            reason: 'Chequeo general',
            patient: initialPatients[2],
            serviceType: { id: 1, name: 'Consulta General' }
        },
        {
            id: 4,
            patientId: 4,
            nurseId: 1,
            serviceTypeId: 5,
            start: new Date(year, month, day, 14, 30).toISOString(),
            end: new Date(year, month, day, 15, 0).toISOString(),
            status: 'pendiente',
            reason: 'Vacuna anual contra la gripe',
            patient: initialPatients[3],
            serviceType: { id: 5, name: 'Vacunación' }
        },
        {
            id: 5,
            patientId: 5,
            nurseId: 1,
            serviceTypeId: 2,
            start: new Date(year, month, day, 16, 0).toISOString(),
            end: new Date(year, month, day, 16, 30).toISOString(),
            status: 'pendiente',
            reason: 'Seguimiento de tratamiento',
            patient: initialPatients[4],
            serviceType: { id: 2, name: 'Urgencias' }
        },
        {
            id: 6,
            patientId: 6,
            nurseId: 1,
            serviceTypeId: 1,
            start: new Date(year, month, day + 1, 10, 0).toISOString(),
            end: new Date(year, month, day + 1, 10, 30).toISOString(),
            status: 'confirmada',
            reason: 'Consulta de seguimiento',
            patient: initialPatients[5],
            serviceType: { id: 1, name: 'Consulta General' }
        },
        {
            id: 7,
            patientId: 7,
            nurseId: 1,
            serviceTypeId: 4,
            start: new Date(year, month, day + 2, 11, 0).toISOString(),
            end: new Date(year, month, day + 2, 11, 30).toISOString(),
            status: 'confirmada',
            reason: 'Control de rutina',
            patient: initialPatients[6],
            serviceType: { id: 4, name: 'Control/Seguimiento' }
        }
    ];
};

export const initialAppointments = generateInitialAppointments();

// Initial alerts
export const initialAlerts = [
    {
        id: 1,
        patientId: 1,
        typeId: 2,
        latitude: -0.1807,
        longitude: -78.4678,
        description: 'Presión arterial elevada detectada - 160/95',
        status: 'pendiente',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        patient: initialPatients[0],
        alertType: { id: 2, name: 'Signos Vitales Anormales' }
    },
    {
        id: 2,
        patientId: 3,
        typeId: 1,
        latitude: -0.1905,
        longitude: -78.4812,
        description: 'Paciente reporta caída en su domicilio',
        status: 'en curso',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        patient: initialPatients[2],
        alertType: { id: 1, name: 'Caída Detectada' }
    },
    {
        id: 3,
        patientId: 5,
        typeId: 4,
        latitude: -0.2001,
        longitude: -78.4925,
        description: 'Paciente no ha tomado medicación de 10:00 AM',
        status: 'pendiente',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        patient: initialPatients[4],
        alertType: { id: 4, name: 'Recordatorio de Medicación' }
    },
    {
        id: 4,
        patientId: 7,
        typeId: 3,
        latitude: -0.1750,
        longitude: -78.4500,
        description: 'EMERGENCIA: Paciente con dolor intenso en el pecho',
        status: 'en curso',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        patient: initialPatients[6],
        alertType: { id: 3, name: 'Emergencia Médica' }
    }
];

// Initial vitals
export const initialVitals = [
    {
        id: 1,
        patientId: 1,
        takenById: 1,
        systolic: 145,
        diastolic: 92,
        heartRate: 78,
        temperature: 36.8,
        spo2: 97,
        takenAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        patient: initialPatients[0]
    },
    {
        id: 2,
        patientId: 2,
        takenById: 1,
        systolic: 118,
        diastolic: 76,
        heartRate: 72,
        temperature: 36.5,
        spo2: 99,
        takenAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        patient: initialPatients[1]
    },
    {
        id: 3,
        patientId: 3,
        takenById: 1,
        systolic: 135,
        diastolic: 85,
        heartRate: 82,
        temperature: 37.1,
        spo2: 96,
        takenAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        patient: initialPatients[2]
    }
];

// Helper functions for localStorage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
        return defaultValue;
    }
};

export const saveToStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
    }
};

// Initialize storage on first load
export const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
        saveToStorage(STORAGE_KEYS.PATIENTS, initialPatients);
    }

    // Always regenerate appointments with fresh dates
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, generateInitialAppointments());

    if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
        saveToStorage(STORAGE_KEYS.ALERTS, initialAlerts);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VITALS)) {
        saveToStorage(STORAGE_KEYS.VITALS, initialVitals);
    }
};
