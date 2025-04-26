import React, { useState } from "react";
import Swal from "sweetalert2";

function TableData({ data, setData }) {
  const [editingCitizen, setEditingCitizen] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const TOKEN = localStorage.getItem("userToken");

  const columns = ["Name", "National ID", "Blood Type", "Address", "Birth Date"];

  const handleEditClick = (citizen) => {
    setEditingCitizen(citizen);
    setUpdatedData({
      national_ID: citizen.national_ID || "",
      full_name: citizen.full_name || "",
      address: citizen.address || "",
      blood_type: citizen.blood_type || "",
      birth_date: citizen.birth_date ? citizen.birth_date.split("T")[0] : "",
    });
  };

  const handleDelete = async (national_ID) => {
    if (!national_ID || !TOKEN) {
      Swal.fire("Error", "Missing national ID or authentication token", "error");
      return;
    }

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Citizen?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const res = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/citizens/delete-citizen/${national_ID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!res.ok) throw new Error(await res.text());

        setData((prev) => prev.filter((c) => c.national_ID !== national_ID));
        Swal.fire("Deleted!", "✅ Citizen deleted successfully!", "success");
      } catch (error) {
        Swal.fire("Error", `⚠️ ${error.message}`, "error");
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingCitizen || !updatedData) return;

    const { national_ID, ...fields } = updatedData;

    if (national_ID.length !== 14 || !/^\d+$/.test(national_ID)) {
      Swal.fire("Error", "National ID must be 14 numeric digits.", "error");
      return;
    }

    const formattedData = {
      ...fields,
      birth_date: fields.birth_date ? new Date(fields.birth_date).toISOString().split("T")[0] : "",
    };

    const confirmUpdate = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (confirmUpdate.isConfirmed) {
      try {
        const res = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/citizens/update-citizen/${editingCitizen.national_ID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(formattedData),
          }
        );

        if (!res.ok) throw new Error(await res.text());

        setData((prev) =>
          prev.map((citizen) =>
            citizen.national_ID === national_ID ? { ...citizen, ...formattedData } : citizen
          )
        );
        setEditingCitizen(null);
        Swal.fire("Updated!", "✅ Citizen updated successfully!", "success");
      } catch (error) {
        Swal.fire("Error", `⚠️ ${error.message}`, "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      {data && data.length > 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <table className="table table-striped table-bordered text-center">
              <thead className="table-primary">
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((citizen, index) => (
                  <tr key={index}>
                    <td>{citizen.full_name}</td>
                    <td>{citizen.national_ID}</td>
                    <td>{citizen.blood_type}</td>
                    <td>{Array.isArray(citizen.address) ? citizen.address.join(", ") : citizen.address}</td>
                    <td>{citizen.birth_date?.split("T")[0]}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditClick(citizen)}
                        disabled={!TOKEN}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(citizen.national_ID)}
                        disabled={!TOKEN}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center">No data available</p>
      )}

      {editingCitizen && updatedData && (
        <div className="container mt-4">
          <h3 className="text-center">Update Citizen Data</h3>
          <form className="p-4 border rounded shadow bg-white">
            {Object.keys(updatedData).map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{key.replace("_", " ")}</label>
                <input
                  type={key === "birth_date" ? "date" : "text"}
                  className="form-control"
                  name={key}
                  value={updatedData[key]}
                  onChange={(e) => setUpdatedData({ ...updatedData, [key]: e.target.value })}
                  disabled={key === "national_ID"}
                />
              </div>
            ))}
            <div className="text-center mt-3">
              <button type="button" className="btn btn-success me-2" onClick={handleUpdate}>
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingCitizen(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TableData;
