import { useState, useEffect } from 'react';
import { Users, RefreshCw, UserMinus } from 'lucide-react';
import { kioskService, KioskStaffMember } from '../services/kiosk.service';

const KioskStaff = () => {
    const [staff, setStaff] = useState<KioskStaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [kioskId, setKioskId] = useState<string | null>(null);

    useEffect(() => {
        initializeKiosk();
    }, []);

    const initializeKiosk = async () => {
        try {
            // Get first kiosk to show staff
            const kiosks = await kioskService.getAll();
            if (kiosks.length > 0) {
                setKioskId(kiosks[0].id);
                await fetchStaff(kiosks[0].id);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error initializing kiosk:', error);
            setLoading(false);
        }
    };

    const fetchStaff = async (id: string) => {
        try {
            setLoading(true);
            const data = await kioskService.getStaff(id);
            setStaff(data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStaffName = (member: KioskStaffMember) => {
        const profile = member.user?.nurseProfile || member.user?.doctorProfile;
        if (profile) {
            return `${profile.firstName} ${profile.lastName}`;
        }
        return member.user?.email || 'Usuario';
    };

    const getSpecialization = (member: KioskStaffMember) => {
        const profile = member.user?.nurseProfile || member.user?.doctorProfile;
        return profile?.specialization || 'Sin especialización';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando personal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Personal del Kiosco</h1>
                    <p className="text-gray-500 mt-2">Gestiona el personal médico y administrativo del kiosco</p>
                </div>
                <button
                    onClick={() => kioskId && fetchStaff(kioskId)}
                    disabled={!kioskId}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw size={18} />
                    Actualizar
                </button>
            </div>

            {/* Staff List or Empty State */}
            {staff.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12">
                    <div className="text-center">
                        {/* Doctor Emojis */}
                        <div className="flex justify-center gap-4 mb-6">
                            <div className="text-7xl">👨‍⚕️</div>
                            <div className="text-7xl">👩‍⚕️</div>
                        </div>

                        {/* Message */}
                        <p className="text-gray-500 text-lg">
                            No hay personal asignado a este kiosco todavía
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            El personal se asignará automáticamente cuando se registre en el sistema
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Avatar */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">
                                        {member.user.nurseProfile ? '👨‍⚕️' : '👨‍⚕️'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {getStaffName(member)}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Asignado: {new Date(member.assignedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500">Especialización</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getSpecialization(member)}
                                    </p>
                                </div>
                                {member.user && (
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm text-gray-600">{member.user.email}</p>
                                    </div>
                                )}
                            </div>

                            {/* Badge */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Activo
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KioskStaff;
