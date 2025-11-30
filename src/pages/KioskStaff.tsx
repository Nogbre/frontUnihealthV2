import { Users } from 'lucide-react';

const KioskStaff = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Personal del Kiosco</h1>
                <p className="text-gray-500 mt-2">Gestiona el personal médico y administrativo del kiosco</p>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                    {/* Doctor Emojis */}
                    <div className="flex justify-center gap-4 mb-6">
                        <div className="text-7xl">👨‍⚕️</div>
                        <div className="text-7xl">👩‍⚕️</div>
                    </div>

                    {/* Message */}
                    <p className="text-gray-500 text-lg">
                        Aquí se mostraría el listado del personal del kiosco
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KioskStaff;
