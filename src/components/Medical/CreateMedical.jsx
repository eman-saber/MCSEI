import { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import '../Citizen/CreateCitizen.css';

function CreateMedical() {
  const [nationalId, setNationalId] = useState(""); 
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicCode, setClinicCode] = useState("");

  const formSubmit = (e) => {
    e.preventDefault();

    const TOKEN = localStorage.getItem("userToken");
    if (!TOKEN) {
      Swal.fire({
        title: "Unauthorized",
        text: "⚠️ You must be logged in to perform this action.",
        icon: "warning",
        confirmButtonColor: "#d33",
      });
      return;
    }

    fetch("https://medical-website-production-1dc4.up.railway.app/medical-record/create-medical-record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        national_ID: nationalId,
        treatment: treatment.trim(),
        diagnosis: diagnosis.trim(),
        clinic_name: clinicName,
        clinic_code: Number(clinicCode),
      })
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "validation error") {
          throw new Error(result.details ? result.details.join(", ") : "Invalid data");
        }

        console.log("Response after creation:", result);
        Swal.fire({
          title: "Success!",
          text: "✅ Medical data created successfully!",
          icon: "success",
          confirmButtonColor: "#28a745",
        });

        setNationalId(""); 
        setDiagnosis("");
        setTreatment("");
        setClinicName("");
        setClinicCode("");
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Error!",
          text: `⚠️ An error occurred: ${error.message}`,
          icon: "error",
          confirmButtonColor: "#d33",
        });
      });
  };

  return (
    <div className="out-form">
      <div className="container p-4 bg-light rounded shadow-lg" style={{ border: "1px solid blue", borderRadius: "10px" }}>
        <h2 className="text-center fw-bold text-primary"> Add Medical Information</h2>

        <form className="row g-3" onSubmit={formSubmit}>
          {/* National ID */}
          <div className="col-md-6">
            <label htmlFor="NationalID" className="form-label fw-bold">National ID:</label>
            <input 
              type="text" 
              className="form-control" 
              id="NationalID" 
              placeholder="Enter National ID" 
              required 
              value={nationalId} 
              onChange={(e) => setNationalId(e.target.value)} 
            />
          </div>

          {/* Diagnosis */}
          <div className="">
            <label htmlFor="Diagnosis" className="form-label fw-bold">Diagnosis:</label>
            <input 
              type="text" 
              className="form-control" 
              id="Diagnosis" 
              placeholder="Enter Diagnosis" 
              required 
              value={diagnosis} 
              onChange={(e) => setDiagnosis(e.target.value)} 
            />
          </div>

          {/* Treatment */}
          <div className="">
            <label htmlFor="Treatment" className="form-label fw-bold">Treatment:</label>
            <input 
              type="text" 
              className="form-control" 
              id="Treatment" 
              placeholder="Enter Treatment" 
              required 
              value={treatment} 
              onChange={(e) => setTreatment(e.target.value)} 
            />
          </div>

          {/* Clinic Name */}
          <div className="">
            <label htmlFor="ClinicName" className="form-label fw-bold">Clinic Name:</label>
            <input 
              type="text" 
              className="form-control" 
              id="ClinicName" 
              placeholder="Enter Clinic Name" 
              required 
              value={clinicName} 
              onChange={(e) => setClinicName(e.target.value)} 
            />
          </div>

          {/* Clinic Code */}
          <div className="">
            <label htmlFor="ClinicCode" className="form-label fw-bold">Clinic Code:</label>
            <input 
              type="number" 
              className="form-control" 
              id="ClinicCode" 
              placeholder="Enter Clinic Code" 
              required 
              value={clinicCode} 
              onChange={(e) => setClinicCode(e.target.value)} 
            />
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <button type="submit" className="btn btn-primary shadow-sm px-4">Add</button>
            <Link to={'/'} className="btn btn-secondary shadow-sm px-4">Back</Link>
          </div>
        </form>
      </div>
    </div>
  );   
}

export default CreateMedical;
