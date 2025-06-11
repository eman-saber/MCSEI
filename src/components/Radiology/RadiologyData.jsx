import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXRay } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../SearchInput";
import TableRadiologydata from "../Radiology/TableRadiologydata";
import { Link, useNavigate } from "react-router-dom";

function RadiologyData() {
  const [radiologyData, setRadiologyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSearch = async (searchId) => {
    if (!searchId) {
      setError("Please enter a National ID.");
      return;
    }

    setRadiologyData([]);
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(
        `https://medical-website-mocha.vercel.app/radiology/${searchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(`Radiology data not found. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (result && result.data && result.data.length > 0) {
        setRadiologyData(result.data);
        navigate(`/radiologyrecord/${searchId}`);
      } else {
        throw new Error("No radiology records found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="fw-bold text-primary">Radiology Information</h1>

      <SearchInput onSearch={handleSearch} loading={loading} />

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="col-md-8 mt-5 card-container">
        <div className="card shadow-sm p-4 rounded-4 citizen_color">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-light p-3 rounded-circle">
              <FontAwesomeIcon icon={faXRay} size="2x" color="blue" />
            </div>
            <h5 className="ms-3 fw-bold">Radiology Details:</h5>
          </div>

          {radiologyData.length > 0 && !error && (
            <div className="table-responsive">
              <TableRadiologydata
                data={radiologyData}
                setData={setRadiologyData}
              />
            </div>
          )}
        </div>
      </div>

      <div className="text-end mt-3">
        <Link to={"/dashboard"} className="btn btn-secondary btn-lg shadow-sm px-4">
          Back
        </Link>
      </div>
    </div>
  );
}

export default RadiologyData;
