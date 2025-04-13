import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import CitizenRecord from './components/Citizen/CitizenRecord';
import MedicalRecord from './components/Medical/MedicalRecord';
import CreateMedical from './components/Medical/CreateMedical';
import CreateCitizen from './components/Citizen/CreateCitizen';
import CreateRadiology from './components/Radiology/CreateRadiology';
// import ViewAllCitizen from './components/Citizen/ViewAllCitizen';
// import ViewAllMedical from './components/Medical/ViewAllMedical';
import RadiologyData from './components/Radiology/RadiologyData';
// import ViewAllRadiology from './components/Radiology/ViewAllRadiology';
import SignUp from './components/SignUp/SignUp';
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout';
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail';
import LogIn from './components/LogIn/LogIn';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/login" element={<LogIn />} />
      </Route>
      <Route element={<MainLayout />}>
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/citizenrecord" element={<CitizenRecord />} />
        <Route path="/addnewcitizen" element={<CreateCitizen />} />
        {/* <Route path="/viewcitizens" element={<ViewAllCitizen />} /> */}
        <Route path="/medicalrecord" element={<MedicalRecord />} />
        <Route path="/createmedical" element={<CreateMedical />} />
        {/* <Route path="/viewmedicalrecords" element={<ViewAllMedical />} /> */}
        <Route path="/createradiology" element={<CreateRadiology />} />
        <Route path="/radiologyrecord" element={<RadiologyData />} />
        {/* <Route path="/viewradiology" element={<ViewAllRadiology />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
