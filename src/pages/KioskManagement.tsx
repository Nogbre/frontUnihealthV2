import { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Phone, Clock, AlertCircle } from 'lucide-react';
import { kioskService, Kiosk } from '../services/kiosk.service';

const KioskManagement = () => {
    const [kiosks, setKiosks] = useState<Kiosk[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchKiosks();
    }, []);

    const fetchKiosks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await kioskService.getAll();
            setKiosks(data);
        } catch (err) {
            console.error('Error fetching kiosks:', err);
            setError('Error al cargar los kioscos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando kioscos médicos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 text-center">{error}</p>
                <button
                    onClick={fetchKiosks}
                    className="mt-4 mx-auto block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kioscos Médicos</h1>
                    <p className="text-gray-500 mt-2">Gestión de kioscos de salud del sistema</p>
                </div>
                <button
                    onClick={fetchKiosks}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <RefreshCw size={18} />
                    Actualizar
                </button>
            </div>

            {/* Kiosks List */}
            {kiosks.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No hay kioscos registrados</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Los kioscos se añadirán automáticamente por el administrador
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kiosks.map((kiosk) => (
                        <div
                            key={kiosk.id}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                                        {kiosk.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-600 gap-1">
                                        <MapPin size={14} />
                                        {kiosk.city}
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        kiosk.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {kiosk.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{kiosk.address}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">{kiosk.phone}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">
                                        {kiosk.openTime} - {kiosk.closeTime}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Personal asignado:</span>
                                    <span className="font-medium text-gray-900">
                                        {kiosk.staff?.length || 0}
                                    </span>
                                </div>
                                {kiosk._count && (
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-600">Citas programadas:</span>
                                        <span className="font-medium text-gray-900">
                                            {kiosk._count.appointments}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KioskManagement;
