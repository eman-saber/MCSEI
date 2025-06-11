import React, { useState } from "react";
import Swal from "sweetalert2";

function TableMedicaldata({ data, setData }) {
  const [editingMedical, setEditingMedical] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    national_ID: "",
    diagnosis: "",
    treatment: "",
    clinic_name: "",
    clinic_code: "",
    recode_date: "",
  });

  const TOKEN = localStorage.getItem("userToken");

  const columns = [
    "national_ID",
    "diagnosis",
    "treatment",
    "clinic_name",
    "clinic_code",
    "recode_date",
  ];

  const columnNames = {
    national_ID: "National ID",
    diagnosis: "Diagnosis",
    treatment: "Treatment",
    clinic_name: "Clinic Name",
    clinic_code: "Clinic Code",
    recode_date: "Date",
  };

  const handleDelete = async (medical) => {
    if (!TOKEN) {
      Swal.fire("Error", "User is not authenticated", "error");
      return;
    }

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this medical record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(
          `https://medical-website-mocha.vercel.app/medical-record/delete-medical-record/${medical.national_ID}/${medical._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete medical data.");
        }

        setData((prevData) =>
          prevData.filter((m) => m._id !== medical._id)
        );

        Swal.fire("Deleted!", "✅ Medical record deleted successfully!", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleEditClick = (medical) => {
    setEditingMedical(medical);
    setUpdatedData({ ...medical });
  };

  const handleUpdate = async () => {
    if (!editingMedical || !TOKEN) {
      Swal.fire("Error", "User is not authenticated or no record selected", "error");
      return;
    }

    try {
      let filteredData = { ...updatedData };

      filteredData.diagnosis = updatedData.diagnosis;
      filteredData.treatment = updatedData.treatment;

      if (filteredData.clinic_name.length < 3) {
        Swal.fire("Error", "Clinic name must be at least 3 characters long!", "error");
        return;
      }

      filteredData.clinic_code = String(filteredData.clinic_code);

      delete filteredData._id;
      delete filteredData.recode_date;
      delete filteredData.modified_on;
      delete filteredData.__v;
      delete filteredData.status;

      const confirmUpdate = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to save the changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (!confirmUpdate.isConfirmed) return;

      const response = await fetch(
        `https://medical-website-mocha.vercel.app/medical-record/update-medical-record/${editingMedical.national_ID}/${editingMedical._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(filteredData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update medical record.");
      }

      setData((prevData) =>
        prevData.map((medical) =>
          medical._id === editingMedical._id
            ? { ...medical, ...filteredData }
            : medical
        )
      );

      setEditingMedical(null);
      Swal.fire("Updated!", "✅ Medical record updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", `⚠️ An error occurred: ${error.message}`, "error");
    }
  };

  return (
    <div className="container mt-4">
      <table className="table table-striped table-bordered table-hover text-center">
        <thead className="table-primary">
          <tr>
            {columns.map((header) => (
              <th key={header}>{columnNames[header]}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((key) => (
                  <td key={key}>
                    {key === "recode_date" && row[key]
                      ? row[key].split("T")[0]
                      : row[key] || ""}
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(row)}
                    disabled={!TOKEN}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(row)}
                    disabled={!TOKEN}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                {data.length === 0 ? "No medical records found" : "Loading..."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingMedical && (
        <div className="container mt-4">
          <h3 className="text-center">Update Medical Record</h3>
          <form className="p-4 border rounded shadow bg-white">
            {columns.map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{columnNames[key]}</label>
                <input
                  type={key === "recode_date" ? "date" : "text"}
                  className="form-control"
                  name={key}
                  value={
                    key === "recode_date" && updatedData[key]
                      ? updatedData[key].split("T")[0]
                      : updatedData[key] || ""
                  }
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, [key]: e.target.value })
                  }
                  disabled={key === "national_ID"}
                />
              </div>
            ))}
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingMedical(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TableMedicaldata;
