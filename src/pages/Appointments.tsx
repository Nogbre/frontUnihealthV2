import { useEffect, useState } from 'react';
import { Plus, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import {
  appointmentsService,
  Appointment,
  CreateAppointmentDto,
} from '../services/appointments.service';
import { patientsService, Patient } from '../services/patients.service';
import { usersService, User } from '../services/users.service';
import { format } from 'date-fns';

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [nurses, setNurses] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateAppointmentDto>({
    patientId: 0,
    nurseId: 0,
    serviceTypeId: 1,
    start: '',
    end: '',
    reason: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appts, pats, usrs] = await Promise.all([
        appointmentsService.getAll(),
        patientsService.getAll(),
        usersService.getAll(),
      ]);
      setAppointments(appts);
      setPatients(pats);
      // Assuming nurses are users with a specific role, for now using all users
      setNurses(usrs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await appointmentsService.create(formData);
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear cita');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await appointmentsService.updateStatus(id, status);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: 0,
      nurseId: 0,
      serviceTypeId: 1,
      start: '',
      end: '',
      reason: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Citas</h1>
          <p className="text-gray-600 mt-1">Gestiona las citas médicas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Nueva Cita
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 gap-4">
        {appointments.length === 0 ? (
          <div className="card text-center py-12">
            <CalendarIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No hay citas programadas</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {format(new Date(appointment.start), "EEEE, d 'de' MMMM, yyyy")}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Horario:</span>{' '}
                      {format(new Date(appointment.start), 'HH:mm')} -{' '}
                      {format(new Date(appointment.end), 'HH:mm')}
                    </div>
                    <div>
                      <span className="font-medium">Paciente ID:</span> {appointment.patientId}
                    </div>
                    <div>
                      <span className="font-medium">Enfermero ID:</span> {appointment.nurseId}
                    </div>
                    <div>
                      <span className="font-medium">Tipo de Servicio ID:</span>{' '}
                      {appointment.serviceTypeId}
                    </div>
                  </div>
                  {appointment.reason && (
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Motivo:</span> {appointment.reason}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  {appointment.status === 'solicitada' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'confirmada')}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'cancelada')}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <XCircle size={16} className="mr-1" />
                        Cancelar
                      </button>
                    </>
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nueva Cita</h2>
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
                    Enfermero *
                  </label>
                  <select
                    value={formData.nurseId}
                    onChange={(e) =>
                      setFormData({ ...formData, nurseId: parseInt(e.target.value) })
                    }
                    required
                    className="input-field"
                  >
                    <option value="0">Seleccionar enfermero...</option>
                    {nurses.map((nurse) => (
                      <option key={nurse.id} value={nurse.id}>
                        {nurse.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Servicio ID *
                  </label>
                  <input
                    type="number"
                    value={formData.serviceTypeId}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceTypeId: parseInt(e.target.value) })
                    }
                    required
                    className="input-field"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y Hora Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y Hora Fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    Crear Cita
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

export default Appointments;

