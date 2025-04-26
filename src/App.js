import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import CitizenRecord from './components/Citizen/CitizenRecord';
import MedicalRecord from './components/Medical/MedicalRecord';
import CreateMedical from './components/Medical/CreateMedical';
import CreateCitizen from './components/Citizen/CreateCitizen';
import CreateRadiology from './components/Radiology/CreateRadiology';
import RadiologyData from './components/Radiology/RadiologyData';
import SignUp from './components/SignUp/SignUp';
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout';
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail';
import LogIn from './components/LogIn/LogIn';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import WelcomePage from './components/WelcomePage/WelcomePage';

const ProtectedRoute = ({ element }) => {
  const TOKEN = localStorage.getItem("userToken");
  return TOKEN ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<WelcomePage />} />
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/login" element={<LogIn />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/citizenrecord" element={<ProtectedRoute element={<CitizenRecord />} />} />
          <Route path="/addnewcitizen" element={<ProtectedRoute element={<CreateCitizen />} />} />
          <Route path="/medicalrecord" element={<ProtectedRoute element={<MedicalRecord />} />} />
          <Route path="/createmedical" element={<ProtectedRoute element={<CreateMedical />} />} />
          <Route path="/createradiology" element={<ProtectedRoute element={<CreateRadiology />} />} />
          <Route path="/radiologyrecord" element={<ProtectedRoute element={<RadiologyData />} />} />
          <Route path="/admindashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
        </Route>

       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
