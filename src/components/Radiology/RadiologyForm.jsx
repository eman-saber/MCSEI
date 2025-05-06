import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import "../Citizen/CreateCitizen.css";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstone.registerImageLoader("wadouri", cornerstoneWADOImageLoader.wadouri.loadImage);

cornerstoneWADOImageLoader.webWorkerManager.initialize({
  webWorkerPath:
    "https://unpkg.com/cornerstone-wado-image-loader@4.0.1/dist/cornerstoneWADOImageLoaderWebWorker.js",
  taskConfiguration: {
    decodeTask: {
      codecsPath:
        "https://unpkg.com/cornerstone-wado-image-loader@4.0.1/dist/cornerstoneWADOImageLoaderCodecs.js",
    },
  },
});

const RadiologyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    national_ID: "",  
    radiology_type: "",
    radiologistNotes: "",
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const dicomRefs = useRef({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "application/dicom", "application/octet-stream"];
    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith(".dcm")) {
        Swal.fire({
          icon: "error",
          title: "🚫 Invalid File Type",
          text: `${file.name} is not a valid JPG, PNG, or DICOM file.`,
        });
        return;
      }

      newImages.push(file);

      if (file.type === "image/jpeg" || file.type === "image/png") {
        const imageURL = URL.createObjectURL(file);
        newPreviews.push({ type: "img", src: imageURL });
      } else {
        const dicomUrl = URL.createObjectURL(file);
        newPreviews.push({ type: "dicom", src: dicomUrl });
      }
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  useEffect(() => {
    previews.forEach((preview) => {
      if (preview.type === "dicom" && dicomRefs.current[preview.src]) {
        cornerstone.enable(dicomRefs.current[preview.src]);
        cornerstone
          .loadImage(`wadouri:${preview.src}`)
          .then((image) => {
            cornerstone.displayImage(dicomRefs.current[preview.src], image);
          })
          .catch((err) => {
            console.error("DICOM load error:", err);
            Swal.fire({
              icon: "error",
              title: "DICOM Error",
              text: "Failed to display the DICOM image.",
            });
          });
      }
    });
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.national_ID || !formData.radiology_type || !formData.radiologistNotes) { 
      Swal.fire({
        icon: "error",
        title: "⚠️ Missing Fields",
        text: "Please fill in all required fields before submitting.",
      });
      return;
    }

    if (formData.images.length === 0) {
      Swal.fire({
        icon: "error",
        title: "⚠️ Missing Image",
        text: "Please upload at least one image before submitting.",
      });
      return;
    }

    onSubmit(formData);

    setFormData({
      national_ID: "",  
      radiology_type: "",
      radiologistNotes: "",
      images: [],
    });
    setPreviews([]);
  };

  return (
    <div className="out-form mt-0">
      <div className="container p-4 bg-light rounded shadow-lg" style={{ border: "1px solid blue", borderRadius: "10px" }}>
        <h2 className="text-center fw-bold text-primary">Add Radiology Information</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="national_ID" className="form-label fw-semibold">Citizen National ID</label>
            <input
              type="text"
              className="form-control"
              id="national_ID"
              name="national_ID"
              placeholder="Enter national ID"
              value={formData.national_ID}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="radiologyType" className="form-label fw-semibold">Radiology Type</label>
            <input
              type="text"
              className="form-control"
              id="radiologyType"
              name="radiology_type"
              placeholder="Enter radiology type"
              value={formData.radiology_type}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="radiologistNotes" className="form-label fw-semibold">Radiologist Notes</label>
            <textarea
              name="radiologistNotes"
              className="form-control"
              id="radiologistNotes"
              placeholder="Enter radiologist notes"
              value={formData.radiologistNotes}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="uploadImage" className="form-label fw-semibold">Upload Images (DICOM / JPG / PNG)</label>
            <input
              type="file"
              accept=".dcm,.jpg,.jpeg,.png"
              className="form-control"
              id="uploadImage"
              onChange={handleFileUpload}
              multiple
              required
            />
          </div>

          <div className="text-center mt-3">
            {previews.map((preview, index) =>
              preview.type === "img" ? (
                <div key={index} className="mb-3">
                  <h5 className="text-success">Image Preview:</h5>
                  <img
                    src={preview.src}
                    alt={`Radiology Preview ${index}`}
                    style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
                  />
                </div>
              ) : (
                <div key={index} className="mb-3">
                  <h5 className="text-success">DICOM Preview:</h5>
                  <div
                    ref={(el) => {
                      if (el) dicomRefs.current[preview.src] = el;
                    }}
                    style={{ width: "100%", height: "512px", backgroundColor: "black", borderRadius: "10px" }}
                  ></div>
                </div>
              )
            )}
          </div>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <button type="submit" className="btn btn-primary shadow-sm px-4">Add</button>
            <Link to={"/dashboard"} className="btn btn-secondary shadow-sm px-4">Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RadiologyForm;
