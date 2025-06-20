import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faNotesMedical, faXRay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary">Medical Record Management System</h2>
      <p className="text-center">
        Efficiently manage patient, medical, and radiology information records in one secure platform.
      </p>
      <div className="row justify-content-center mt-5">
        {/* Citizen Records */}
        <div className="col-md-3">
          <div 
            className="card shadow-sm p-4 mb-4 rounded text-center dash_color"
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/citizenrecord')}>
            <div className="icon-container mb-3">
              <FontAwesomeIcon icon={faUser} size="2x" color="blue" />
            </div>
            <h4 className="fw-bold mb-0">Citizen Information</h4>
            <h6 className="text-muted">Patient Management</h6>
            <p className="text-muted">
              Create and manage basic patient information including personal details and medical history.
            </p>
            <div className="d-flex justify-content-between">
              <button 
                className="btn btn-primary m-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/addnewcitizen');
                }}>  Add new Citizen </button>
            </div>
          </div>
        </div>

        {/* Medical Records */}
        <div className="col-md-3">
          <div 
            className="card shadow-sm p-4 mb-4 rounded text-center dash_color"
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/medicalrecord')}>
            <div className="icon-container mb-3">
              <FontAwesomeIcon icon={faNotesMedical} size="2x" color="blue" />
            </div>
            <h4 className="fw-bold mb-0">Medical Information</h4>
            <h6 className="text-muted">Clinical Data</h6>
            <p className="text-muted">
              Manage diagnosis, treatments, and medical notes for registered patients.
            </p>
            <div className="d-flex justify-content-between">
              <button 
                className="btn btn-primary m-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/createmedical');
                }}
              >
                Add Medical information
              </button>
            </div>
          </div>
        </div>

        {/* Radiology Records */}
        <div className="col-md-3">
          <div 
            className="card shadow-sm p-4 mb-4 rounded text-center dash_color"
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/radiologyrecord')}
          >
            <div className="icon-container mb-3">
              <FontAwesomeIcon icon={faXRay} size="2x" color="blue" />
            </div>
            <h4 className="fw-bold mb-0">Radiology Information</h4>
            <h6 className="text-muted">Radiology Data</h6>
            <p className="text-muted">
              Store and retrieve radiology images, scans, and related diagnostic information.
            </p>
            <div className="d-flex justify-content-between">
              <button 
                className="btn btn-primary m-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/createradiology');
                }}
              >
                Add Radiology
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="dash-footer text-center mt-4">
        <small>© 2025 MCSEI - All rights reserved</small>
      </footer>
    </div>
  );
}
export default Dashboard;
