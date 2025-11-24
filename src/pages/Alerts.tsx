import { useEffect, useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { alertsService, Alert, CreateAlertDto } from '../services/alerts.service';
import { patientsService, Patient } from '../services/patients.service';
import { format } from 'date-fns';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateAlertDto>({
    patientId: 0,
    typeId: 1,
    latitude: undefined,
    longitude: undefined,
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsData, patientsData] = await Promise.all([
        alertsService.getAll(),
        patientsService.getAll(),
      ]);
      setAlerts(alertsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await alertsService.create(formData);
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear alerta');
    }
  };

  const handleAssign = async (id: number) => {
    try {
      await alertsService.assignToMe(id);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al asignar alerta');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await alertsService.update(id, { status });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: 0,
      typeId: 1,
      latitude: undefined,
      longitude: undefined,
      description: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resuelta':
        return 'bg-green-100 text-green-800';
      case 'en curso':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resuelta':
        return <CheckCircle size={20} />;
      case 'en curso':
        return <Clock size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alertas</h1>
          <p className="text-gray-600 mt-1">Gestiona las alertas del sistema</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Nueva Alerta
        </button>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 gap-4">
        {alerts.length === 0 ? (
          <div className="card text-center py-12">
            <AlertTriangle size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No hay alertas registradas</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${getStatusColor(alert.status)}`}>
                      {getStatusIcon(alert.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.type?.name || 'Alerta'} - Paciente #{alert.patientId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(alert.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        alert.status
                      )}`}
                    >
                      {alert.status}
                    </span>
                  </div>
                  {alert.description && (
                    <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {alert.latitude && alert.longitude && (
                      <div>
                        <span className="font-medium">Ubicación:</span> {alert.latitude.toFixed(4)}
                        , {alert.longitude.toFixed(4)}
                      </div>
                    )}
                    {alert.assignedTo && (
                      <div>
                        <span className="font-medium">Asignado a:</span> {alert.assignedTo.email}
                      </div>
                    )}
                    {alert.resolvedAt && (
                      <div>
                        <span className="font-medium">Resuelta el:</span>{' '}
                        {format(new Date(alert.resolvedAt), "d 'de' MMMM, yyyy 'a las' HH:mm")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  {alert.status === 'pendiente' && (
                    <button
                      onClick={() => handleAssign(alert.id)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Asignar a mí
                    </button>
                  )}
                  {alert.status === 'en curso' && (
                    <button
                      onClick={() => handleStatusChange(alert.id, 'resuelta')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Marcar como Resuelta
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nueva Alerta</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paciente *
                  </label>
                  <select
                    value={formData.patientId}
                    onChange={(e) =>
                      setFormData({ ...formData, patientId: parseInt(e.target.value) })
                    }
                    required
                    className="input-field"
                  >
                    <option value="0">Seleccionar paciente...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.patientProfile?.firstName} {patient.patientProfile?.lastName} (
                        {patient.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Alerta ID *
                  </label>
                  <input
                    type="number"
                    value={formData.typeId}
                    onChange={(e) =>
                      setFormData({ ...formData, typeId: parseInt(e.target.value) })
                    }
                    required
                    className="input-field"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitud (opcional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="input-field"
                    placeholder="40.4168"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud (opcional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="input-field"
                    placeholder="-3.7038"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Descripción de la alerta..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    Crear Alerta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;

