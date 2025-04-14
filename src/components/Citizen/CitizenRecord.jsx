import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CitizenRecord.css";
import SearchInput from "../SearchInput";
import TableData from "./TableData";
import './CreateCitizen.css';
import { Link } from "react-router-dom";

function CitizenRecord() {
  const [citizenData, setCitizenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (searchId) => {
    setCitizenData([]);
    setError("");
    setLoading(true);

    try {
      const TOKEN = localStorage.getItem("userToken");
      console.log("TOKEN:", TOKEN);
      
 
      if (!searchId) {
        setError("Please enter a valid National ID.");
        return;
      }


      const response = await fetch(
        `https://medical-website-production-1dc4.up.railway.app/citizens/search?national_ID=${searchId}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          }
        }
      );

      if (!response.ok) {
        // throw new Error("Citizen not found.");
        console.log(response);
        throw new Error(response?.message);

      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (!result || typeof result !== "object") {
        throw new Error("Invalid data format: expected an object");
      }


      const citizen = result.citizen; 

      if (!citizen || typeof citizen !== "object") {
        throw new Error("Invalid data format: citizen is not an object");
      }


      setCitizenData([citizen]); 

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="fw-bold text-primary">Citizen Information</h1>
      <SearchInput onSearch={handleSearch} loading={loading} />
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="col-md-8 mt-5 card-container">
        <div className="card shadow-sm p-4 rounded-4 citizen_color" style={{ width: "150%" }}>
          <div className="d-flex align-items-center mb-3">
            <div className="bg-light p-3 rounded-circle">
              <FaUser className="fs-4 me-2" style={{ color: "blue" }} />
            </div>
            <h5 className="ms-3 fw-bold">Personal Details:</h5>
          </div>

          {citizenData.length > 0 && <TableData data={citizenData} setData={setCitizenData} />}
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

export default CitizenRecord;
