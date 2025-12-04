import { apiService } from './api';

// Based on catalogs.md documentation
// These are hardcoded catalog values in the API

export interface ServiceType {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface AlertType {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface NoteType {
  id: number;
  codigo: string;
  nombre: string;
}

// Hardcoded catalog data based on documentation
// In a real implementation, these would come from API endpoints
export const catalogsService = {
  // Service Types for appointments
  getServiceTypes(): ServiceType[] {
    return [
      { id: 1, codigo: 'consulta_general', nombre: 'Consulta General', activo: true },
      { id: 2, codigo: 'urgencias', nombre: 'Urgencias', activo: true },
      { id: 3, codigo: 'especialidad', nombre: 'Consulta de Especialidad', activo: true },
      { id: 4, codigo: 'control', nombre: 'Control/Seguimiento', activo: true },
      { id: 5, codigo: 'vacunacion', nombre: 'Vacunación', activo: true },
    ];
  },

  // Alert Types
  getAlertTypes(): AlertType[] {
    return [
      { id: 1, codigo: 'emergencia', nombre: 'Emergencia Médica', activo: true },
      { id: 2, codigo: 'caida', nombre: 'Caída Detectada', activo: true },
      { id: 3, codigo: 'medicacion', nombre: 'Recordatorio de Medicación', activo: true },
      { id: 4, codigo: 'vitales', nombre: 'Signos Vitales Anormales', activo: true },
    ];
  },

  // Note Types for clinical records
  getNoteTypes(): NoteType[] {
    return [
      { id: 1, codigo: 'consulta', nombre: 'Nota de Consulta' },
      { id: 2, codigo: 'evolucion', nombre: 'Nota de Evolución' },
      { id: 3, codigo: 'ingreso', nombre: 'Nota de Ingreso' },
      { id: 4, codigo: 'egreso', nombre: 'Nota de Egreso' },
    ];
  },

  // Blood groups
  getBloodGroups(): string[] {
    return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  },

  // Gender options
  getGenders(): Array<{ value: string; label: string }> {
    return [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Femenino' },
      { value: 'O', label: 'Otro' },
    ];
  },

  // Alert status
  getAlertStatuses(): string[] {
    return ['pendiente', 'en_proceso', 'resuelta', 'cancelada'];
  },

  // Allergy severity
  getAllergySeverities(): Array<{ value: string; label: string }> {
    return [
      { value: 'mild', label: 'Leve' },
      { value: 'moderate', label: 'Moderada' },
      { value: 'severe', label: 'Severa' },
    ];
  },

  // Medical history types
  getMedicalHistoryTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'fisico', label: 'Físico' },
      { value: 'mental', label: 'Mental' },
    ];
  },
};
