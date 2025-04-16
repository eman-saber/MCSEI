import React, { useState } from "react";
import Swal from "sweetalert2";

function TableRadiologydata({ data, setData }) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const TOKEN = localStorage.getItem("userToken");

  const handleDelete = async (national_ID, _id) => {
    if (!national_ID || !_id) {
      Swal.fire("Error", "Cannot delete record because the ID is missing!", "error");
      return;
    }

    if (!TOKEN) {
      Swal.fire("Unauthorized", "You are not authorized to delete records!", "error");
      return;
    }

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/radiology/delete-radiology/${national_ID}/${_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete record. Status: ${response.status}`);
        }

        setData((prevData) => prevData.filter((record) => record._id !== _id));

        Swal.fire("Deleted!", "✅ Record deleted successfully!", "success");
      } catch (error) {
        Swal.fire("Error", `An error occurred: ${error.message}`, "error");
      }
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setUpdatedData({ ...record });
  };

  const handleUpdate = async () => {
    if (!editingRecord || !TOKEN) {
      Swal.fire("Unauthorized", "You are not authorized to update records!", "error");
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
        const { _id, createdAt, updatedAt, __v, radiology_date, ...allowedData } = updatedData;

        if (!allowedData.radiology_type) {
          Swal.fire("Missing Data", "Please fill all required fields.", "error");
          return;
        }

        const formData = new FormData();
        formData.append("radiology_type", allowedData.radiology_type);
        formData.append("radiologistNotes", allowedData.radiologistNotes);

        if (updatedData.images instanceof File) {
          formData.append("file", updatedData.images);
        }

        const response = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/radiology/update-radiology/${editingRecord.national_ID}/${editingRecord._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update: ${errorText}`);
        }

        setData((prevData) =>
          prevData.map((record) =>
            record._id === editingRecord._id ? { ...updatedData } : record
          )
        );
        setEditingRecord(null);

        Swal.fire("Updated!", "✅ Record updated successfully!", "success");
      } catch (error) {
        Swal.fire("Error", `⚠️ ${error.message}`, "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      {data && data.length > 0 ? (
        <div className="row">
          <div className="col-md-10 mx-auto overflow-x-auto">
            <table className="table table-striped table-bordered table-hover text-center">
              <thead className="table-primary">
                <tr>
                  <th>National ID</th>
                  <th>Radiology Type</th>
                  <th>Radiologist Notes</th>
                  <th>Radiology Date</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row._id}>
                    <td>{row.national_ID}</td>
                    <td>{row.radiology_type}</td>
                    <td>{row.radiologistNotes}</td>
                    <td>
                      {row.radiology_date
                        ? new Date(row.radiology_date).toISOString().split("T")[0]
                        : ""}
                    </td>
                    <td>
                      {row.images && row.images.length > 0 ? (
                        <a
                          href={row.images[0].secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Image
                        </a>
                      ) : (
                        "No Image"
                      )}
                    </td>
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
                        onClick={() => handleDelete(row.national_ID, row._id)} // تم تعديلها هنا
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
        <p className="text-center">No radiology data available</p>
      )}

      {editingRecord && (
        <div className="container mt-4">
          <h3 className="text-center">Update Radiology Data</h3>
          <form className="p-4 border rounded shadow bg-white">
            <div className="mb-3">
              <label className="form-label">National ID</label>
              <input
                type="text"
                className="form-control"
                value={updatedData.national_ID || ""}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Radiology Type</label>
              <input
                type="text"
                className="form-control"
                value={updatedData.radiology_type || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, radiology_type: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Radiologist Notes</label>
              <input
                type="text"
                className="form-control"
                value={updatedData.radiologistNotes || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, radiologistNotes: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Radiology Date</label>
              <input
                type="date"
                className="form-control"
                value={updatedData.radiology_date
                  ? new Date(updatedData.radiology_date).toISOString().split("T")[0]
                  : ""}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, images: e.target.files[0] })
                }
              />
            </div>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Update Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TableRadiologydata;
