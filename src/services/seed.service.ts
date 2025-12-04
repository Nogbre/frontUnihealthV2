import { apiService } from './api';

export interface SeedProgress {
    step: string;
    status: 'pending' | 'running' | 'success' | 'error';
    message?: string;
}

class SeedService {
    async seedDatabase(onProgress?: (progress: SeedProgress) => void): Promise<void> {
        const steps: SeedProgress[] = [
            { step: 'Creando pacientes', status: 'pending' },
            { step: 'Agregando historia médica', status: 'pending' },
            { step: 'Agregando alergias', status: 'pending' },
            { step: 'Agregando medicamentos', status: 'pending' },
            { step: 'Creando citas', status: 'pending' },
            { step: 'Creando alertas', status: 'pending' },
            { step: 'Registrando signos vitales', status: 'pending' },
        ];

        let currentStepIndex = 0;

        const updateProgress = (status: 'running' | 'success' | 'error', message?: string) => {
            if (onProgress) {
                steps[currentStepIndex].status = status;
                steps[currentStepIndex].message = message;
                onProgress(steps[currentStepIndex]);
            }
        };

        try {
            // Paso 1: Crear pacientes
            updateProgress('running');
            const patientsData = [
                {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    dob: '1985-03-15',
                    gender: 'M',
                    email: 'juan.perasd45ez@ejemplo.com',
                    phone: '+1234567890'
                },
                {
                    firstName: 'María',
                    lastName: 'García',
                    dob: '1990-07-22',
                    gender: 'F',
                    email: 'maria.gaasdasdrc45ia@ejemplo.com',
                    phone: '+1234567891'
                },
                {
                    firstName: 'Carlos',
                    lastName: 'López',
                    dob: '1978-11-30',
                    gender: 'M',
                    email: 'carlos.lo4asdpe5z@ejemplo.com',
                    phone: '+1234567892'
                },
                {
                    firstName: 'Ana',
                    lastName: 'Martínez',
                    dob: '1995-05-18',
                    gender: 'F',
                    email: 'ana.martin4asde5z@ejemplo.com',
                    phone: '+1234567893'
                },
                {
                    firstName: 'Pedro',
                    lastName: 'Sánchez',
                    dob: '1982-09-10',
                    gender: 'M',
                    email: 'pedro.sanc4sadhe5z@ejemplo.com',
                    phone: '+1234567894'
                }
            ];

            const createdPatients = [];
            for (const patientData of patientsData) {
                try {
                    const patient = await apiService.post('/patients', patientData);
                    createdPatients.push(patient);
                } catch (error: any) {
                    // Si el paciente ya existe, continuar
                    if (error.response?.status !== 400) {
                        throw error;
                    }
                }
            }
            updateProgress('success', `${createdPatients.length} pacientes creados`);
            currentStepIndex++;

            // Paso 2: Agregar historia médica
            updateProgress('running');
            const medicalHistoryData = [
                {
                    patientId: createdPatients[0]?.id || 1,
                    condition: 'Hipertensión',
                    diagnosis: 'Confirmada mediante monitoreo de presión arterial',
                    treatment: 'Lisinopril 10mg diario',
                    diagnosedAt: '2023-01-15',
                    type: 'fisico',
                    notes: 'Controlar presión arterial semanalmente'
                },
                {
                    patientId: createdPatients[1]?.id || 2,
                    condition: 'Diabetes Tipo 2',
                    diagnosis: 'Confirmada con prueba de glucosa en ayunas',
                    treatment: 'Metformina 500mg dos veces al día',
                    diagnosedAt: '2022-08-20',
                    type: 'fisico',
                    notes: 'Dieta controlada y ejercicio regular'
                },
                {
                    patientId: createdPatients[2]?.id || 3,
                    condition: 'Asma',
                    diagnosis: 'Asma bronquial confirmada',
                    treatment: 'Salbutamol inhalador según necesidad',
                    diagnosedAt: '2021-06-10',
                    type: 'fisico',
                    notes: 'Evitar ejercicio intenso sin medicación previa'
                },
                {
                    patientId: createdPatients[3]?.id || 4,
                    condition: 'Ansiedad',
                    diagnosis: 'Trastorno de ansiedad generalizada',
                    treatment: 'Terapia cognitivo-conductual',
                    diagnosedAt: '2023-03-10',
                    type: 'mental',
                    notes: 'Sesiones semanales de terapia'
                },
                {
                    patientId: createdPatients[4]?.id || 5,
                    condition: 'Depresión',
                    diagnosis: 'Trastorno depresivo mayor',
                    treatment: 'Sertralina 50mg diario + psicoterapia',
                    diagnosedAt: '2023-05-20',
                    type: 'mental',
                    notes: 'Seguimiento mensual con psiquiatra'
                }
            ];

            let historyCreated = 0;
            for (const historyData of medicalHistoryData) {
                try {
                    await apiService.post('/medical-history', historyData);
                    historyCreated++;
                } catch (error: any) {
                    console.error('Error agregando historia médica:', error);
                }
            }
            updateProgress('success', `${historyCreated} registros de historia médica`);
            currentStepIndex++;

            // Paso 3: Agregar alergias
            updateProgress('running');
            const allergiesData = [
                {
                    patientId: createdPatients[0]?.id || 1,
                    allergen: 'Penicilina',
                    reaction: 'Urticaria y dificultad respiratoria',
                    severity: 'severe',
                    notes: 'Evitar antibióticos betalactámicos'
                },
                {
                    patientId: createdPatients[1]?.id || 2,
                    allergen: 'Maní',
                    reaction: 'Anafilaxia',
                    severity: 'severe',
                    notes: 'Porta EpiPen en todo momento'
                },
                {
                    patientId: createdPatients[2]?.id || 3,
                    allergen: 'Polen',
                    reaction: 'Rinitis alérgica',
                    severity: 'mild',
                    notes: 'Síntomas estacionales en primavera'
                }
            ];

            let allergiesCreated = 0;
            for (const allergyData of allergiesData) {
                try {
                    await apiService.post('/medical-history/allergies', allergyData);
                    allergiesCreated++;
                } catch (error: any) {
                    console.error('Error agregando alergia:', error);
                }
            }
            updateProgress('success', `${allergiesCreated} alergias agregadas`);
            currentStepIndex++;

            // Paso 4: Agregar medicamentos
            updateProgress('running');
            const medicationsData = [
                {
                    patientId: createdPatients[0]?.id || 1,
                    name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Una vez al día por la mañana',
                    startDate: '2023-01-15',
                    isActive: true
                },
                {
                    patientId: createdPatients[1]?.id || 2,
                    name: 'Metformina',
                    dosage: '500mg',
                    frequency: 'Dos veces al día con comidas',
                    startDate: '2022-08-20',
                    isActive: true
                },
                {
                    patientId: createdPatients[2]?.id || 3,
                    name: 'Salbutamol',
                    dosage: '100mcg',
                    frequency: 'Según necesidad, máximo 4 veces al día',
                    startDate: '2021-06-10',
                    isActive: true
                },
                {
                    patientId: createdPatients[4]?.id || 5,
                    name: 'Sertralina',
                    dosage: '50mg',
                    frequency: 'Una vez al día',
                    startDate: '2023-05-20',
                    isActive: true
                }
            ];

            let medicationsCreated = 0;
            for (const medicationData of medicationsData) {
                try {
                    await apiService.post('/medical-history/medications', medicationData);
                    medicationsCreated++;
                } catch (error: any) {
                    console.error('Error agregando medicamento:', error);
                }
            }
            updateProgress('success', `${medicationsCreated} medicamentos agregados`);
            currentStepIndex++;

            // Paso 5: Crear citas
            updateProgress('running');
            const appointmentsData = [
                {
                    patientId: createdPatients[0]?.id || 1,
                    nurseId: 2, // Asumiendo que existe un enfermero con ID 2
                    serviceTypeId: 1, // consulta_general
                    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    notes: 'Chequeo general programado'
                },
                {
                    patientId: createdPatients[1]?.id || 2,
                    nurseId: 2,
                    serviceTypeId: 4, // control
                    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                    notes: 'Control de presión arterial'
                },
                {
                    patientId: createdPatients[2]?.id || 3,
                    nurseId: 2,
                    serviceTypeId: 2, // urgencias
                    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                    notes: 'Urgencia - dolor de pecho'
                },
                {
                    patientId: createdPatients[3]?.id || 4,
                    nurseId: 2,
                    serviceTypeId: 3, // especialidad
                    scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
                    notes: 'Consulta con especialista en cardiología'
                }
            ];

            let appointmentsCreated = 0;
            for (const appointmentData of appointmentsData) {
                try {
                    await apiService.post('/appointments', appointmentData);
                    appointmentsCreated++;
                } catch (error: any) {
                    console.error('Error creando cita:', error);
                }
            }
            updateProgress('success', `${appointmentsCreated} citas creadas`);
            currentStepIndex++;

            // Paso 6: Crear alertas
            updateProgress('running');
            const alertsData = [
                {
                    patientId: createdPatients[0]?.id || 1,
                    alertTypeId: 2, // caida
                    latitude: -16.5000,
                    longitude: -68.1500,
                    description: 'Caída detectada por wearable'
                },
                {
                    patientId: createdPatients[1]?.id || 2,
                    alertTypeId: 4, // vitales
                    latitude: -16.5005,
                    longitude: -68.1505,
                    description: 'Ritmo cardíaco elevado detectado'
                },
                {
                    patientId: createdPatients[3]?.id || 4,
                    alertTypeId: 1, // emergencia
                    latitude: -16.5010,
                    longitude: -68.1510,
                    description: 'Botón de emergencia activado'
                },
                {
                    patientId: createdPatients[2]?.id || 3,
                    alertTypeId: 3, // medicacion
                    latitude: -16.5003,
                    longitude: -68.1503,
                    description: 'Recordatorio: tomar medicamento para asma'
                }
            ];

            let alertsCreated = 0;
            for (const alertData of alertsData) {
                try {
                    await apiService.post('/alerts', alertData);
                    alertsCreated++;
                } catch (error: any) {
                    console.error('Error creando alerta:', error);
                }
            }
            updateProgress('success', `${alertsCreated} alertas creadas`);
            currentStepIndex++;

            // Paso 7: Registrar signos vitales
            updateProgress('running');
            // Nota: takenById debe ser el ID del usuario actual logueado
            // Por ahora usamos el ID del primer usuario creado como fallback
            const currentUserId = createdPatients[0]?.id || 1;

            const vitalsData = [
                {
                    patientId: createdPatients[0]?.id || 1,
                    takenById: currentUserId,
                    systolic: 120,
                    diastolic: 80,
                    heartRate: 72,
                    temperature: 36.5,
                    spo2: 98
                },
                {
                    patientId: createdPatients[1]?.id || 2,
                    takenById: currentUserId,
                    systolic: 135,
                    diastolic: 85,
                    heartRate: 88,
                    temperature: 37.0,
                    spo2: 96
                },
                {
                    patientId: createdPatients[2]?.id || 3,
                    takenById: currentUserId,
                    systolic: 140,
                    diastolic: 90,
                    heartRate: 90,
                    temperature: 36.8,
                    spo2: 95
                },
                {
                    patientId: createdPatients[3]?.id || 4,
                    takenById: currentUserId,
                    systolic: 115,
                    diastolic: 75,
                    heartRate: 68,
                    temperature: 36.6,
                    spo2: 99
                }
            ];

            let vitalsCreated = 0;
            for (const vitalData of vitalsData) {
                try {
                    await apiService.post('/vitals', vitalData);
                    vitalsCreated++;
                } catch (error: any) {
                    console.error('Error registrando signos vitales:', error);
                }
            }
            updateProgress('success', `${vitalsCreated} registros de signos vitales`);



        } catch (error: any) {
            updateProgress('error', error.message || 'Error desconocido');
            throw error;
        }
    }
}

export const seedService = new SeedService();
