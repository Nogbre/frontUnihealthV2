import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { clinicalRecordsService } from '../services/clinical-records.service';
import { patientsService, Patient } from '../services/patients.service';

const CreateConsultationReport = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        patientName: '',
        patientAge: '',
        patientId: '',
        consultationReason: '',
        dateTime: '',
        symptoms: '',
        physicalExam: '',
        diagnosisType: 'Confirmado',
        diagnosis: '',
        treatmentPlan: '',
        prescriptions: '',
        labTests: '',
        recommendations: '',
        nextAppointment: ''
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
                patientName: `${selectedPatient.patientProfile?.firstName} ${selectedPatient.patientProfile?.lastName}`,
                patientAge: '' // You can calculate age here if dob is available
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Compile all form data into a single note
            const note = `
REPORTE DE CONSULTA
==================

INFORMACIÓN DEL PACIENTE:
- Nombre: ${formData.patientName}
- Edad: ${formData.patientAge}
- ID: ${formData.patientId}

DETALLES DE LA CONSULTA:
- Motivo: ${formData.consultationReason}
- Fecha y Hora: ${formData.dateTime}
- Síntomas: ${formData.symptoms}

EXAMEN FÍSICO:
${formData.physicalExam}

DIAGNÓSTICO:
- Tipo: ${formData.diagnosisType}
- Diagnóstico: ${formData.diagnosis}

PLAN DE TRATAMIENTO:
${formData.treatmentPlan}

PRESCRIPCIONES MÉDICAS:
${formData.prescriptions}

EXÁMENES DE LABORATORIO:
${formData.labTests || 'Ninguno'}

RECOMENDACIONES:
${formData.recommendations || 'Ninguna'}

PRÓXIMA CITA:
${formData.nextAppointment || 'No programada'}
            `.trim();

            await clinicalRecordsService.create({
                patientId: formData.patientId,
                noteTypeId: '1', // consulta = consultation
                note: note
            });

            alert('Reporte de consulta guardado exitosamente');
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
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 mb-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Stethoscope size={28} />
                        <h1 className="text-2xl font-bold">Reporte de Consulta</h1>
                    </div>
                    <p className="text-blue-100">Documentar consulta o atención programada</p>
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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

                    {/* Consultation Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Detalles de la Consulta</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo de Consulta <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="consultationReason"
                                        value={formData.consultationReason}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Seleccionar motivo</option>
                                        <option value="checkup">Control de Rutina</option>
                                        <option value="illness">Enfermedad</option>
                                        <option value="injury">Lesión</option>
                                        <option value="followup">Seguimiento</option>
                                        <option value="other">Otro</option>
                                    </select>
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Síntomas Reportados <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    placeholder="Describa los síntomas reportados por el paciente..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Physical Exam */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Examen Físico <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="physicalExam"
                            value={formData.physicalExam}
                            onChange={handleChange}
                            placeholder="Hallazgos del examen físico realizado..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Diagnosis */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Diagnóstico</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Diagnóstico <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, diagnosisType: 'Confirmado' })}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.diagnosisType === 'Confirmado'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Confirmado
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, diagnosisType: 'Presuntivo' })}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.diagnosisType === 'Presuntivo'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Presuntivo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, diagnosisType: 'Diferencial' })}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.diagnosisType === 'Diferencial'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Diferencial
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, diagnosisType: 'Descartado' })}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.diagnosisType === 'Descartado'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Descartado
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Diagnóstico <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    placeholder="Describa el diagnóstico..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Treatment Plan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plan de Tratamiento <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="treatmentPlan"
                            value={formData.treatmentPlan}
                            onChange={handleChange}
                            placeholder="Describa el plan de tratamiento..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Medical Prescriptions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prescripciones Médicas <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="prescriptions"
                            value={formData.prescriptions}
                            onChange={handleChange}
                            placeholder="Lista de medicamentos prescritos, dosis y frecuencia..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Lab Tests */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Exámenes de Laboratorio
                        </label>
                        <textarea
                            name="labTests"
                            value={formData.labTests}
                            onChange={handleChange}
                            placeholder="Exámenes solicitados..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recomendaciones
                        </label>
                        <textarea
                            name="recommendations"
                            value={formData.recommendations}
                            onChange={handleChange}
                            placeholder="Recomendaciones adicionales para el paciente..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Next Appointment */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Próxima Cita
                        </label>
                        <input
                            type="date"
                            name="nextAppointment"
                            value={formData.nextAppointment}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Guardar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateConsultationReport;
