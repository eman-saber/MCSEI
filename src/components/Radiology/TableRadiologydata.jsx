import React, { useState } from "react";
import Swal from "sweetalert2";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

function TableRadiologydata({ data, setData }) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedData, setUpdatedData] = useState({ images: [] });
  const TOKEN = localStorage.getItem("userToken");

  const loadDicomImage = (imageUrl) => {
    const element = document.getElementById("dicomImage");
    if (!element) return Swal.fire("Error", "Viewer not found", "error");

    const urlLower = imageUrl.toLowerCase();
    const isDicom = urlLower.includes(".dcm");

    try {
      if (isDicom) {
        cornerstone.enable(element);
        cornerstone
          .loadImage("wadouri:" + imageUrl)
          .then((image) => cornerstone.displayImage(element, image))
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Failed to load DICOM image", "error");
          });
      } else {
        cornerstone.disable(element);
        element.innerHTML = `<img src="${imageUrl}" alt="Image" style="max-width:100%; max-height:500px;" />`;
      }
    } catch (err) {
      Swal.fire("Error", "Viewer initialization failed", "error");
      console.error(err);
    }
  };

  const handleDelete = async (national_ID, _id) => {
    if (!TOKEN) return Swal.fire("Unauthorized", "Login required", "error");

    const confirm = await Swal.fire({
      title: "Confirm Delete",
      text: "Do you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/radiology/delete-radiology/${national_ID}/${_id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}` },
          }
        );
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        setData((prev) => prev.filter((r) => r._id !== _id));
        Swal.fire("Deleted!", "✅ Record removed", "success");
      } catch (e) {
        Swal.fire("Error", e.message, "error");
      }
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setUpdatedData({ ...record, images: [] });
  };

  const handleUpdate = async () => {
    if (!TOKEN || !editingRecord)
      return Swal.fire("Unauthorized", "Login required", "error");

    const confirm = await Swal.fire({
      title: "Confirm Update",
      text: "Do you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    });

    if (confirm.isConfirmed) {
      try {
        const { _id, createdAt, updatedAt, __v, radiology_date, ...validData } = updatedData;

        if (!validData.radiology_type) {
          return Swal.fire("Missing Data", "Please fill required fields.", "error");
        }

        const formData = new FormData();
        formData.append("radiology_type", validData.radiology_type);
        formData.append("radiologistNotes", validData.radiologistNotes || "");

        if (Array.isArray(updatedData.images)) {
          updatedData.images.forEach((file) => {
            if (file instanceof File) formData.append("file", file);
          });
        }

        const res = await fetch(
          `https://medical-website-production-1dc4.up.railway.app/radiology/update-radiology/${editingRecord.national_ID}/${editingRecord._id}`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${TOKEN}` },
            body: formData,
          }
        );

        if (!res.ok) throw new Error(await res.text());

        setData((prevData) =>
          prevData.map((record) =>
            record._id === editingRecord._id
              ? { ...record, ...updatedData }
              : record
          )
        );
        setEditingRecord(null);
        Swal.fire("Updated!", "✅ Record updated", "success");
      } catch (e) {
        Swal.fire("Error", e.message, "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      {data?.length > 0 ? (
        <div className="row">
          <div className="col-md-10 mx-auto overflow-x-auto">
            <table className="table table-striped table-bordered table-hover text-center">
              <thead className="table-primary">
                <tr>
                  <th>National ID</th>
                  <th>Radiology Type</th>
                  <th>Notes</th>
                  <th>Date</th>
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
                      {row.radiology_date &&
                        new Date(row.radiology_date).toISOString().split("T")[0]}
                    </td>
                    <td>
                      {row.images?.length > 0 ? (
                        <div className="d-flex flex-wrap justify-content-center">
                          {row.images.map((image, idx) => (
                            <div key={idx} className="m-1 text-center">
                              <button
                                className="btn btn-outline-info btn-sm d-block mb-1"
                                onClick={() => loadDicomImage(image.secure_url)}
                              >
                                View {image.secure_url.toLowerCase().includes(".dcm") ? "DICOM" : "Image"}
                              </button>
                              <a
                                href={image.secure_url}
                                className="btn btn-outline-secondary btn-sm d-block"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditClick(row)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row.national_ID, row._id)}
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
          <h3 className="text-center">Update Radiology Record</h3>
          <form className="p-4 border rounded shadow bg-white">
            <div className="mb-3">
              <label>National ID</label>
              <input className="form-control" value={updatedData.national_ID} readOnly />
            </div>
            <div className="mb-3">
              <label>Radiology Type</label>
              <input
                className="form-control"
                value={updatedData.radiology_type || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, radiology_type: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Radiologist Notes</label>
              <input
                className="form-control"
                value={updatedData.radiologistNotes || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, radiologistNotes: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Upload New Images</label>
              <input
                type="file"
                className="form-control"
                accept=".dcm,image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setUpdatedData({ ...updatedData, images: files });
                }}
              />
            </div>
            <button type="button" className="btn btn-success" onClick={handleUpdate}>
              Save Changes
            </button>
          </form>
        </div>
      )}

      <div
        id="dicomImage"
        style={{ width: "100%", height: "500px", textAlign: "center" }}
      ></div>
    </div>
  );
}

export default TableRadiologydata;
