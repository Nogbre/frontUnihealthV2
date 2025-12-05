import { clinicalRecordsService, ClinicalRecord } from './clinical-records.service';
import { patientsService } from './patients.service';
import { catalogsService } from './catalogs.service';

export interface Report {
  id: number;
  type: 'emergency' | 'consultation' | 'followup';
  patientName: string;
  patientId: number;
  date: string;
  time: string;
  status: 'completed' | 'draft';
  content?: string;
  createdBy: string;
}

// Map note type ID to report type
const mapNoteTypeToReportType = (noteTypeId: string): 'emergency' | 'consultation' | 'followup' => {
  // Based on catalogs: 1=consulta, 2=evolucion, 3=ingreso, 4=egreso
  // Map: consulta->consultation, evolucion->followup, ingreso/egreso->emergency
  switch (noteTypeId) {
    case '1': return 'consultation';
    case '2': return 'followup';
    case '3':
    case '4': return 'emergency';
    default: return 'consultation';
  }
};

// Map clinical record to report - now with eager patient data loading
const mapClinicalRecordToReport = async (record: ClinicalRecord): Promise<Report> => {
  const createdDate = new Date(record.createdAt);
  
  // Try to get patient name from the record first
  let patientName = 'Paciente desconocido';
  
  if (record.patient?.patientProfile) {
    patientName = `${record.patient.patientProfile.firstName} ${record.patient.patientProfile.lastName}`;
  } else if (record.patientId) {
    // If patient info is not in the record, fetch it separately
    try {
      const patient = await patientsService.getById(parseInt(record.patientId));
      if (patient.patientProfile) {
        patientName = `${patient.patientProfile.firstName} ${patient.patientProfile.lastName}`;
      } else if (patient.email) {
        patientName = patient.email;
      }
    } catch (error) {
      console.warn(`Could not fetch patient ${record.patientId}:`, error);
      patientName = record.patient?.email || 'Paciente desconocido';
    }
  }
  
  return {
    id: parseInt(record.id),
    type: mapNoteTypeToReportType(record.noteTypeId),
    patientName,
    patientId: parseInt(record.patientId),
    date: createdDate.toISOString().split('T')[0],
    time: createdDate.toTimeString().slice(0, 5),
    status: 'completed', // Clinical records are always completed once created
    content: record.note,
    createdBy: record.createdBy?.email || 'Doctor'
  };
};

export const reportsService = {
  getAll: async (): Promise<Report[]> => {
    console.log('📋 REPORTS - Fetching all reports via patients records');
    try {
      // 1. Get all patients
      const patients = await patientsService.getAll();
      
      // 2. Get records for each patient in parallel
      const recordsPromises = patients.map(patient => 
        clinicalRecordsService.getByPatient(patient.id)
          .catch(err => {
            console.error(`Failed to fetch records for patient ${patient.id}`, err);
            return [] as ClinicalRecord[];
          })
      );
      
      const recordsArrays = await Promise.all(recordsPromises);
      
      // 3. Flatten and map with patient data
      const allRecords = recordsArrays.flat();
      const reportsPromises = allRecords.map(record => mapClinicalRecordToReport(record));
      const reports = await Promise.all(reportsPromises);
      
      // Sort by date descending
      reports.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

      console.log('✅ REPORTS - Fetched', reports.length, 'reports from', patients.length, 'patients');
      return reports;
    } catch (error) {
      console.error('❌ REPORTS - Error fetching:', error);
      return [];
    }
  },

  getById: async (id: number): Promise<Report | undefined> => {
    console.log('🔍 REPORTS - Fetching report:', id);
    try {
      const record = await clinicalRecordsService.getById(id.toString());
      return await mapClinicalRecordToReport(record);
    } catch (error) {
      console.error('❌ REPORTS - Error fetching by id:', error);
      return undefined;
    }
  },

  getByType: async (type: 'emergency' | 'consultation' | 'followup'): Promise<Report[]> => {
    console.log('📋 REPORTS - Fetching by type:', type);
    try {
      const allReports = await reportsService.getAll();
      return allReports.filter(r => r.type === type);
    } catch (error) {
      console.error('❌ REPORTS - Error fetching by type:', error);
      return [];
    }
  },

  getDrafts: async (): Promise<Report[]> => {
    console.log('📋 REPORTS - Fetching drafts');
    try {
      // Clinical records don't have draft status
      return [];
    } catch (error) {
      console.error('❌ REPORTS - Error fetching drafts:', error);
      return [];
    }
  },

  getStats: async () => {
    console.log('📊 REPORTS - Fetching stats');
    try {
      const allReports = await reportsService.getAll();
      const total = allReports.length;
      const completed = allReports.filter(r => r.status === 'completed').length;
      const drafts = 0; // No drafts in clinical records
      const emergency = allReports.filter(r => r.type === 'emergency').length;
      const consultation = allReports.filter(r => r.type === 'consultation').length;
      const followup = allReports.filter(r => r.type === 'followup').length;

      console.log('✅ REPORTS - Stats:', { total, emergency, consultation, followup });
      return { total, completed, drafts, emergency, consultation, followup };
    } catch (error) {
      console.error('❌ REPORTS - Error fetching stats:', error);
      return {
        total: 0,
        completed: 0,
        drafts: 0,
        emergency: 0,
        consultation: 0,
        followup: 0
      };
    }
  }
};


