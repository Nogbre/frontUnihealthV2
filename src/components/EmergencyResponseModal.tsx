import { X, Check } from 'lucide-react';
import { useState } from 'react';

interface EmergencyResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    alertId: number;
    patientName: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

const EmergencyResponseModal = ({ isOpen, onClose, alertId, patientName }: EmergencyResponseModalProps) => {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const steps = [
        { number: 1, title: 'Alerta Aceptada', status: currentStep >= 1 ? 'completed' : 'pending' },
        { number: 2, title: 'En Ruta', status: currentStep >= 2 ? (currentStep === 2 ? 'active' : 'completed') : 'pending' },
        { number: 3, title: 'En el Lugar', status: currentStep >= 3 ? (currentStep === 3 ? 'active' : 'completed') : 'pending' },
        { number: 4, title: 'Atendiendo', status: currentStep >= 4 ? (currentStep === 4 ? 'active' : 'completed') : 'pending' },
        { number: 5, title: 'Resuelta', status: currentStep >= 5 ? 'completed' : 'pending' },
    ];

    const handleNextStep = () => {
        if (currentStep < 5) {
            setCurrentStep((prev) => (prev + 1) as Step);
        }
    };

    const handleComplete = () => {
        // Here you would update the alert status in the backend
        onClose();
    };

    const getStepColor = (status: string) => {
        if (status === 'completed') return 'bg-green-500 text-white';
        if (status === 'active') return 'bg-green-500 text-white';
        return 'bg-gray-300 text-gray-600';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary-600">Respondiendo a Alerta de Emergencia</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-col items-center flex-1">
                                <div className="flex items-center w-full">
                                    {/* Circle */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getStepColor(step.status)}`}>
                                        {step.status === 'completed' ? <Check size={20} /> : step.number}
                                    </div>

                                    {/* Line */}
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    )}
                                </div>

                                {/* Label */}
                                <p className={`text-xs mt-2 text-center ${step.status === 'active' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                    {step.title}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="mb-6">
                        {currentStep === 1 && (
                            <div className="text-center">
                                <p className="text-gray-700 mb-6">
                                    Has aceptado la alerta. Haz clic en el botón cuando llegues al lugar.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={handleNextStep}
                                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                                    >
                                        He llegado al lugar
                                    </button>
                                    <button className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold">
                                        Solicitar Ambulancia
                                    </button>
                                </div>
                                <button className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    Llamar al Paciente
                                </button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="text-center">
                                <p className="text-gray-700 mb-6">
                                    Estás en ruta hacia el paciente. Haz clic cuando llegues al lugar.
                                </p>
                                <button
                                    onClick={handleNextStep}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                                >
                                    He llegado al lugar
                                </button>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Notas al llegar</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    rows={4}
                                    placeholder="El paciente esta en grave estado pero consciente"
                                />
                                <button
                                    onClick={handleNextStep}
                                    className="mt-4 w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                                >
                                    Iniciar Atención
                                </button>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="text-center">
                                <p className="text-gray-700 mb-6">
                                    Estás atendiendo al paciente. Marca como resuelta cuando termines.
                                </p>
                                <button
                                    onClick={handleNextStep}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                                >
                                    Marcar como Resuelta
                                </button>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="text-center">
                                <div className="mb-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Check size={32} className="text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Alerta Resuelta!</h3>
                                    <p className="text-gray-600">
                                        Has completado exitosamente la atención de emergencia para {patientName}
                                    </p>
                                </div>
                                <button
                                    onClick={handleComplete}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                                >
                                    Cerrar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyResponseModal;
