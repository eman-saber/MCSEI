import React, { useState} from "react";
import Swal from "sweetalert2";

function TableData({ data, setData }) {
  const [editingCitizen, setEditingCitizen] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);

  const columns = ["Name", "Gender","National ID", "Blood Type", "Address", "Birth Date"];

  
  const TOKEN = localStorage.getItem("userToken");


  return (
    <div className="container mt-4">
      {data && data.length > 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <table className="table table-striped table-bordered table-hover text-center">
              <thead className="table-primary">
                <tr>
                  {columns.map((header) => (
                    <th key={header}>{header.replace("_", " ")}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((citizen, index) => (
                  <tr key={index}>
                    <td>{citizen.full_name || ""}</td>
                    <td>{citizen.gender||"" }</td>
                    <td>{citizen.national_ID || ""}</td>
                    <td>{citizen.blood_type || ""}</td>
                    <td>{Array.isArray(citizen.address) ? citizen.address.join(", ") : citizen.address || ""}</td>
                    <td>{citizen.birth_date ? citizen.birth_date.split("T")[0] : ""}</td>
                    
                    
                    <td>
                      {TOKEN && (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditClick(citizen)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(citizen._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {!TOKEN && (
                        <>
                          <button className="btn btn-warning btn-sm me-2" disabled>
                            Update
                          </button>
                          <button className="btn btn-danger btn-sm" disabled>
                            Delete
                          </button>
                        </>
                      )}
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
                  value={updatedData[key] || ""}
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


  function handleEditClick(citizen) {
    setEditingCitizen(citizen);
    setUpdatedData({
      national_ID: citizen.national_ID || "",
      full_name: citizen.full_name || "",
      gender:citizen.gender||"",
      address: Array.isArray(citizen.address) ? citizen.address.join(", ") : citizen.address || "",
      blood_type: citizen.blood_type || "",
      birth_date: citizen.birth_date ? citizen.birth_date.split("T")[0] : "",
    });
  }

  async function handleDelete(id) {
    if (!id) {
      Swal.fire("Error", "Cannot delete citizen because the ID is missing!", "error");
      return;
    }

    if (!TOKEN) {
      Swal.fire("Error", "User is not authenticated", "error");
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
        const response = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/citizens/delete-citizen/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to delete citizen: ${errorMessage}`);
        }

        setData((prevData) => prevData.filter((citizen) => citizen._id !== id));
        Swal.fire("Deleted!", "✅ Citizen deleted successfully!", "success");
      } catch (error) {
        Swal.fire("Error", "You cannot delete this citizen's data. Please contact the administrator or go to the authorized section to perform this action.", "error");
      }
    }
  }


  async function handleUpdate() {
    if (!editingCitizen) return;

    const { _id, national_ID, ...updatedFields } = updatedData;

    const formattedData = {
      ...updatedFields,
      birth_date: updatedFields.birth_date ? new Date(updatedFields.birth_date).toISOString().split("T")[0] : "",
    };

    if (!TOKEN) {
      Swal.fire("Error", "User is not authenticated", "error");
      return;
    }

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
        const response = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/citizens/update-citizen/${editingCitizen._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(formattedData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update citizen: ${errorText}`);
        }

        setData((prevData) =>
          prevData.map((citizen) =>
            citizen._id === editingCitizen._id ? { ...citizen, ...formattedData } : citizen
          )
        );
        setEditingCitizen(null);

        Swal.fire("Updated!", "✅ Citizen updated successfully!", "success");
      } catch (error) {
        Swal.fire("Error", `⚠️ An error occurred: ${error.message}`, "error");
      }
    }
  }
}

export default TableData;
