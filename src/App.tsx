import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Alerts from './pages/Alerts';
import Vitals from './pages/Vitals';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import KioskManagement from './pages/KioskManagement';
import MedicineInventory from './pages/MedicineInventory';
import KioskStaff from './pages/KioskStaff';
import Reports from './pages/Reports';
import CreateEmergencyReport from './pages/CreateEmergencyReport';
import CreateConsultationReport from './pages/CreateConsultationReport';
import CreateFollowUpReport from './pages/CreateFollowUpReport';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="vitals" element={<Vitals />} />
        <Route path="kiosk-management" element={<KioskManagement />} />
        <Route path="medicine-inventory" element={<MedicineInventory />} />
        <Route path="kiosk-staff" element={<KioskStaff />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/emergency/create" element={<CreateEmergencyReport />} />
        <Route path="reports/consultation/create" element={<CreateConsultationReport />} />
        <Route path="reports/followup/create" element={<CreateFollowUpReport />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

