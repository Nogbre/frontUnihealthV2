import { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, MessageSquare } from 'lucide-react';
import { appointmentsService } from '../services/appointments.service';
import { format, isToday, isSameDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

type ViewMode = 'day' | 'week' | 'month';

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAppointments = () => {
    switch (viewMode) {
      case 'day':
        return appointments.filter(apt => isSameDay(new Date(apt.start), selectedDate));
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return appointments.filter(apt => {
          const aptDate = new Date(apt.start);
          return aptDate >= weekStart && aptDate <= weekEnd;
        });
      case 'month':
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        return appointments.filter(apt => {
          const aptDate = new Date(apt.start);
          return aptDate >= monthStart && aptDate <= monthEnd;
        });
      default:
        return appointments;
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getPatientName = (apt: any) => {
    if (apt.patient?.patientProfile) {
      const profile = apt.patient.patientProfile;
      return `${profile.firstName} ${profile.lastName}`;
    }
    return apt.patient?.email || `Paciente #${apt.patientId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada':
        return 'bg-green-500';
      case 'confirmada':
        return 'bg-blue-500';
      case 'pendiente':
        return 'bg-yellow-500';
      case 'cancelada':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completada':
        return 'Completada';
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Agenda de Citas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus citas y horarios de atención</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2">
          <Plus size={20} />
          Nueva Cita
        </button>
      </div>

      {/* Tabs and Date Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${viewMode === 'day'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${viewMode === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${viewMode === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Mes
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">
                {isToday(selectedDate) ? 'Hoy, ' : ''}
                {format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}
              </span>
            </div>
            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            {!isToday(selectedDate) && (
              <button
                onClick={handleToday}
                className="ml-2 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                Hoy
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline View (Day) */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex gap-4">
            {/* Timeline */}
            <div className="w-20 flex-shrink-0">
              {timeSlots.map((hour) => (
                <div key={hour} className="h-24 flex items-start justify-end pr-4 text-sm text-gray-500">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* Appointments */}
            <div className="flex-1 relative">
              {timeSlots.map((hour) => (
                <div key={hour} className="h-24 border-t border-gray-100"></div>
              ))}

              {/* Appointment Cards */}
              {filteredAppointments.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">No hay citas programadas para este día</p>
                </div>
              ) : (
                filteredAppointments.map((apt) => {
                  const startTime = new Date(apt.start);
                  const hour = startTime.getHours();
                  const minute = startTime.getMinutes();
                  const topPosition = ((hour - 8) * 96) + (minute / 60 * 96);

                  return (
                    <div
                      key={apt.id}
                      className="absolute left-0 right-0 ml-2 mr-2"
                      style={{ top: `${topPosition}px` }}
                    >
                      <div className="bg-white border-2 border-primary-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {getPatientName(apt).charAt(0)}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{getPatientName(apt)}</h3>
                            <p className="text-sm text-gray-600">
                              {format(new Date(apt.start), 'HH:mm')}
                              {apt.end && ` - ${format(new Date(apt.end), 'HH:mm')}`}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {apt.reason || apt.serviceType?.name || 'Consulta general'}
                            </p>
                            <span className={`${getStatusColor(apt.status)} text-white text-xs px-2 py-1 rounded-full font-medium inline-block mt-2`}>
                              {getStatusText(apt.status)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                              Ver Detalles
                            </button>
                            <button className="px-3 py-1 border border-primary-600 text-primary-600 text-sm rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-1">
                              <MessageSquare size={14} />
                              Mensaje
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View (Week/Month) */}
      {(viewMode === 'week' || viewMode === 'month') && (
        <div className="space-y-6">
          {/* Description and Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Description */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Calendar size={48} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {viewMode === 'week' ? 'Vista semanal del calendario' : 'Vista mensual del calendario'}
              </h2>
              <p className="text-gray-600">
                {viewMode === 'week'
                  ? 'Muestra las citas de Lunes a Domingo'
                  : 'Muestra todas las citas del mes con indicadores visuales'}
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Today */}
              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {appointments.filter(a => isToday(new Date(a.start))).length}
                </div>
                <p className="text-sm text-gray-600">Total de Citas Hoy</p>
              </div>

              {/* Confirmed */}
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {filteredAppointments.filter(a => a.status === 'confirmada').length}
                </div>
                <p className="text-sm text-gray-600">Confirmadas</p>
              </div>

              {/* Pending */}
              <div className="bg-yellow-50 rounded-xl p-6 text-center border border-yellow-100">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {filteredAppointments.filter(a => a.status === 'pendiente').length}
                </div>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {filteredAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No hay citas programadas para este período</p>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 text-center">
                        <div className="bg-primary-600 text-white rounded-lg px-3 py-2">
                          <div className="text-2xl font-bold">{format(new Date(apt.start), 'd')}</div>
                          <div className="text-xs">{format(new Date(apt.start), 'MMM', { locale: es })}</div>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {getPatientName(apt).charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{getPatientName(apt)}</h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(apt.start), "EEEE, d 'de' MMMM 'a las' HH:mm", { locale: es })}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {apt.reason || apt.serviceType?.name || 'Consulta general'}
                        </p>
                        <span className={`${getStatusColor(apt.status)} text-white text-xs px-2 py-1 rounded-full font-medium inline-block mt-2`}>
                          {getStatusText(apt.status)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                          Ver Detalles
                        </button>
                        <button className="px-4 py-2 border border-primary-600 text-primary-600 text-sm rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2">
                          <MessageSquare size={16} />
                          Mensaje
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
