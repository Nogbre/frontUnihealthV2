import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Bell, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { patientsService, Patient } from '../services/patients.service';
import { appointmentsService, Appointment } from '../services/appointments.service';
import { alertsService, Alert } from '../services/alerts.service';
import { format } from 'date-fns';
import SeedButton from '../components/SeedButton';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    alerts: 0,
    pendingAlerts: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patients, appointments, alerts] = await Promise.all([
          patientsService.getAll(),
          appointmentsService.getAll(),
          alertsService.getAll(),
        ]);

        setStats({
          patients: patients.length,
          appointments: appointments.length,
          alerts: alerts.length,
          pendingAlerts: alerts.filter((a) => a.status === 'pendiente').length,
        });

        setRecentAppointments(
          appointments
            .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
            .slice(0, 5)
        );
        setRecentAlerts(
          alerts
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Pacientes',
      value: stats.patients,
      icon: Users,
      color: 'bg-blue-500',
      href: '/patients',
    },
    {
      name: 'Citas',
      value: stats.appointments,
      icon: Calendar,
      color: 'bg-green-500',
      href: '/appointments',
    },
    {
      name: 'Alertas',
      value: stats.alerts,
      icon: Bell,
      color: 'bg-yellow-500',
      href: '/alerts',
    },
    {
      name: 'Alertas Pendientes',
      value: stats.pendingAlerts,
      icon: AlertCircle,
      color: 'bg-red-500',
      href: '/alerts',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general del sistema</p>
        </div>
        <SeedButton />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Citas Recientes</h2>
            <Link
              to="/appointments"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay citas recientes</p>
            ) : (
              recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(appointment.start), "d 'de' MMMM, yyyy")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appointment.start), 'HH:mm')} -{' '}
                      {format(new Date(appointment.end), 'HH:mm')}
                    </p>
                    {appointment.reason && (
                      <p className="text-xs text-gray-500 mt-1">{appointment.reason}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmada'
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'cancelada'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Alertas Recientes</h2>
            <Link
              to="/alerts"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay alertas recientes</p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {alert.type?.name || 'Alerta'} - Paciente #{alert.patientId}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(alert.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm")}
                    </p>
                    {alert.description && (
                      <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${alert.status === 'resuelta'
                      ? 'bg-green-100 text-green-800'
                      : alert.status === 'en curso'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {alert.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

