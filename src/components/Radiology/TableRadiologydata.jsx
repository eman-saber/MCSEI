import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import cornerstoneTools from "cornerstone-tools";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

function TableRadiologydata({ data, setData }) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedData, setUpdatedData] = useState({ images: [] });
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [viewedRecordId, setViewedRecordId] = useState(null);
  const TOKEN = localStorage.getItem("userToken");

  const getFileExtension = (url) => {
    const parts = url.split(".");
    if (parts.length > 1) {
      return "." + parts.pop().split("?")[0].split("#")[0];
    }
    return "";
  };

  const loadDicomImage = (imageUrl, recordId, index) => {
    const element = document.getElementById("dicomImage");
    if (!element) return Swal.fire("Error", "Viewer not found", "error");

    const urlLower = imageUrl.toLowerCase();
    const isDicom = urlLower.includes(".dcm");

    try {
      setCurrentImageIndex(index);
      setViewedRecordId(recordId);

      if (isDicom) {
        cornerstone.enable(element);
        cornerstone
          .loadImage("wadouri:" + imageUrl)
          .then((image) => {
            cornerstone.displayImage(element, image);
            cornerstone.resize(element);
            cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
            cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
            cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
            cornerstoneTools.setToolConfiguration(cornerstoneTools.WwwcTool, {
              mouseButtonMask: 1,
              scrollWheelPrecision: 4,
            });
            cornerstoneTools.setToolConfiguration(cornerstoneTools.ZoomTool, {
              mouseButtonMask: 2,
              zoomSpeed: 4,
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Failed to load DICOM image", "error");
          });
      } else {
        cornerstone.disable(element);
        element.innerHTML = `
          <div style="text-align:center">
            <img src="${imageUrl}" alt="Image" style="max-width:100%; max-height:600px; display:block; margin:auto;" />
          </div>
        `;
      }
    } catch (err) {
      Swal.fire("Error", "Viewer initialization failed", "error");
      console.error(err);
    }
  };

  const navigateImage = (direction) => {
    const currentRecord = data.find((r) => r._id === viewedRecordId);
    if (!currentRecord || !currentRecord.images || currentImageIndex == null) return;

    let newIndex = currentImageIndex;
    if (direction === "next") newIndex++;
    else if (direction === "prev") newIndex--;

    if (newIndex >= 1 && newIndex <= currentRecord.images.length) {
      const nextImage = currentRecord.images[newIndex - 1];
      loadDicomImage(nextImage.secure_url, currentRecord._id, newIndex);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") navigateImage("next");
      if (e.key === "ArrowLeft") navigateImage("prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      Swal.fire("Error", "Failed to download the image", "error");
      console.error("Download error:", error);
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
          `https://medical-website-five-xi.vercel.app/radiology/delete-radiology/${national_ID}/${_id}`,
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
        const {
          _id,
          createdAt,
          updatedAt,
          __v,
          radiology_date,
          images,
          ...validData
        } = updatedData;

        if (!validData.radiology_type) {
          return Swal.fire("Missing Data", "Please fill required fields.", "error");
        }

        const formData = new FormData();
        formData.append("radiology_type", validData.radiology_type);
        formData.append("radiologistNotes", validData.radiologistNotes || "");

        if (Array.isArray(images)) {
          images.forEach((file) => {
            if (file instanceof File) {
              formData.append("file", file);
            }
          });
        }

        const res = await fetch(
          `https://medical-website-five-xi.vercel.app/radiology/update-radiology/${editingRecord.national_ID}/${editingRecord._id}`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${TOKEN}` },
            body: formData,
          }
        );

        if (!res.ok) throw new Error(await res.text());

        const updatedImages = [
          ...(editingRecord.images || []),
          ...(images?.filter((img) => img instanceof File).map((f) => ({ secure_url: URL.createObjectURL(f) })) || []),
        ];

        setData((prevData) =>
          prevData.map((record) =>
            record._id === editingRecord._id
              ? { ...record, ...validData, images: updatedImages }
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
                          {row.images.map((image, idx) => {
                            const isActive =
                              row._id === viewedRecordId &&
                              currentImageIndex === idx + 1;
                            return (
                              <div key={idx} className="m-1 text-center">
                                <span className="d-block mb-1">Image {idx + 1}</span>
                                <button
                                  className={`btn btn-sm d-block mb-1 ${
                                    isActive ? "btn-primary" : "btn-outline-info"
                                  }`}
                                  onClick={() =>
                                    loadDicomImage(image.secure_url, row._id, idx + 1)
                                  }
                                >
                                  View {image.secure_url.toLowerCase().includes(".dcm") ? "DICOM" : "Image"}
                                </button>
                                <a
                                  href={image.secure_url}
                                  className="btn btn-outline-secondary btn-sm d-block mb-1"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Open
                                </a>
                                <button
                                  className="btn btn-outline-success btn-sm d-block"
                                  onClick={() =>
                                    downloadImage(
                                      image.secure_url,
                                      `${row.national_ID}_image_${idx + 1}${getFileExtension(image.secure_url)}`
                                    )
                                  }
                                >
                                  Download
                                </button>
                              </div>
                            );
                          })}
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
                  const newFiles = Array.from(e.target.files);
                  setUpdatedData((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), ...newFiles],
                  }));
                }}
              />
            </div>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="button" className="btn btn-success" onClick={handleUpdate}>
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingRecord(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        id="dicomImage"
        style={{ width: "100%", height: "500px", textAlign: "center", marginTop: "20px" }}
      >
      </div>
    </div>
  );
}

export default TableRadiologydata;
