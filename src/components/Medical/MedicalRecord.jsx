import React, { useState } from "react";
import '../Dashboard/Dashboard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../SearchInput";
import TableMedicaldata from "./TableMedicalData";
import { Link } from "react-router-dom";

function MedicalRecord() {
  const [medicalData, setMedicalData] = useState([]);
  const [citizenData, setCitizenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (searchId) => {
    if (!searchId) {
      setError("Please enter a National ID.");
      return;
    }

    setMedicalData([]);
    setCitizenData(null);
    setError("");
    setLoading(true);

    try {
      const TOKEN = localStorage.getItem("userToken");

      const response = await fetch(
        `https://medical-website-production-1dc4.up.railway.app/medical-record/${searchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Medical data not found.");
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (!result.data || !result.data.medicalRecord) {
        throw new Error("Invalid data format: medical data is missing.");
      }

      setMedicalData(result.data.medicalRecord);
      setCitizenData(result.data.citizen);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="fw-bold text-primary">Medical Information</h1>
      <SearchInput onSearch={handleSearch} loading={loading} />
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="col-md-8 mt-5 card-container">
        <div className="card shadow-sm p-4 rounded-4 citizen_color">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-light p-3 rounded-circle">
              <FontAwesomeIcon icon={faNotesMedical} size="2x" color="blue" />
            </div>
            <h5 className="ms-3 fw-bold">Medical Details:</h5>
          </div>

          {citizenData && Array.isArray(citizenData) && citizenData.length > 0 && (
            <div className="mb-4">
              <p><strong>Full Name:</strong> {citizenData[0].full_name}</p>
            </div>
          )}

          {Array.isArray(medicalData) && medicalData.length > 0 && !error && (
            <div className="table-responsive">
              <TableMedicaldata data={medicalData} setData={setMedicalData} />
            </div>
          )}
        </div>
      </div>

      <div className="text-end mt-3">
        <Link to={'/dashboard'} className="btn btn-secondary btn-lg shadow-sm px-4">
          Back
        </Link>
      </div>
    </div>
  );
}

export default MedicalRecord;
