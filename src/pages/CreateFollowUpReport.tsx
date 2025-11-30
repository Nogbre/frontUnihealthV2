import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';

const CreateFollowUpReport = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        dateTime: '',
        originalDiagnosis: '',
        currentTreatmentPlan: '',
        evolutionRating: 'Moderado',
        patientStatus: 'Estable',
        improvements: '',
        complications: '',
        treatmentAdjustments: '',
        newPrescriptions: '',
        additionalTests: '',
        nextSteps: '',
        nextAppointment: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save report to backend
        console.log('Follow-up report data:', formData);
        navigate('/dashboard/reports');
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
                <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 mb-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <ClipboardList size={28} />
                        <h1 className="text-2xl font-bold">Reporte de Seguimiento</h1>
                    </div>
                    <p className="text-green-100">Documentar evolución de tratamiento</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Patient Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Información del Paciente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    placeholder="Nombre del paciente"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID / Documento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    placeholder="Número de identificación"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha y Hora de Seguimiento <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    {/* Treatment Background */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Antecedentes del Tratamiento</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diagnóstico Original <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="originalDiagnosis"
                                value={formData.originalDiagnosis}
                                onChange={handleChange}
                                placeholder="Diagnóstico que dio pie a este seguimiento..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Current Treatment Plan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plan de Tratamiento Actual <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="currentTreatmentPlan"
                            value={formData.currentTreatmentPlan}
                            onChange={handleChange}
                            placeholder="Describa el tratamiento que se está usando..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Evolution Assessment */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Evaluación de Evolución</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado del Tratamiento <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, evolutionRating: 'Excelente' })}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.evolutionRating === 'Excelente'
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Excelente
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, evolutionRating: 'Moderado' })}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.evolutionRating === 'Moderado'
                                                ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Moderado
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, evolutionRating: 'Malo' })}
                                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.evolutionRating === 'Malo'
                                                ? 'border-red-600 bg-red-50 text-red-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Malo
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Evolución <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, patientStatus: 'Mejoría' })}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.patientStatus === 'Mejoría'
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Mejoría
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, patientStatus: 'Estable' })}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.patientStatus === 'Estable'
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Estable
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, patientStatus: 'Estable con Ajustes' })}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.patientStatus === 'Estable con Ajustes'
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Estable con Ajustes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, patientStatus: 'Empeoramiento' })}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${formData.patientStatus === 'Empeoramiento'
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Empeoramiento
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Patient Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado Actual del Paciente <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="improvements"
                            value={formData.improvements}
                            onChange={handleChange}
                            placeholder="Describa el estado actual y mejoría observadas..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Improvements */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mejorías Observadas
                        </label>
                        <textarea
                            name="complications"
                            value={formData.complications}
                            onChange={handleChange}
                            placeholder="Describa las mejorías desde la última consulta..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Complications */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nuevas quejas y Complicaciones
                        </label>
                        <textarea
                            name="complications"
                            value={formData.complications}
                            onChange={handleChange}
                            placeholder="Cualquier información sobre la investigación..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Treatment Adjustments */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Ajustes al Tratamiento</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Modificaciones al Tratamiento <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="treatmentAdjustments"
                                value={formData.treatmentAdjustments}
                                onChange={handleChange}
                                placeholder="Describa cualquier ajuste al plan de tratamiento..."
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* New Prescriptions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nuevas Prescripciones
                        </label>
                        <textarea
                            name="newPrescriptions"
                            value={formData.newPrescriptions}
                            onChange={handleChange}
                            placeholder="Nuevos medicamentos o cambios de dosificación..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Additional Tests */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Exámenes Adicionales
                        </label>
                        <textarea
                            name="additionalTests"
                            value={formData.additionalTests}
                            onChange={handleChange}
                            placeholder="Exámenes de laboratorio o estudios solicitados..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Next Steps */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Próximos Pasos <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="nextSteps"
                            value={formData.nextSteps}
                            onChange={handleChange}
                            placeholder="Plan de acción..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Next Appointment */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha de Próximo Seguimiento
                        </label>
                        <input
                            type="date"
                            name="nextAppointment"
                            value={formData.nextAppointment}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Guardar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFollowUpReport;
