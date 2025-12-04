import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Save, X } from 'lucide-react';
import { appointmentsService } from '../services/appointments.service';
import { patientsService } from '../services/patients.service';
import { useAuth } from '../contexts/AuthContext';

const NewAppointment = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: '',
        serviceTypeId: '1',
        date: '',
        startTime: '',
        endTime: '',
        reason: ''
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
        }
    };

    const serviceTypes = [
        { id: 1, name: 'Consulta General' },
        { id: 2, name: 'Urgencias' },
        { id: 3, name: 'Consulta de Especialidad' },
        { id: 4, name: 'Control/Seguimiento' },
        { id: 5, name: 'Vacunación' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.patientId || !formData.date || !formData.startTime || !formData.endTime) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            setLoading(true);

            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            const payload = {
                patientId: Number(formData.patientId),
                nurseId: user?.id || 2,
                serviceTypeId: Number(formData.serviceTypeId),
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                reason: formData.reason || 'Sin razón especificada'
            };

            console.log('📤 Enviando cita:', payload);

            await appointmentsService.create(payload);

            alert('✅ Cita creada exitosamente');
            navigate('/dashboard/appointments');
        } catch (error: any) {
            console.error('❌ Error creating appointment:', error);
            console.error('❌ Response data:', error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || JSON.stringify(error.response?.data)
                || 'Error al crear la cita. Verifica la consola para más detalles.';

            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/appointments');
    };

    const getPatientName = (patient: any) => {
        if (patient.patientProfile) {
            return `${patient.patientProfile.firstName} ${patient.patientProfile.lastName}`;
        }
        return patient.email;
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Nueva Cita</h1>
                    <p className="text-gray-600 mt-1">Programa una nueva cita para un paciente</p>
                </div>
                <button
                    onClick={handleCancel}
                    className="text-gray-600 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                {/* Patient Selection */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User size={18} />
                        Paciente *
                    </label>
                    <select
                        value={formData.patientId}
                        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                    >
                        <option value="">Selecciona un paciente</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {getPatientName(patient)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Service Type */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText size={18} />
                        Tipo de Servicio *
                    </label>
                    <select
                        value={formData.serviceTypeId}
                        onChange={(e) => setFormData({ ...formData, serviceTypeId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                    >
                        {serviceTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={18} />
                        Fecha *
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                    />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Clock size={18} />
                            Hora de Inicio *
                        </label>
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Clock size={18} />
                            Hora de Fin *
                        </label>
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText size={18} />
                        Razón de la Cita
                    </label>
                    <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        rows={4}
                        placeholder="Ej: Control mensual de hipertensión, chequeo general, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {loading ? 'Guardando...' : 'Guardar Cita'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> La cita se creará como "Solicitada". El paciente recibirá una notificación.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default NewAppointment;
