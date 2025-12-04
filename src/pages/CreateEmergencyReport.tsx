import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Activity } from 'lucide-react';
import { clinicalRecordsService } from '../services/clinical-records.service';
import { patientsService, Patient } from '../services/patients.service';

const CreateEmergencyReport = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        emergencyType: '',
        severity: 'Moderado',
        dateTime: '',
        symptoms: '',
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        oxygenSaturation: '',
        actionsTaken: '',
        medicationsAdministered: '',
        additionalObservations: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const data = await patientsService.getAll();
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPatient = patients.find(p => p.id.toString() === e.target.value);
        if (selectedPatient) {
            setFormData({
                ...formData,
                patientId: selectedPatient.id.toString(),
                patientName: `${selectedPatient.patientProfile?.firstName} ${selectedPatient.patientProfile?.lastName}`
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Compile all form data into a single note
            const note = `
REPORTE DE EMERGENCIA
===================

INFORMACIÓN DEL PACIENTE:
- Nombre: ${formData.patientName}
- ID: ${formData.patientId}

DETALLES DE LA EMERGENCIA:
- Tipo: ${formData.emergencyType}
- Gravedad: ${formData.severity}
- Fecha y Hora: ${formData.dateTime}
- Síntomas: ${formData.symptoms}

SIGNOS VITALES:
- Presión Arterial: ${formData.bloodPressure || 'N/A'}
- Frecuencia Cardíaca: ${formData.heartRate || 'N/A'}
- Temperatura: ${formData.temperature || 'N/A'}
- Saturación O₂: ${formData.oxygenSaturation || 'N/A'}

ACCIONES TOMADAS:
${formData.actionsTaken}

MEDICAMENTOS ADMINISTRADOS:
${formData.medicationsAdministered}

OBSERVACIONES ADICIONALES:
${formData.additionalObservations || 'Ninguna'}
            `.trim();

            await clinicalRecordsService.create({
                patientId: formData.patientId,
                noteTypeId: '3', // ingreso = emergency
                note: note
            });

            alert('Reporte de emergencia guardado exitosamente');
            navigate('/dashboard/reports');
        } catch (error: any) {
            console.error('Error saving report:', error);
            alert(error.response?.data?.message || 'Error al guardar el reporte');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard/reports')}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                    <ArrowLeft size={20} />
                    Volver
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">❤️</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">UNIHealth</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Title Banner */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl p-6 mb-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle size={28} />
                        <h1 className="text-2xl font-bold">Reporte de Emergencia</h1>
                    </div>
                    <p className="text-red-100">Documentar respuesta a alerta de emergencia</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Patient Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Información del Paciente</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar Paciente <span className="text-red-500">*</span>
                                </label>
                                {loading ? (
                                    <div className="text-gray-500">Cargando pacientes...</div>
                                ) : (
                                    <select
                                        value={formData.patientId}
                                        onChange={handlePatientChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Seleccionar paciente...</option>
                                        {patients.map((patient) => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.patientProfile?.firstName} {patient.patientProfile?.lastName} ({patient.email})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Emergency Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Detalles de la Emergencia</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Emergencia <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="emergencyType"
                                        value={formData.emergencyType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="respiratory">Problemas Respiratorios</option>
                                        <option value="cardiac">Problemas Cardíacos</option>
                                        <option value="trauma">Trauma/Lesión</option>
                                        <option value="allergic">Reacción Alérgica</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nivel de Gravedad <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, severity: 'Crítico' })}
                                            className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.severity === 'Crítico'
                                                    ? 'border-red-600 bg-red-50 text-red-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Crítico
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, severity: 'Moderado' })}
                                            className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.severity === 'Moderado'
                                                    ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Moderado
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, severity: 'Bajo' })}
                                            className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.severity === 'Bajo'
                                                    ? 'border-green-600 bg-green-50 text-green-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Bajo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha y Hora <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dateTime"
                                    value={formData.dateTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Síntomas Principales <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    placeholder="Describa los síntomas observados..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="text-gray-600" size={20} />
                            <h2 className="text-lg font-semibold text-gray-900">Signos Vitales</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Presión Arterial
                                </label>
                                <input
                                    type="text"
                                    name="bloodPressure"
                                    value={formData.bloodPressure}
                                    onChange={handleChange}
                                    placeholder="120/80 mmHg"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Frecuencia Cardíaca
                                </label>
                                <input
                                    type="text"
                                    name="heartRate"
                                    value={formData.heartRate}
                                    onChange={handleChange}
                                    placeholder="75 lpm"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Temperatura
                                </label>
                                <input
                                    type="text"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    placeholder="38.5°C"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Saturación O₂
                                </label>
                                <input
                                    type="text"
                                    name="oxygenSaturation"
                                    value={formData.oxygenSaturation}
                                    onChange={handleChange}
                                    placeholder="98%"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions Taken */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Acciones Tomadas <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="actionsTaken"
                            value={formData.actionsTaken}
                            onChange={handleChange}
                            placeholder="Describa las acciones realizadas durante la emergencia..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Medications Administered */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medicamentos Administrados <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="medicationsAdministered"
                            value={formData.medicationsAdministered}
                            onChange={handleChange}
                            placeholder="Lista de medicamentos y dosis administradas..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Additional Observations */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observaciones Adicionales
                        </label>
                        <textarea
                            name="additionalObservations"
                            value={formData.additionalObservations}
                            onChange={handleChange}
                            placeholder="Cualquier información adicional relevante..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/reports')}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                        >
                            Guardar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEmergencyReport;
