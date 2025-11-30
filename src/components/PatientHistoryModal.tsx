import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface PatientHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: {
        id: number;
        name: string;
        age: number;
        gender: string;
        dni?: string;
        studentId?: string;
        phone?: string;
        allergies?: string;
        chronicConditions?: string;
        lastVisit?: string;
    };
}

type TabType = 'consultas' | 'signos' | 'medicamentos' | 'documentos';

const PatientHistoryModal = ({ isOpen, onClose, patient }: PatientHistoryModalProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('consultas');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                            <p className="text-sm text-gray-600">{patient.age} años • {patient.gender}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Patient Details */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        {patient.dni && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">DNI</p>
                                <p className="text-sm font-medium text-gray-900">{patient.dni}</p>
                            </div>
                        )}
                        {patient.studentId && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Código Estudiantil</p>
                                <p className="text-sm font-medium text-gray-900">{patient.studentId}</p>
                            </div>
                        )}
                        {patient.phone && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                                <p className="text-sm font-medium text-gray-900">{patient.phone}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Critical Information */}
                {(patient.allergies || patient.chronicConditions) && (
                    <div className="px-6 py-4 bg-orange-50 border-b border-orange-200">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-orange-900 mb-2">Información Crítica</h3>
                                {patient.allergies && (
                                    <div className="mb-2">
                                        <p className="text-xs font-medium text-orange-800">Alergias:</p>
                                        <p className="text-sm text-orange-700">{patient.allergies}</p>
                                    </div>
                                )}
                                {patient.chronicConditions && (
                                    <div>
                                        <p className="text-xs font-medium text-orange-800">Condiciones Crónicas:</p>
                                        <p className="text-sm text-orange-700">{patient.chronicConditions}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('consultas')}
                            className={`pb-3 px-2 font-medium text-sm transition-colors ${activeTab === 'consultas'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Historial de Consultas
                        </button>
                        <button
                            onClick={() => setActiveTab('signos')}
                            className={`pb-3 px-2 font-medium text-sm transition-colors ${activeTab === 'signos'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Signos Vitales
                        </button>
                        <button
                            onClick={() => setActiveTab('medicamentos')}
                            className={`pb-3 px-2 font-medium text-sm transition-colors ${activeTab === 'medicamentos'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Medicamentos
                        </button>
                        <button
                            onClick={() => setActiveTab('documentos')}
                            className={`pb-3 px-2 font-medium text-sm transition-colors ${activeTab === 'documentos'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Documentos
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[200px]">
                        {activeTab === 'consultas' && (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Historial de consultas del paciente
                                </h3>
                                {patient.lastVisit && (
                                    <p className="text-gray-600">Última consulta: {patient.lastVisit}</p>
                                )}
                                {!patient.lastVisit && (
                                    <p className="text-gray-500">No hay consultas registradas</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'signos' && (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Gráficos y registros de signos vitales
                                </h3>
                                <p className="text-gray-500">No hay signos vitales registrados</p>
                            </div>
                        )}

                        {activeTab === 'medicamentos' && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Medicamentos Actuales</h3>
                                <div className="space-y-3">
                                    <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                                        <p className="font-medium text-gray-900">Salbutamol 100mcg</p>
                                        <p className="text-sm text-gray-500 mt-1">Inhalador - Según necesidad</p>
                                    </div>
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No hay más medicamentos registrados
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'documentos' && (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Documentos y archivos del paciente
                                </h3>
                                <p className="text-gray-500">No hay documentos disponibles</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                            Actualizar Información
                        </button>
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Agendar Cita
                        </button>
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Enviar Mensaje
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHistoryModal;
