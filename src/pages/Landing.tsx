import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-primary-50 px-4">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 bg-primary-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Heart className="text-white fill-current" size={40} />
                </div>
                <h1 className="text-primary-600 text-xl font-medium tracking-wide">UNIHealth</h1>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full text-center mb-12">
                <div className="flex justify-center mb-8">
                    <Stethoscope className="text-primary-700" size={64} />
                </div>

                <h2 className="text-gray-700 text-lg font-medium mb-6">
                    Bienvenido a UNIHealth
                </h2>

                <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto">
                    La plataforma que ayudará a atender a tus pacientes y conectar con ellos de la mejor manera
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 w-full max-w-md justify-center">
                <button
                    onClick={() => navigate('/register')}
                    className="flex-1 bg-primary-700 text-white py-3 px-8 rounded-xl font-medium hover:bg-primary-800 transition-colors shadow-md"
                >
                    Registrarse
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="flex-1 bg-white text-primary-700 border border-primary-700 py-3 px-8 rounded-xl font-medium hover:bg-primary-50 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </div>

            {/* Footer */}
            <p className="mt-12 text-gray-400 text-sm">
                Gestiona tus kioscos médicos de forma eficiente y profesional
            </p>
        </div>
    );
};

export default Landing;
