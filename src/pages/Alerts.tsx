import { useEffect, useState } from 'react';
import { AlertCircle, Clock, MapPin, Phone, Navigation, AlertTriangle } from 'lucide-react';
import { alertsService, Alert } from '../services/alerts.service';
import { appointmentsService } from '../services/appointments.service';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import EmergencyResponseModal from '../components/EmergencyResponseModal';
import PatientHistoryModal from '../components/PatientHistoryModal';

type FilterTab = 'activas' | 'respondidas' | 'historial';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('activas');
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsData, appointmentsData] = await Promise.all([
        alertsService.getAll(),
        appointmentsService.getAll(),
      ]);
      setAlerts(alertsData);

      // Create recent patients from real appointments
      const recentAppointmentsList = appointmentsData
        .sort((a: any, b: any) => new Date(b.start).getTime() - new Date(a.start).getTime())
        .slice(0, 4)
        .map((apt: any) => ({
          id: apt.patientId,
          name: apt.patient?.patientProfile
            ? `${apt.patient.patientProfile.firstName} ${apt.patient.patientProfile.lastName}`
            : apt.patient?.email || `Paciente #${apt.patientId}`,
          time: formatDistanceToNow(new Date(apt.start), { addSuffix: true, locale: es }),
          reason: apt.reason || apt.serviceType?.name || 'Consulta general',
          status: apt.status === 'completada' ? 'Completado' :
            apt.status === 'confirmada' ? 'En tratamiento' : 'Seguimiento',
          statusColor: apt.status === 'completada' ? 'bg-green-500' :
            apt.status === 'confirmada' ? 'bg-orange-500' : 'bg-blue-500',
        }));

      setRecentPatients(recentAppointmentsList);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAlerts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (activeTab) {
      case 'activas':
        return alerts.filter(a => a.status === 'pendiente' || a.status === 'en curso');
      case 'respondidas':
        const todayResponded = alerts.filter(a => {
          if (a.status !== 'en curso') return false;
          const alertDate = new Date(a.createdAt);
          return alertDate >= today;
        });
        return todayResponded;
      case 'historial':
        return alerts;
      default:
        return alerts;
    }
  };

  const handleAccept = async (alert: Alert) => {
    try {
      await alertsService.updateStatus(alert.id, 'en curso');
      setSelectedAlert(alert);
      setShowResponseModal(true);
      fetchData();
    } catch (error: any) {
      console.error('Error accepting alert:', error);
    }
  };

  const handleGetDirections = (alert: Alert) => {
    if (alert.latitude && alert.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${alert.latitude},${alert.longitude}`;
      window.open(url, '_blank');
    } else {
      window.alert('Ubicación no disponible');
    }
  };

  const handleCallPatient = (alert: Alert) => {
    const phone = alert.patient?.patientProfile?.phone;
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      window.alert('Número de teléfono no disponible');
    }
  };

  const handleViewAlertHistory = (alert: Alert) => {
    if (alert.patient) {
      const patientData = {
        id: alert.patientId,
        name: getPatientName(alert),
        ...alert.patient
      };
      setSelectedPatient(patientData);
      setShowPatientModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowResponseModal(false);
    setSelectedAlert(null);
    fetchData();
  };

  const handleViewPatientHistory = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const handleReject = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas rechazar esta alerta?')) {
      try {
        await alertsService.updateStatus(id, 'rechazada');
        fetchData();
      } catch (error: any) {
        console.error('Error rejecting alert:', error);
      }
    }
  };

  const getPatientName = (alert: Alert) => {
    if (alert.patient?.patientProfile) {
      const profile = alert.patient.patientProfile;
      return `${profile.firstName} ${profile.lastName}`;
    }
    return alert.patient?.email || `Paciente #${alert.patientId}`;
  };

  const getPatientInfo = (alert: Alert) => {
    if (alert.patient?.patientProfile) {
      const profile = alert.patient.patientProfile;
      const age = profile.dob
        ? new Date().getFullYear() - new Date(profile.dob).getFullYear()
        : '?';
      const gender = profile.gender === 'M' ? 'Masculino' : profile.gender === 'F' ? 'Femenino' : 'N/A';
      return { age, gender };
    }
    return { age: '?', gender: 'N/A' };
  };

  const getTimeElapsed = (createdAt: string) => {
    return formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
      locale: es
    });
  };

  const getEstimatedResponseTime = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const filteredAlerts = getFilteredAlerts();
  const activeAlertsCount = alerts.filter(a => a.status === 'pendiente' || a.status === 'en curso').length;

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Alertas de Emergencia</h1>
          <p className="text-gray-600 mt-1">Gestiona y responde a las alertas de emergencia de los estudiantes</p>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('activas')}
            className={`pb-3 px-4 font-medium text-sm transition-colors relative ${activeTab === 'activas' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Activas
            {activeAlertsCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('respondidas')}
            className={`pb-3 px-4 font-medium text-sm transition-colors ${activeTab === 'respondidas' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Respondidas Hoy
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`pb-3 px-4 font-medium text-sm transition-colors ${activeTab === 'historial' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Historial Completo
          </button>
        </div>

        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {activeTab === 'activas' && 'No hay alertas activas en este momento'}
                {activeTab === 'respondidas' && 'No hay alertas respondidas hoy'}
                {activeTab === 'historial' && 'No hay alertas en el historial'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const { age, gender } = getPatientInfo(alert);
              const estimatedTime = getEstimatedResponseTime();

              return (
                <div key={alert.id} className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
                  <div className="bg-red-50 px-6 py-3 border-b border-red-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase">
                        {alert.type?.name || 'EMERGENCIA'}
                      </span>
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <Clock size={16} />
                        <span className="font-medium">{getTimeElapsed(alert.createdAt)}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 border border-red-400 text-red-600 text-xs font-medium rounded">
                      Prioridad: Alta
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-4">Información del Paciente</h3>
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {getPatientName(alert).charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg mb-1">{getPatientName(alert)}</h4>
                            <p className="text-sm text-gray-600 mb-1">{age} años</p>
                            <p className="text-sm text-gray-600 mb-1">{gender}</p>
                            <p className="text-sm text-gray-500">EST-{alert.patientId}</p>
                          </div>
                        </div>

                        {alert.patient?.patientProfile?.allergies && (
                          <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
                              <div>
                                <h5 className="text-sm font-semibold text-orange-900 mb-1">Información Crítica</h5>
                                <p className="text-xs text-orange-800">
                                  <span className="font-medium">Alergias:</span><br />
                                  {alert.patient.patientProfile.allergies}
                                </p>
                                {alert.patient.patientProfile.history && (
                                  <p className="text-xs text-orange-800 mt-1">
                                    <span className="font-medium">Condiciones crónicas:</span><br />
                                    {alert.patient.patientProfile.history}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-4">Detalles de la Emergencia</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <AlertCircle size={16} />
                              <span className="text-xs font-medium">Tipo de emergencia</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{alert.type?.name || 'Caída'}</p>
                          </div>

                          {alert.latitude && alert.longitude && (
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <MapPin size={16} />
                                <span className="text-xs font-medium">Ubicación</span>
                              </div>
                              <p className="text-sm text-gray-900">
                                Lat: {alert.latitude}, Lng: {alert.longitude}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">350 metros desde el kiosco</p>
                            </div>
                          )}

                          {alert.description && (
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <span className="text-xs font-medium">Descripción del paciente:</span>
                              </div>
                              <p className="text-sm italic text-gray-700">"{alert.description}"</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-4">Acciones y Respuesta</h3>
                        <div className="space-y-3">
                          {alert.status === 'pendiente' && (
                            <>
                              <button
                                onClick={() => handleAccept(alert)}
                                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm"
                              >
                                ACEPTAR Y RESPONDER
                              </button>
                              <button
                                onClick={() => handleViewAlertHistory(alert)}
                                className="w-full px-4 py-3 border-2 border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium text-sm"
                              >
                                Ver Historial Completo
                              </button>
                            </>
                          )}

                          {alert.status === 'en curso' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <p className="text-xs text-blue-600 font-medium">Alerta asignada a ti</p>
                            </div>
                          )}

                          <button
                            onClick={() => handleGetDirections(alert)}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Navigation size={16} />
                            Obtener Direcciones
                          </button>

                          <button
                            onClick={() => handleCallPatient(alert)}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Phone size={16} />
                            Llamar al Paciente
                          </button>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                              <Clock size={16} />
                              <span className="text-xs font-medium">Tiempo estimado de respuesta</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">{estimatedTime} minutos</p>
                          </div>

                          {alert.status === 'pendiente' && (
                            <button
                              onClick={() => handleReject(alert.id)}
                              className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium mt-4"
                            >
                              Rechazar Alerta
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Pacientes Recientes</h2>
          </div>

          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
            {recentPatients.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">No hay pacientes recientes</p>
              </div>
            ) : (
              recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleViewPatientHistory(patient)}
                  className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{patient.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{patient.time}</p>
                      <p className="text-xs text-gray-600 mb-2">{patient.reason}</p>
                      <span className={`${patient.statusColor} text-white text-xs px-2 py-1 rounded-full font-medium inline-block`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <button
              onClick={() => handleViewPatientHistory(recentPatients[0])}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Ver historial completo
            </button>
          </div>
        </div>
      </div>

      {selectedAlert && (
        <EmergencyResponseModal
          isOpen={showResponseModal}
          onClose={handleCloseModal}
          alertId={selectedAlert.id}
          patientName={getPatientName(selectedAlert)}
        />
      )}

      {selectedPatient && (
        <PatientHistoryModal
          isOpen={showPatientModal}
          onClose={handleClosePatientModal}
          patient={{
            id: selectedPatient.id,
            name: selectedPatient.name,
            age: 22,
            gender: 'Femenino',
            studentId: 'EST-2023-1234',
            allergies: 'Penicilina, Polen',
            chronicConditions: 'Asma leve',
            lastVisit: 'hace 2 horas'
          }}
        />
      )}
    </div>
  );
};

export default Alerts;
