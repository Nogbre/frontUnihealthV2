import { Building2, Clock, List } from 'lucide-react';

const KioskManagement = () => {
    // Mock data - esto debería venir del backend
    const kioskData = {
        name: 'Kiosco Central - Medicina General',
        code: 'KC-001',
        type: 'Centro de Salud',
        status: 'Activo',
        services: [
            'Medicina General',
            'Enfermería',
            'Primeros Auxilios',
            'Atención Psicológica',
            'Fisioterapia',
            'Atención de Emergencias'
        ],
        schedule: {
            weekdays: '08:00 - 20:00',
            weekend: 'Cerrado'
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Información del Kiosco</h1>
                <p className="text-gray-500 mt-2">Gestiona la información y configuración del kiosco</p>
            </div>

            {/* Datos Básicos */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">Datos Básicos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-8">
                    {/* Nombre del Kiosco */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">
                            Nombre del Kiosco
                        </label>
                        <p className="text-base text-gray-900 font-medium">{kioskData.name}</p>
                    </div>

                    {/* Código */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">
                            Código
                        </label>
                        <p className="text-base text-gray-900 font-medium">{kioskData.code}</p>
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">
                            Tipo
                        </label>
                        <p className="text-base text-gray-900 font-medium">{kioskData.type}</p>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">
                            Estado
                        </label>
                        <span className="inline-block px-4 py-1 bg-green-500 text-white text-sm font-medium rounded">
                            {kioskData.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Servicios Disponibles */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">Servicios Disponibles</h2>

                <div className="flex flex-wrap gap-4">
                    {kioskData.services.map((service, index) => (
                        <span
                            key={index}
                            className="px-5 py-2.5 bg-pink-50 text-primary-600 border border-pink-200 rounded-md text-sm font-medium hover:bg-pink-100 transition-colors"
                        >
                            {service}
                        </span>
                    ))}
                </div>
            </div>

            {/* Horarios de Atención */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">Horarios de Atención</h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                        <span className="text-gray-700 text-base">Lunes - Viernes</span>
                        <span className="text-gray-900 font-semibold text-lg">{kioskData.schedule.weekdays}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 text-base">Sábado - Domingo</span>
                        <span className="text-gray-500 font-semibold text-lg">{kioskData.schedule.weekend}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KioskManagement;
