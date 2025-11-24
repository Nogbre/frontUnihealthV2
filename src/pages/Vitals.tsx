import { useEffect, useState } from 'react';
import { Plus, Activity, Heart, Thermometer, Droplet } from 'lucide-react';
import { vitalsService, Vital, CreateVitalDto } from '../services/vitals.service';
import { patientsService, Patient } from '../services/patients.service';
import { format } from 'date-fns';

const Vitals = () => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateVitalDto>({
    patientId: 0,
    systolicBP: undefined,
    diastolicBP: undefined,
    heartRate: undefined,
    tempC: undefined,
    spo2: undefined,
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchVitals(selectedPatient);
    } else {
      setVitals([]);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const data = await patientsService.getAll();
      setPatients(data);
      if (data.length > 0 && !selectedPatient) {
        setSelectedPatient(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVitals = async (patientId: number) => {
    try {
      setLoading(true);
      const data = await vitalsService.getByPatient(patientId);
      setVitals(data);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vitalsService.create(formData);
      setShowModal(false);
      resetForm();
      if (formData.patientId) {
        fetchVitals(formData.patientId);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al registrar signos vitales');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: selectedPatient || 0,
      systolicBP: undefined,
      diastolicBP: undefined,
      heartRate: undefined,
      tempC: undefined,
      spo2: undefined,
    });
  };

  const openNewModal = () => {
    setFormData({
      patientId: selectedPatient || 0,
      systolicBP: undefined,
      diastolicBP: undefined,
      heartRate: undefined,
      tempC: undefined,
      spo2: undefined,
    });
    setShowModal(true);
  };

  if (loading && !selectedPatient) {
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
          <h1 className="text-3xl font-bold text-gray-900">Signos Vitales</h1>
          <p className="text-gray-600 mt-1">Registra y consulta signos vitales de pacientes</p>
        </div>
        <button onClick={openNewModal} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Registrar Signos Vitales
        </button>
      </div>

      {/* Patient Selector */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Paciente
        </label>
        <select
          value={selectedPatient || ''}
          onChange={(e) => setSelectedPatient(parseInt(e.target.value))}
          className="input-field"
        >
          <option value="">Seleccionar paciente...</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.patientProfile?.firstName} {patient.patientProfile?.lastName} (
              {patient.email})
            </option>
          ))}
        </select>
      </div>

      {/* Vitals List */}
      {selectedPatient ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vitals.length === 0 ? (
            <div className="col-span-full card text-center py-12">
              <Activity size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No hay registros de signos vitales</p>
            </div>
          ) : (
            vitals.map((vital) => (
              <div key={vital.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {format(new Date(vital.takenAt), "d 'de' MMMM, yyyy")}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {format(new Date(vital.takenAt), 'HH:mm')}
                  </span>
                </div>
                <div className="space-y-3">
                  {vital.systolicBP && vital.diastolicBP && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Droplet className="text-red-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Presión Arterial</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {vital.systolicBP}/{vital.diastolicBP} mmHg
                        </p>
                      </div>
                    </div>
                  )}
                  {vital.heartRate && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Heart className="text-pink-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Frecuencia Cardíaca</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {vital.heartRate} bpm
                        </p>
                      </div>
                    </div>
                  )}
                  {vital.tempC && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Thermometer className="text-orange-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Temperatura</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {vital.tempC} °C
                        </p>
                      </div>
                    </div>
                  )}
                  {vital.spo2 && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">SpO2</p>
                        <p className="text-sm font-semibold text-gray-900">{vital.spo2}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">Selecciona un paciente para ver sus signos vitales</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Registrar Signos Vitales
              </h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Presión Sistólica
                    </label>
                    <input
                      type="number"
                      value={formData.systolicBP || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          systolicBP: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="input-field"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Presión Diastólica
                    </label>
                    <input
                      type="number"
                      value={formData.diastolicBP || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diastolicBP: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="input-field"
                      placeholder="80"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia Cardíaca (bpm)
                  </label>
                  <input
                    type="number"
                    value={formData.heartRate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heartRate: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="input-field"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tempC || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tempC: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="input-field"
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SpO2 (%)</label>
                  <input
                    type="number"
                    value={formData.spo2 || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        spo2: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="input-field"
                    placeholder="98"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    Registrar
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

export default Vitals;

