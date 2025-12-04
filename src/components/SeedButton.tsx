import { useState } from 'react';
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react';
import { seedService, SeedProgress } from '../services/seed.service';

const SeedButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [progress, setProgress] = useState<SeedProgress[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSeed = async () => {
        setIsSeeding(true);
        setError(null);
        setProgress([]);

        try {
            await seedService.seedDatabase((step) => {
                setProgress((prev) => {
                    const existing = prev.find((p) => p.step === step.step);
                    if (existing) {
                        return prev.map((p) => (p.step === step.step ? step : p));
                    }
                    return [...prev, step];
                });
            });
        } catch (err: any) {
            setError(err.message || 'Error al llenar la base de datos');
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-secondary flex items-center gap-2"
                title="Llenar base de datos con datos de prueba"
            >
                <Database size={20} />
                <span>Seed Database</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Llenar Base de Datos</h3>
                            {!isSeeding && (
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {progress.length === 0 && !isSeeding ? (
                            <>
                                <p className="text-gray-600 mb-4">
                                    Esto creará datos de prueba completos en la base de datos:
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
                                    <li>5 pacientes con perfiles completos</li>
                                    <li>5 historias médicas (hipertensión, diabetes, asma, ansiedad, depresión)</li>
                                    <li>3 alergias (penicilina, maní, polen)</li>
                                    <li>4 medicamentos activos</li>
                                    <li>4 citas programadas (hoy, mañana, 2 días, 3 días)</li>
                                    <li>4 alertas (caída, vitales anormales, emergencia, medicación)</li>
                                    <li>4 registros de signos vitales</li>
                                </ul>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ Esto creará registros nuevos. No eliminará datos existentes.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSeed}
                                        className="btn-primary flex-1"
                                    >
                                        Iniciar
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3 mb-4">
                                    {progress.map((step, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                {step.status === 'running' && (
                                                    <Loader className="text-blue-500 animate-spin" size={20} />
                                                )}
                                                {step.status === 'success' && (
                                                    <CheckCircle className="text-green-500" size={20} />
                                                )}
                                                {step.status === 'error' && (
                                                    <XCircle className="text-red-500" size={20} />
                                                )}
                                                {step.status === 'pending' && (
                                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{step.step}</p>
                                                    {step.message && (
                                                        <p className="text-sm text-gray-600">{step.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                )}

                                {!isSeeding && (
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setProgress([]);
                                            setError(null);
                                            window.location.reload(); // Reload to see new data
                                        }}
                                        className="btn-primary w-full"
                                    >
                                        Cerrar y Actualizar
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SeedButton;
