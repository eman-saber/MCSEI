import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import'../Citizen/CreateCitizen.css';

const RadiologyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    national_ID: "",
    radiology_type: "",
    radiologistNotes: "",
    images: null,
  });

  const [previewURL, setPreviewURL] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "application/dicom"];

      if (!allowedTypes.includes(file.type) && !file.name.endsWith(".dcm")) {
        Swal.fire({
          icon: "error",
          title: "🚫 Invalid File Type",
          text: "Please upload a valid JPG, PNG, or DICOM (.dcm) file.",
        });
        return;
      }

      setFormData({ ...formData, images: file });

      if (file.type === "image/jpeg" || file.type === "image/png") {
        const imageURL = URL.createObjectURL(file);
        setPreviewURL(imageURL);
      } else {
        setPreviewURL(null);
        Swal.fire({
          icon: "info",
          title: "📄 DICOM File Selected",
          text: `You have selected a DICOM file: ${file.name}`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "⚠️ No File Selected",
        text: "Please select a valid file before proceeding.",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.images) {
      Swal.fire({
        icon: "error",
        title: "⚠️ Missing Image",
        text: "Please upload a valid image before submitting.",
      });
      return;
    }

    Swal.fire({
      icon: "info",
      title: "Submitting...",
      text: "Your radiology record is being submitted.",
      showConfirmButton: false,
      timer: 3000,
    });

    onSubmit(formData);

    setFormData({
      national_ID: "",
      radiology_type: "",
      radiologistNotes: "",
      images: null,
    });
    setPreviewURL(null);
  };

  return (
    <>
    <div className="out-form">
      <div className="container p-4 bg-light rounded shadow-lg " style={{ border: "1px solid blue", borderRadius: "10px" }}>
        <h2 className="text-center fw-bold text-primary">Add Radiology information</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          
          {/* National ID */}
          <div className="col-md-6">
            <label htmlFor="nationalID" className="form-label fw-semibold">National ID</label>
            <input
              type="text"
              className="form-control"
              id="nationalID"
              name="national_ID"
              placeholder="Enter national ID"
              value={formData.national_ID || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Radiology Type */}
          <div className="">
            <label htmlFor="radiologyType" className="form-label fw-semibold">Radiology Type</label>
            <input
              type="text"
              className="form-control"
              id="radiologyType"
              name="radiology_type"
              placeholder="Enter radiology type"
              value={formData.radiology_type || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Radiologist Notes */}
          <div className="">
            <label htmlFor="radiologistNotes" className="form-label fw-semibold">Radiologist Notes</label>
            <textarea
              name="radiologistNotes"
              className="form-control"
              id="radiologistNotes"
              placeholder="Enter radiologist notes"
              value={formData.radiologistNotes || ""}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Upload Image */}
          <div className="">
            <label htmlFor="uploadImage" className="form-label fw-semibold">Upload Image ( DICOM)</label>
            <input
              type="file"
              accept=".DCM, .jpg, .jpeg, .png"
              className="form-control"
              id="uploadImage"
              onChange={handleFileUpload}
              required
            />
          </div>

          {/* Image Preview */}
          {previewURL && (
            <div className="text-center">
              <h5 className="text-success">Image Preview:</h5>
              <img
                src={previewURL}
                alt="Radiology Preview"
                style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <button type="submit" className="btn btn-primary shadow-sm px-4">Add</button>
            <Link to={'/dashboard'} className="btn btn-secondary shadow-sm px-4">Back</Link>
          </div>

        </form>
      </div>
    </div>
    </>
  );
};

export default RadiologyForm;
