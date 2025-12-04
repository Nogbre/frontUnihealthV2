import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bell,
  FileText,
  Settings,
  Building2,
  Search,
  LogOut,
  Menu,
  X,
  AlertCircle,
  LifeBuoy,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { alertsService } from '../services/alerts.service';
import { appointmentsService } from '../services/appointments.service';
import { isToday } from 'date-fns';

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertsCount, setAlertsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [kioskMenuOpen, setKioskMenuOpen] = useState(false);

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    // Auto-open kiosk menu if we're on a kiosk page
    if (isKioskSubmenuActive()) {
      setKioskMenuOpen(true);
    }
  }, [location.pathname]);

  const fetchCounts = async () => {
    try {
      const [alerts, appointments] = await Promise.all([
        alertsService.getAll(),
        appointmentsService.getAll(),
      ]);

      const activeAlerts = alerts.filter(a => a.status === 'pendiente' || a.status === 'en curso');
      setAlertsCount(activeAlerts.length);

      const todayAppointments = appointments.filter(a => isToday(new Date(a.start)));
      setAppointmentsCount(todayAppointments.length);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Panel Principal', href: '/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Alertas de Emergencia', href: '/dashboard/alerts', icon: AlertCircle, badge: alertsCount > 0 ? alertsCount : null },
    { name: 'Mis Citas', href: '/dashboard/appointments', icon: Calendar, badge: appointmentsCount > 0 ? appointmentsCount : null },
    { name: 'Pacientes', href: '/dashboard/patients', icon: Users, badge: null },
    { name: 'Mis Reportes', href: '/dashboard/reports', icon: FileText, badge: null },
  ];

  const kioskSubMenu = [
    { name: 'Información del Kiosco', href: '/dashboard/kiosk-management' },
    // { name: 'Inventario de Medicamentos', href: '/dashboard/medicine-inventory' }, // Backend no implementado
    { name: 'Personal del Kiosco', href: '/dashboard/kiosk-staff' },
  ];

  const isKioskSubmenuActive = () => {
    return kioskSubMenu.some(item => location.pathname === item.href);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-primary-600">UNIHealth</h1>
              <p className="text-xs text-gray-500">Kiosco Central - Medicina General</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${active
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center">
                    <Icon size={20} className="mr-3" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Gestión del Kiosco with submenu */}
            <div>
              <button
                onClick={() => setKioskMenuOpen(!kioskMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isKioskSubmenuActive()
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <Building2 size={20} className="mr-3" />
                  <span className="text-sm">Gestión del Kiosco</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${kioskMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {kioskMenuOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {kioskSubMenu.map((subItem) => {
                    const active = location.pathname === subItem.href;
                    return (
                      <button
                        key={subItem.name}
                        onClick={() => {
                          navigate(subItem.href);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${active
                          ? 'bg-primary-600 text-white font-medium border-l-4 border-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                      >
                        {subItem.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Emergency Support Button */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              <LifeBuoy size={20} className="mr-2" />
              Soporte de Emergencia
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar paciente, cita, historial..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* User info and notifications */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" size={24} />
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  2
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'D'}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Dr. Roberto Fernández</div>
                  <div className="text-xs text-gray-500">Médico General</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
